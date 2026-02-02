/**
 * Mirror World - Input Interception Subsystem
 * 
 * Doctor Strange Style: Clicks BEND SPACE, not explode it
 * Each click adds structure, shifts fold axis, deepens recursion
 */

const MirrorInput = {
    // State
    foldImpulses: [],
    clickCount: 0,
    overlay: null,
    clickHandler: null,

    // Constants
    MAX_IMPULSES: 5,
    IMPULSE_DURATION: 1500,  // ms

    /**
     * Initialize input handling
     */
    init(overlayElement) {
        this.overlay = overlayElement;
        this.foldImpulses = [];
        this.clickCount = 0;

        this.clickHandler = this.handleClick.bind(this);
        this.overlay.addEventListener('click', this.clickHandler);

        // Custom cursor for mirror dimension feel
        this.overlay.style.cursor = 'crosshair';
    },

    /**
     * Handle click - bend space, don't explode
     */
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        // Create fold impulse at click position
        this.createFoldImpulse(event.clientX, event.clientY);

        // Inject entropy
        MirrorEntropy.injectClick();

        // Apply fold impulse to tiles
        MirrorTiles.applyFoldImpulse();

        this.clickCount++;
    },

    /**
     * Create a fold impulse (replaces shockwave)
     * Visual: ripples that bend geometry, not explode
     */
    createFoldImpulse(x, y) {
        if (this.foldImpulses.length >= this.MAX_IMPULSES) {
            this.foldImpulses.shift();
        }

        this.foldImpulses.push({
            x: x,
            y: y,
            startTime: performance.now(),
            progress: 0,  // 0 to 1
            isActive: true
        });
    },

    /**
     * Update fold impulses
     */
    updateFoldImpulses(deltaSeconds) {
        const currentTime = performance.now();

        for (const impulse of this.foldImpulses) {
            if (!impulse.isActive) continue;

            const elapsed = currentTime - impulse.startTime;
            impulse.progress = Math.min(1, elapsed / this.IMPULSE_DURATION);

            if (impulse.progress >= 1) {
                impulse.isActive = false;
            }
        }

        this.foldImpulses = this.foldImpulses.filter(i => i.isActive);
    },

    /**
     * Get active fold impulses for rendering
     */
    getActiveFoldImpulses() {
        return this.foldImpulses.filter(i => i.isActive);
    },

    /**
     * Get click count
     */
    getClickCount() {
        return this.clickCount;
    },

    /**
     * Cleanup
     */
    destroy() {
        if (this.overlay && this.clickHandler) {
            this.overlay.removeEventListener('click', this.clickHandler);
        }
        this.overlay = null;
        this.clickHandler = null;
        this.foldImpulses = [];
        this.clickCount = 0;
    },

    // Legacy compatibility
    updateShockwaves(deltaSeconds) {
        this.updateFoldImpulses(deltaSeconds);
    },

    applyToShards() {
        // Handled in handleClick via MirrorTiles.applyFoldImpulse()
    },

    getActiveShockwaves() {
        return this.getActiveFoldImpulses();
    }
};
