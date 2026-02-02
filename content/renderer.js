/**
 * Mirror World - Renderer Subsystem
 * 
 * Doctor Strange Mirror Dimension Renderer
 * Draws floating rectangular tiles with mirror reflections
 */

const MirrorRenderer = {
    // State
    canvas: null,
    ctx: null,
    sourceCanvas: null,
    animationId: null,
    lastFrameTime: 0,
    isRunning: false,
    globalTime: 0,  // For mystical animations

    /**
     * Initialize the renderer
     */
    init(targetCanvas, sourceCanvas) {
        this.canvas = targetCanvas;
        this.ctx = targetCanvas.getContext('2d');
        this.sourceCanvas = sourceCanvas;
        this.lastFrameTime = 0;
        this.isRunning = false;

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    },

    /**
     * Start the animation loop
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(this.render.bind(this));
    },

    /**
     * Main render loop
     */
    render(currentTime) {
        if (!this.isRunning) return;

        try {
            const deltaSeconds = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
            this.lastFrameTime = currentTime;

            if (deltaSeconds <= 0 || isNaN(deltaSeconds)) {
                this.animationId = requestAnimationFrame(this.render.bind(this));
                return;
            }

            // 1. Update entropy
            MirrorEntropy.update(deltaSeconds);
            const entropy = MirrorEntropy.value || 0;

            // 2. Update fold impulses
            if (MirrorInput.updateFoldImpulses) {
                MirrorInput.updateFoldImpulses(deltaSeconds);
            }

            // 3. Update tile transforms
            if (MirrorTiles.updateTransforms) {
                MirrorTiles.updateTransforms(deltaSeconds, entropy);
            }

            // 4. Clear with dark background
            this.drawBackground(entropy);

            // 5. Draw tiles in layers (back to front)
            this.drawTiles(entropy);

            // 6. Draw fold impulse effects
            this.drawFoldImpulses();

            // 7. Draw vignette
            this.drawVignette(entropy);

        } catch (error) {
            console.error('Mirror World: Render error', error);
        }

        // Next frame
        this.animationId = requestAnimationFrame(this.render.bind(this));
    },

    /**
     * Draw Time Stone inspired background with aurora effects
     */
    drawBackground(entropy) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const centerX = w / 2;
        const centerY = h / 2;

        // Update global time
        this.globalTime += 0.016;
        const time = this.globalTime;

        // VERY dark base - almost pure black
        ctx.fillStyle = '#020303';
        ctx.fillRect(0, 0, w, h);

        // Draw aurora lights FIRST (behind everything)
        this.drawAuroraLights(ctx, centerX, centerY, w, h, time, entropy);

        // Draw mystical circles (rotating rings)
        this.drawMysticalCircles(ctx, centerX, centerY, time, entropy);

        // ========== TIME STONE CORE ==========

        // Layer 1: Outer soft glow (large, subtle)
        const outerRadius = 350 + entropy * 100 + Math.sin(time) * 30;
        const outerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
        outerGlow.addColorStop(0, 'rgba(0, 255, 180, 0.15)');
        outerGlow.addColorStop(0.3, 'rgba(0, 200, 140, 0.08)');
        outerGlow.addColorStop(0.6, 'rgba(0, 100, 70, 0.03)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = outerGlow;
        ctx.fillRect(0, 0, w, h);

        // Layer 2: Mid glow (green energy)
        const midRadius = 180 + entropy * 60 + Math.sin(time * 1.5) * 20;
        const midGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, midRadius);
        midGlow.addColorStop(0, `rgba(100, 255, 200, ${0.5 + entropy * 0.2})`);
        midGlow.addColorStop(0.3, `rgba(0, 255, 170, ${0.35 + entropy * 0.15})`);
        midGlow.addColorStop(0.6, 'rgba(0, 180, 120, 0.15)');
        midGlow.addColorStop(1, 'rgba(0, 80, 60, 0)');
        ctx.fillStyle = midGlow;
        ctx.fillRect(0, 0, w, h);

        // Layer 3: Inner bright core (intense white-green)
        const innerRadius = 100 + entropy * 30 + Math.sin(time * 2) * 15;
        const innerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius);
        innerGlow.addColorStop(0, `rgba(220, 255, 240, ${0.9 + Math.sin(time * 3) * 0.1})`);
        innerGlow.addColorStop(0.2, `rgba(150, 255, 220, ${0.7 + entropy * 0.2})`);
        innerGlow.addColorStop(0.5, `rgba(50, 255, 180, ${0.4 + entropy * 0.15})`);
        innerGlow.addColorStop(1, 'rgba(0, 200, 150, 0)');
        ctx.fillStyle = innerGlow;
        ctx.fillRect(0, 0, w, h);

        // Layer 4: Brilliant white center (Time Stone core)
        const coreRadius = 40 + Math.sin(time * 4) * 10 + entropy * 15;
        const brilliantCore = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
        brilliantCore.addColorStop(0, `rgba(255, 255, 255, ${0.95 + Math.sin(time * 5) * 0.05})`);
        brilliantCore.addColorStop(0.3, `rgba(200, 255, 240, ${0.8})`);
        brilliantCore.addColorStop(0.6, 'rgba(100, 255, 200, 0.5)');
        brilliantCore.addColorStop(1, 'rgba(0, 255, 180, 0)');
        ctx.fillStyle = brilliantCore;
        ctx.fillRect(0, 0, w, h);

        // Layer 5: Pulsing energy burst
        const pulsePhase = (time * 2) % (Math.PI * 2);
        const pulseRadius = 60 + pulsePhase * 40;
        const pulseOpacity = Math.max(0, 0.4 - pulsePhase * 0.06);
        if (pulseOpacity > 0.01) {
            ctx.strokeStyle = `rgba(150, 255, 220, ${pulseOpacity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    },

    /**
     * Draw flowing aurora lights around the center
     */
    drawAuroraLights(ctx, centerX, centerY, w, h, time, entropy) {
        ctx.save();

        // Aurora configuration - multiple flowing bands
        const auroraCount = 5;

        for (let i = 0; i < auroraCount; i++) {
            const baseAngle = (i / auroraCount) * Math.PI * 2;
            const waveOffset = Math.sin(time * 0.5 + i * 1.2) * 0.5;
            const angle = baseAngle + waveOffset + time * 0.1;

            // Aurora distance from center (orbiting ring)
            const orbitRadius = 200 + i * 40 + Math.sin(time * 0.8 + i) * 30;
            const auroraX = centerX + Math.cos(angle) * orbitRadius;
            const auroraY = centerY + Math.sin(angle) * orbitRadius * 0.6; // Elliptical

            // Aurora size and intensity
            const auroraWidth = 150 + Math.sin(time * 1.2 + i * 2) * 50 + entropy * 80;
            const auroraHeight = 300 + Math.sin(time * 0.7 + i) * 100;
            const intensity = 0.15 + Math.sin(time + i * 0.8) * 0.08 + entropy * 0.1;

            // Create aurora gradient (vertical flowing light)
            const gradient = ctx.createRadialGradient(
                auroraX, auroraY, 0,
                auroraX, auroraY, auroraWidth
            );

            // Color varies per aurora band
            const hue = 150 + i * 10 + Math.sin(time * 0.3) * 20; // Green to cyan range
            gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${intensity})`);
            gradient.addColorStop(0.3, `hsla(${hue + 10}, 90%, 55%, ${intensity * 0.6})`);
            gradient.addColorStop(0.6, `hsla(${hue + 20}, 80%, 40%, ${intensity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 100, 80, 0)');

            ctx.fillStyle = gradient;

            // Draw elongated aurora shape
            ctx.save();
            ctx.translate(auroraX, auroraY);
            ctx.rotate(angle + Math.PI / 2);
            ctx.scale(1, auroraHeight / auroraWidth);
            ctx.beginPath();
            ctx.arc(0, 0, auroraWidth, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Add some flowing streaks
        for (let i = 0; i < 8; i++) {
            const streakAngle = (i / 8) * Math.PI * 2 + time * 0.15;
            const innerR = 120 + Math.sin(time * 2 + i) * 20;
            const outerR = 350 + Math.sin(time * 0.5 + i * 0.5) * 80 + entropy * 60;

            const x1 = centerX + Math.cos(streakAngle) * innerR;
            const y1 = centerY + Math.sin(streakAngle) * innerR;
            const x2 = centerX + Math.cos(streakAngle + 0.1) * outerR;
            const y2 = centerY + Math.sin(streakAngle + 0.1) * outerR;

            const streakGradient = ctx.createLinearGradient(x1, y1, x2, y2);
            const opacity = 0.2 + Math.sin(time * 3 + i) * 0.1;
            streakGradient.addColorStop(0, `rgba(100, 255, 200, ${opacity})`);
            streakGradient.addColorStop(0.5, `rgba(0, 220, 160, ${opacity * 0.5})`);
            streakGradient.addColorStop(1, 'rgba(0, 150, 100, 0)');

            ctx.strokeStyle = streakGradient;
            ctx.lineWidth = 2 + Math.sin(time + i) * 1;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);

            // Curved streak with bezier
            const midX = (x1 + x2) / 2 + Math.sin(time * 2 + i) * 30;
            const midY = (y1 + y2) / 2 + Math.cos(time * 2 + i) * 30;
            ctx.quadraticCurveTo(midX, midY, x2, y2);
            ctx.stroke();
        }

        ctx.restore();
    },

    /**
     * Draw rotating mystical circles with runes
     */
    drawMysticalCircles(ctx, centerX, centerY, time, entropy) {
        ctx.save();
        ctx.translate(centerX, centerY);

        // Multiple rotating rings
        const rings = [
            { radius: 180, width: 2, speed: 0.3, segments: 12, opacity: 0.6 },
            { radius: 250, width: 1.5, speed: -0.2, segments: 16, opacity: 0.5 },
            { radius: 320, width: 1, speed: 0.15, segments: 24, opacity: 0.4 },
            { radius: 400, width: 1, speed: -0.1, segments: 32, opacity: 0.3 }
        ];

        for (const ring of rings) {
            const rotation = time * ring.speed * (1 + entropy * 0.5);
            ctx.save();
            ctx.rotate(rotation);

            // Main ring
            ctx.strokeStyle = `rgba(0, 255, 180, ${ring.opacity})`;
            ctx.lineWidth = ring.width;
            ctx.beginPath();
            ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Glowing effect for ring
            ctx.strokeStyle = `rgba(0, 200, 150, ${ring.opacity * 0.3})`;
            ctx.lineWidth = ring.width * 4;
            ctx.beginPath();
            ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Mystical segments/runes on ring
            const segmentAngle = (Math.PI * 2) / ring.segments;
            for (let i = 0; i < ring.segments; i++) {
                const angle = i * segmentAngle;
                const x = Math.cos(angle) * ring.radius;
                const y = Math.sin(angle) * ring.radius;

                // Small notches
                ctx.strokeStyle = `rgba(0, 255, 200, ${ring.opacity * 0.8})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x * 0.95, y * 0.95);
                ctx.lineTo(x * 1.05, y * 1.05);
                ctx.stroke();

                // Every 4th segment gets a brighter mark
                if (i % 4 === 0) {
                    const glowSize = 4 + Math.sin(time * 3 + i) * 2;
                    const dotGlow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
                    dotGlow.addColorStop(0, 'rgba(100, 255, 220, 0.8)');
                    dotGlow.addColorStop(1, 'rgba(0, 255, 180, 0)');
                    ctx.fillStyle = dotGlow;
                    ctx.beginPath();
                    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();
        }

        // Energy lines radiating from center
        const lineCount = 8;
        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2 + time * 0.1;
            const length = 150 + Math.sin(time * 2 + i) * 50 + entropy * 100;

            const gradient = ctx.createLinearGradient(
                0, 0,
                Math.cos(angle) * length,
                Math.sin(angle) * length
            );
            gradient.addColorStop(0, 'rgba(0, 255, 200, 0.6)');
            gradient.addColorStop(0.5, 'rgba(0, 200, 150, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 150, 100, 0)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            ctx.stroke();
        }

        ctx.restore();
    },

    /**
     * Draw all tiles with mirror transforms
     */
    drawTiles(entropy) {
        const tiles = MirrorTiles.getTiles();
        const source = MirrorTiles.getSourceCanvas();
        const layers = MirrorTiles.getMirrorLayers();
        const foldAngle = MirrorTiles.getFoldAngle();

        if (!source || tiles.length === 0) return;

        // Sort tiles by layer for depth
        const sortedTiles = [...tiles].sort((a, b) => b.layer - a.layer);

        // Draw each layer
        for (let layer = 0; layer < layers; layer++) {
            const layerScale = 1 - (layer * 0.08);
            const layerAlpha = 1 - (layer * 0.15);
            const layerOffset = layer * 30;

            for (const tile of sortedTiles) {
                this.drawTile(tile, source, layer, layerScale, layerAlpha, layerOffset, foldAngle);
            }
        }
    },

    /**
     * Draw a single tile
     */
    drawTile(tile, source, layer, layerScale, layerAlpha, layerOffset, foldAngle) {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Calculate tile position with orbit
        const orbitX = Math.cos(tile.orbitAngle) * tile.orbitRadius;
        const orbitY = Math.sin(tile.orbitAngle) * tile.orbitRadius;

        const posX = tile.x + orbitX + tile.slideOffset * (layer + 1);
        const posY = tile.y + orbitY + layerOffset;

        ctx.save();

        // Move to tile position
        ctx.translate(posX, posY);

        // Apply rotation
        ctx.rotate(tile.rotation + foldAngle * (layer + 1) * 0.1);

        // Apply scale
        const totalScale = tile.scale * layerScale;
        ctx.scale(totalScale, totalScale);

        // Apply mirror flips
        if (tile.flipX) ctx.scale(-1, 1);
        if (tile.flipY) ctx.scale(1, -1);

        // Draw the tile
        const w = tile.width;
        const h = tile.height;

        ctx.globalAlpha = tile.opacity * layerAlpha * 0.85;

        try {
            // Draw tile content from source
            ctx.drawImage(
                source,
                tile.srcX, tile.srcY, tile.srcW, tile.srcH,
                -w / 2, -h / 2, w, h
            );
        } catch (e) {
            // Fallback solid color
            ctx.fillStyle = 'rgba(60, 60, 100, 0.5)';
            ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        // Draw tile border (glass edge effect)
        ctx.globalAlpha = 0.3 + (1 - layerAlpha) * 0.4;
        ctx.strokeStyle = 'rgba(180, 180, 220, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        ctx.restore();
    },

    /**
     * Draw fold impulse ripples
     */
    drawFoldImpulses() {
        const impulses = MirrorInput.getActiveFoldImpulses ?
            MirrorInput.getActiveFoldImpulses() : [];

        const ctx = this.ctx;

        for (const impulse of impulses) {
            const progress = impulse.progress;
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            for (let i = 0; i < 3; i++) {
                const radius = easeProgress * 350 * (1 + i * 0.3);
                const opacity = (1 - progress) * 0.3 * (1 - i * 0.25);

                ctx.save();
                ctx.translate(impulse.x, impulse.y);

                // Draw geometric ripple (hexagon)
                ctx.beginPath();
                const sides = 6;
                for (let j = 0; j <= sides; j++) {
                    const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.strokeStyle = `rgba(150, 150, 220, ${opacity})`;
                ctx.lineWidth = 2 - i * 0.5;
                ctx.stroke();

                ctx.restore();
            }
        }
    },

    /**
     * Draw vignette overlay with green tint
     */
    drawVignette(entropy) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Dark vignette with green tint at edges
        const gradient = ctx.createRadialGradient(
            w / 2, h / 2, Math.min(w, h) * 0.3,
            w / 2, h / 2, Math.max(w, h) * 0.85
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.4, 'rgba(0, 10, 8, 0.1)');
        gradient.addColorStop(0.7, `rgba(0, 20, 15, ${0.3 + entropy * 0.2})`);
        gradient.addColorStop(1, `rgba(0, 15, 10, ${0.6 + entropy * 0.3})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Subtle scanline effect for mystical feel
        if (entropy > 0.3) {
            ctx.fillStyle = 'rgba(0, 255, 180, 0.02)';
            for (let y = 0; y < h; y += 4) {
                ctx.fillRect(0, y, w, 1);
            }
        }
    },

    /**
     * Stop animation
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },

    /**
     * Check if running
     */
    isActive() {
        return this.isRunning;
    },

    /**
     * Reset
     */
    reset() {
        this.stop();
        this.canvas = null;
        this.ctx = null;
        this.sourceCanvas = null;
        this.lastFrameTime = 0;
    }
};
