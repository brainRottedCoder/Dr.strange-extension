/**
 * Mirror World - Content Script Orchestrator
 * 
 * Purpose: Entry point that coordinates all subsystems.
 * Handles message routing, lifecycle management, and ESC exit.
 */

const MirrorWorld = {
    // State
    isActive: false,
    escListener: null,

    /**
     * Initialize the extension (called once on page load)
     */
    init() {
        try {
            // Listen for messages from service worker
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
            }
            console.log('Mirror World: Ready');
        } catch (error) {
            console.warn('Mirror World: Init error (may be restricted page)', error);
        }
    },

    /**
     * Handle messages from service worker
     * @param {Object} message - The message object
     * @param {Object} sender - Message sender info
     * @param {Function} sendResponse - Response callback
     */
    handleMessage(message, sender, sendResponse) {
        switch (message.type) {
            case 'TRIGGER_COLLAPSE':
                this.activate();
                sendResponse({ success: true });
                break;

            case 'RESTORE_PAGE':
                this.deactivate();
                sendResponse({ success: true });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown message type' });
        }

        return true; // Keep message channel open for async response
    },

    /**
     * Activate the mirror world collapse
     */
    async activate() {
        if (this.isActive) return;

        console.log('Mirror World: Activating collapse...');

        try {
            // 1. Freeze the page and get canvas
            const canvas = MirrorFreeze.activate();

            if (!canvas) {
                throw new Error('Failed to create overlay canvas');
            }

            // 2. Initialize entropy system
            MirrorEntropy.init();

            // 3. Capture snapshot (with brief delay for freeze to complete)
            await new Promise(resolve => setTimeout(resolve, 50));
            const sourceCanvas = await MirrorSnapshot.capture();

            // 4. Hide original content after capture
            MirrorFreeze.hideOriginalContent();

            // 5. Create mirror tiles (Doctor Strange geometry)
            MirrorTiles.tessellate(sourceCanvas);

            // 6. Initialize input handling (fold impulses)
            const overlay = MirrorFreeze.getOverlay();
            MirrorInput.init(overlay);

            // 7. Initialize renderer and start animation
            MirrorRenderer.init(canvas, sourceCanvas);
            MirrorRenderer.start();

            // 8. Set up ESC key listener
            this.setupEscListener();

            // 9. Mark as active
            this.isActive = true;

            // 10. Notify service worker
            this.notifyStateChange(true);

            console.log('Mirror World: Mirror dimension active');

        } catch (error) {
            console.error('Mirror World: Activation failed', error);
            this.deactivate();
        }
    },

    /**
     * Deactivate and restore the original page
     */
    deactivate() {
        if (!this.isActive && !MirrorFreeze.isActive()) return;

        console.log('Mirror World: Restoring page...');

        // 1. Stop animation
        MirrorRenderer.stop();

        // 2. Clean up input
        MirrorInput.destroy();

        // 3. Reset tiles
        MirrorTiles.reset();

        // 4. Reset snapshot
        MirrorSnapshot.reset();

        // 5. Reset entropy
        MirrorEntropy.reset();

        // 6. Restore page (removes overlay, restores styles)
        MirrorFreeze.restore();

        // 7. Remove ESC listener
        this.removeEscListener();

        // 8. Mark as inactive
        this.isActive = false;

        // 9. Notify service worker
        this.notifyStateChange(false);

        // 10. Reset renderer
        MirrorRenderer.reset();

        console.log('Mirror World: Page restored');
    },

    /**
     * Set up ESC key listener for exit
     */
    setupEscListener() {
        this.escListener = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                this.deactivate();
            }
        };

        document.addEventListener('keydown', this.escListener, true);
    },

    /**
     * Remove ESC key listener
     */
    removeEscListener() {
        if (this.escListener) {
            document.removeEventListener('keydown', this.escListener, true);
            this.escListener = null;
        }
    },

    /**
     * Notify service worker of state change
     * @param {boolean} isCollapsed - Current collapse state
     */
    notifyStateChange(isCollapsed) {
        try {
            chrome.runtime.sendMessage({
                type: 'COLLAPSE_STATE_CHANGED',
                isCollapsed: isCollapsed
            });
        } catch (e) {
            // Ignore errors (extension context may be invalid)
        }
    },

    /**
     * Check if mirror world is currently active
     * @returns {boolean}
     */
    isCollapsed() {
        return this.isActive;
    },

    /**
     * Emergency force restore - guaranteed to work even if subsystems fail
     * Call this if normal deactivate fails
     */
    forceRestore() {
        console.log('Mirror World: FORCE RESTORE initiated');

        // Force stop animation
        try { MirrorRenderer.stop(); } catch (e) { }

        // Force remove overlay elements
        const overlay = document.getElementById('mirror-world-overlay');
        const backdrop = document.getElementById('mirror-world-backdrop');
        if (overlay) overlay.remove();
        if (backdrop) backdrop.remove();

        // Force restore body styles
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
        document.body.style.userSelect = '';

        // Remove listener
        if (this.escListener) {
            document.removeEventListener('keydown', this.escListener, true);
            this.escListener = null;
        }

        // Reset state
        this.isActive = false;

        // Notify
        this.notifyStateChange(false);

        console.log('Mirror World: Force restore complete');
    }
};

// Initialize when script loads
try {
    MirrorWorld.init();
} catch (e) {
    console.warn('Mirror World: Init failed', e);
}

// Log that scripts loaded
console.log('%c MIRROR WORLD LOADED ', 'background: #6a0dad; color: white; font-size: 16px; padding: 5px;');
console.log('Mirror World: Click the extension icon in toolbar to activate, or call window.mirrorWorldStart()');
console.log('Mirror World: Press ESC or call window.mirrorWorldExit() to restore page');

// Expose emergency exit to window for demo failsafe
try {
    window.mirrorWorldExit = () => {
        MirrorWorld.forceRestore();
        return 'Mirror World force restored';
    };
    // Also expose manual trigger
    window.mirrorWorldStart = () => {
        MirrorWorld.activate();
        return 'Mirror World starting...';
    };
} catch (e) {
    // Window access may be restricted
}
