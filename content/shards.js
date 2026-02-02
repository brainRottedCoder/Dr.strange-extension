/**
 * Mirror World - Tiles Subsystem
 * 
 * Doctor Strange Mirror Geometry
 * Creates floating rectangular tiles with mirror reflections
 * that orbit and transform in space
 */

const MirrorTiles = {
    // State
    tiles: [],
    sourceCanvas: null,
    mirrorLayers: 1,
    foldAngle: 0,
    time: 0,

    // Grid configuration
    COLS: 4,
    ROWS: 3,

    /**
     * Create rectangular mirror tiles from the captured snapshot
     */
    tessellate(canvas) {
        this.sourceCanvas = canvas;
        this.tiles = [];
        this.mirrorLayers = 1;
        this.foldAngle = 0;
        this.time = 0;

        const tileWidth = canvas.width / this.COLS;
        const tileHeight = canvas.height / this.ROWS;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        let id = 0;

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const x = col * tileWidth;
                const y = row * tileHeight;

                // Source rectangle (where to sample from)
                const srcX = x;
                const srcY = y;
                const srcW = tileWidth;
                const srcH = tileHeight;

                // Calculate tile center
                const tileCenterX = x + tileWidth / 2;
                const tileCenterY = y + tileHeight / 2;

                // Distance and angle from viewport center
                const dx = tileCenterX - centerX;
                const dy = tileCenterY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);

                // Layer based on distance from center
                const layer = distance < 150 ? 0 : (distance < 350 ? 1 : 2);

                this.tiles.push({
                    id: id++,
                    srcX, srcY, srcW, srcH,

                    // Current position
                    x: tileCenterX,
                    y: tileCenterY,

                    // Dimensions
                    width: tileWidth,
                    height: tileHeight,

                    // Transform state
                    rotation: 0,
                    orbitAngle: angle,
                    orbitRadius: 0,
                    orbitSpeed: 0.3 + Math.random() * 0.4,

                    // Mirror effects
                    flipX: col % 2 === 0,
                    flipY: row % 2 === 0,

                    // Layer and depth
                    layer: layer,

                    // Animation
                    scale: 1.0,
                    opacity: 1.0,
                    slideOffset: 0,

                    // Speeds
                    rotationSpeed: (Math.random() - 0.5) * 0.5,
                    phaseOffset: Math.random() * Math.PI * 2
                });
            }
        }

        return this.tiles;
    },

    /**
     * Get all tiles
     */
    getTiles() {
        return this.tiles;
    },

    /**
     * Get the source canvas
     */
    getSourceCanvas() {
        return this.sourceCanvas;
    },

    /**
     * Get mirror layers count
     */
    getMirrorLayers() {
        return this.mirrorLayers;
    },

    /**
     * Get current fold angle
     */
    getFoldAngle() {
        return this.foldAngle;
    },

    /**
     * Update tile transforms - continuous motion
     */
    updateTransforms(deltaSeconds, entropy) {
        this.time += deltaSeconds;

        // Global fold angle increases continuously
        this.foldAngle += deltaSeconds * 0.2 * (1 + entropy);

        for (const tile of this.tiles) {
            // Base orbital motion - always active
            const baseOrbitSpeed = 0.15 + (tile.layer * 0.05);
            const entropyBoost = entropy * 0.8 * (1 + tile.layer * 0.3);
            tile.orbitSpeed = baseOrbitSpeed + entropyBoost;
            tile.orbitAngle += tile.orbitSpeed * deltaSeconds;

            // Orbit radius expands with entropy + breathing
            const oscillation = Math.sin(this.time * 0.5 + tile.id * 0.7) * 0.08;
            const radiusMultiplier = 1 + oscillation + entropy * 0.6;
            const baseRadius = 20 + entropy * 150 * (1 + tile.layer * 0.5);
            tile.orbitRadius = baseRadius * radiusMultiplier;

            // Rotation - continuous spinning
            const baseRotation = 0.1 + entropy * 0.4;
            tile.rotation += tile.rotationSpeed * baseRotation * deltaSeconds;

            // Slide offset for depth effect
            tile.slideOffset = Math.sin(this.time * 0.3 + tile.phaseOffset) * (10 + entropy * 40);

            // Scale pulsing
            tile.scale = 0.9 + Math.sin(this.time * 0.4 + tile.id * 0.5) * 0.1 * (1 + entropy);

            // Toggle flips at high entropy
            if (entropy > 0.7 && Math.random() < 0.001) {
                tile.flipX = !tile.flipX;
            }
        }
    },

    /**
     * Apply fold impulse
     */
    applyFoldImpulse(x, y, strength) {
        this.mirrorLayers = Math.min(5, this.mirrorLayers + 1);
        this.foldAngle += Math.PI / 6;

        for (const tile of this.tiles) {
            const dx = tile.x - x;
            const dy = tile.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 300) {
                const influence = 1 - (distance / 300);
                tile.orbitSpeed += influence * strength * 2;
                tile.rotationSpeed += (Math.random() - 0.5) * influence * strength;
            }
        }
    },

    /**
     * Update tile opacity
     */
    updateOpacity(opacityFactor) {
        for (const tile of this.tiles) {
            tile.opacity = opacityFactor;
        }
    },

    /**
     * Reset
     */
    reset() {
        this.tiles = [];
        this.sourceCanvas = null;
        this.mirrorLayers = 1;
        this.foldAngle = 0;
        this.time = 0;
    }
};

// Alias for backward compatibility
const MirrorShards = MirrorTiles;
