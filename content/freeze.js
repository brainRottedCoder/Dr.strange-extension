/**
 * Mirror World - Page Freeze Subsystem
 * 
 * Purpose: Block all user interaction with the original page.
 * Creates an inert visual state before snapshot capture.
 */

const MirrorFreeze = {
    // State
    overlayElement: null,
    canvasElement: null,
    originalStyles: {},
    isFrozen: false,

    /**
     * Freeze the page - block interactions and prepare for collapse
     * @returns {HTMLCanvasElement} The canvas element for rendering
     */
    activate() {
        if (this.isFrozen) return this.canvasElement;

        // Cache original styles for restoration
        this.originalStyles = {
            htmlOverflow: document.documentElement.style.overflow,
            bodyOverflow: document.body.style.overflow,
            bodyPointerEvents: document.body.style.pointerEvents,
            bodyUserSelect: document.body.style.userSelect
        };

        // Block page interaction
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';

        // Create overlay container
        this.overlayElement = document.createElement('div');
        this.overlayElement.id = 'mirror-world-overlay';
        this.overlayElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999999;
      pointer-events: auto;
      background: transparent;
      overflow: hidden;
    `;

        // Create canvas for rendering
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.id = 'mirror-world-canvas';
        this.canvasElement.width = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
        this.canvasElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;

        this.overlayElement.appendChild(this.canvasElement);
        document.body.appendChild(this.overlayElement);

        this.isFrozen = true;

        return this.canvasElement;
    },

    /**
     * Get the overlay element for event binding
     * @returns {HTMLDivElement|null}
     */
    getOverlay() {
        return this.overlayElement;
    },

    /**
     * Get the canvas element for rendering
     * @returns {HTMLCanvasElement|null}
     */
    getCanvas() {
        return this.canvasElement;
    },

    /**
     * Hide the original page content (after snapshot)
     */
    hideOriginalContent() {
        // Create a dark backdrop behind the canvas
        const backdrop = document.createElement('div');
        backdrop.id = 'mirror-world-backdrop';
        backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999998;
      background: #0a0a0f;
      pointer-events: none;
    `;
        document.body.appendChild(backdrop);
    },

    /**
     * Restore original page state
     */
    restore() {
        if (!this.isFrozen) return;

        // Remove overlay elements
        const overlay = document.getElementById('mirror-world-overlay');
        const backdrop = document.getElementById('mirror-world-backdrop');

        if (overlay) overlay.remove();
        if (backdrop) backdrop.remove();

        // Restore original styles
        document.documentElement.style.overflow = this.originalStyles.htmlOverflow || '';
        document.body.style.overflow = this.originalStyles.bodyOverflow || '';
        document.body.style.pointerEvents = this.originalStyles.bodyPointerEvents || '';
        document.body.style.userSelect = this.originalStyles.bodyUserSelect || '';

        // Reset state
        this.overlayElement = null;
        this.canvasElement = null;
        this.originalStyles = {};
        this.isFrozen = false;
    },

    /**
     * Check if page is currently frozen
     * @returns {boolean}
     */
    isActive() {
        return this.isFrozen;
    }
};
