/**
 * Mirror World - Entropy Engine
 * 
 * Purpose: Manage global entropy state as a deterministic accumulator.
 * Entropy drives all visual degradation. Given same inputs, produces same outputs.
 */

const MirrorEntropy = {
    // State
    value: 0.0,           // Global entropy (0.0 - 1.0)
    multiplier: 1.0,      // Click-based acceleration (1.0 - 3.0)
    startTime: 0,         // Timestamp of collapse start
    lastClickTime: 0,     // Timestamp of last click

    // Constants
    BASE_RATE: 0.01,      // Entropy per second at multiplier 1.0
    CLICK_ENTROPY: 0.05,  // Entropy added per click
    CLICK_MULTIPLIER: 0.15, // Multiplier added per click
    MAX_MULTIPLIER: 3.0,
    MULTIPLIER_DECAY: 0.05, // Per second when idle

    /**
     * Initialize entropy system
     */
    init() {
        this.value = 0.0;
        this.multiplier = 1.0;
        this.startTime = performance.now();
        this.lastClickTime = this.startTime;
    },

    /**
     * Update entropy each frame
     * @param {number} deltaSeconds - Time since last frame in seconds
     */
    update(deltaSeconds) {
        const currentTime = performance.now();

        // Time-based entropy increase
        const entropyIncrease = this.BASE_RATE * this.multiplier * deltaSeconds;
        this.value = Math.min(1.0, this.value + entropyIncrease);

        // Multiplier decay when not clicking
        const idleTime = currentTime - this.lastClickTime;
        if (idleTime > 500) {
            const decay = this.MULTIPLIER_DECAY * deltaSeconds;
            this.multiplier = Math.max(1.0, this.multiplier - decay);
        }

        // Guard against NaN
        if (isNaN(this.value)) {
            this.value = 0.5;
        }
    },

    /**
     * Inject entropy from user click
     */
    injectClick() {
        this.value = Math.min(1.0, this.value + this.CLICK_ENTROPY);
        this.multiplier = Math.min(this.MAX_MULTIPLIER, this.multiplier + this.CLICK_MULTIPLIER);
        this.lastClickTime = performance.now();
    },

    /**
   * Get current visual phase based on entropy thresholds
   * Mirror dimension: entropy adds STRUCTURE, not chaos
   * @returns {string} Phase name for visual effects
   */
    getPhase() {
        if (this.value < 0.2) return 'subtle';      // Barely noticeable mirroring
        if (this.value < 0.4) return 'folding';     // Tiles begin to orbit/rotate
        if (this.value < 0.6) return 'recursive';   // Multiple mirror layers visible
        if (this.value < 0.8) return 'impossible';  // Deep recursion, spatial confusion
        return 'transcendent';                      // Full mirror dimension
    },

    /**
     * Get drift speed multiplier based on entropy
     * @returns {number} Speed multiplier (1.0 - 2.5)
     */
    getDriftMultiplier() {
        return 1.0 + (this.value * 1.5);
    },

    /**
     * Get opacity reduction for shards based on entropy
     * @returns {number} Opacity (0.1 - 1.0)
     */
    getOpacityFactor() {
        if (this.value < 0.7) return 1.0;
        return Math.max(0.1, 1.0 - (this.value - 0.7) * 2.5);
    },

    /**
     * Get desaturation amount for visual effects
     * @returns {number} Desaturation (0.0 - 0.8)
     */
    getDesaturation() {
        if (this.value < 0.5) return 0;
        return Math.min(0.8, (this.value - 0.5) * 1.6);
    },

    /**
     * Reset entropy to initial state
     */
    reset() {
        this.value = 0.0;
        this.multiplier = 1.0;
        this.startTime = 0;
        this.lastClickTime = 0;
    }
};
