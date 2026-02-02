/**
 * Mirror World - Service Worker
 * 
 * Purpose: Handle extension icon clicks and communicate with content script.
 * Uses programmatic injection when content script isn't loaded.
 */

// Track collapse state per tab
const tabState = new Map();

/**
 * Handle extension icon click
 */
chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id || !tab.url) return;

    // Check if this is a restricted page
    if (isRestrictedUrl(tab.url)) {
        console.log('Mirror World: Cannot activate on restricted page:', tab.url);
        return;
    }

    const isCollapsed = tabState.get(tab.id) || false;

    try {
        // Try to send message to existing content script
        const message = isCollapsed ? 'RESTORE_PAGE' : 'TRIGGER_COLLAPSE';
        await chrome.tabs.sendMessage(tab.id, { type: message });
        tabState.set(tab.id, !isCollapsed);
    } catch (error) {
        // Content script not loaded - inject it programmatically
        console.log('Mirror World: Content script not found, injecting...');

        try {
            await injectContentScripts(tab.id);

            // Wait a bit for scripts to initialize
            await sleep(200);

            // Now try to activate
            await chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_COLLAPSE' });
            tabState.set(tab.id, true);

        } catch (injectionError) {
            console.error('Mirror World: Failed to inject scripts', injectionError);
        }
    }
});

/**
 * Check if URL is restricted (extension cannot run there)
 */
function isRestrictedUrl(url) {
    return url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('about:') ||
        url.startsWith('edge://') ||
        url.startsWith('brave://') ||
        url.includes('chrome.google.com/webstore') ||
        url.includes('microsoftedge.microsoft.com/addons');
}

/**
 * Inject content scripts programmatically
 */
async function injectContentScripts(tabId) {
    // Inject html2canvas first
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['lib/html2canvas.min.js']
    });

    // Then inject all content scripts in order
    const scripts = [
        'content/entropy.js',
        'content/freeze.js',
        'content/snapshot.js',
        'content/shards.js',
        'content/input.js',
        'content/renderer.js',
        'content/content.js'
    ];

    for (const script of scripts) {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [script]
        });
    }

    console.log('Mirror World: Scripts injected successfully');
}

/**
 * Sleep helper
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clean up state when tab is closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
    tabState.delete(tabId);
});

/**
 * Reset state when tab is updated/navigated
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
        // Page is reloading, reset state
        tabState.delete(tabId);
    }
});

/**
 * Listen for state updates from content script
 */
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'COLLAPSE_STATE_CHANGED' && sender.tab?.id) {
        tabState.set(sender.tab.id, message.isCollapsed);
    }
});
