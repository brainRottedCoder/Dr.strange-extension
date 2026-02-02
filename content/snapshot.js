/**
 * Mirror World - Snapshot Capture Subsystem
 * 
 * Purpose: Capture the current viewport as a high-quality static image.
 * Uses html2canvas for pixel-perfect rendering, with DOM fallback.
 */

const MirrorSnapshot = {
    // State
    capturedCanvas: null,
    captureMethod: null,

    /**
     * Capture the viewport using the best available method
     * @returns {Promise<HTMLCanvasElement>}
     */
    async capture() {
        console.log('Mirror World: Capturing snapshot...');

        // Try html2canvas first for high-quality capture
        if (typeof html2canvas !== 'undefined') {
            try {
                this.capturedCanvas = await this.captureWithHtml2Canvas();
                this.captureMethod = 'html2canvas';
                console.log('Mirror World: Captured with html2canvas (high quality)');
                return this.capturedCanvas;
            } catch (error) {
                console.warn('Mirror World: html2canvas failed, using fallback', error);
            }
        }

        // Fallback to DOM-based capture
        this.capturedCanvas = this.createDOMCapture();
        this.captureMethod = 'dom-capture';
        console.log('Mirror World: Captured with DOM method (fallback)');
        return this.capturedCanvas;
    },

    /**
     * Capture using html2canvas for pixel-perfect rendering
     * @returns {Promise<HTMLCanvasElement>}
     */
    async captureWithHtml2Canvas() {
        // Get the scroll position
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Configure html2canvas for best quality
        const options = {
            // Capture area
            x: scrollX,
            y: scrollY,
            width: window.innerWidth,
            height: window.innerHeight,
            scrollX: -scrollX,
            scrollY: -scrollY,

            // Quality settings
            scale: window.devicePixelRatio || 1,  // Retina support
            useCORS: true,                         // Try to load cross-origin images
            allowTaint: true,                      // Allow tainted canvas for images

            // Performance
            logging: false,

            // Background
            backgroundColor: null,  // Preserve page background

            // Ignore the mirror world overlay
            ignoreElements: (element) => {
                return element.id === 'mirror-world-overlay' ||
                    element.id === 'mirror-world-backdrop' ||
                    element.id === 'mirror-world-canvas';
            }
        };

        const canvas = await html2canvas(document.documentElement, options);

        // If scale was applied, resize to viewport dimensions
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = window.innerWidth;
            resizedCanvas.height = window.innerHeight;
            const ctx = resizedCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, window.innerWidth, window.innerHeight);
            return resizedCanvas;
        }

        return canvas;
    },

    /**
     * Fallback: Create a visual capture by reading DOM element positions
     * This ALWAYS works regardless of CORS/CSP restrictions
     * @returns {HTMLCanvasElement}
     */
    createDOMCapture() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        // Start with page background
        const bodyStyle = getComputedStyle(document.body);
        const htmlStyle = getComputedStyle(document.documentElement);
        let bgColor = bodyStyle.backgroundColor;
        if (bgColor === 'rgba(0, 0, 0, 0)') bgColor = htmlStyle.backgroundColor;
        if (bgColor === 'rgba(0, 0, 0, 0)') bgColor = '#ffffff';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Try to draw background image if exists
        const bgImage = bodyStyle.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            // Just use the color - background images are complex
        }

        // Capture visible elements with improved rendering
        const elements = document.body.querySelectorAll('*');
        const maxElements = 500;  // Increased for better coverage
        let count = 0;

        // Sort elements by z-index for proper layering
        const sortedElements = Array.from(elements).sort((a, b) => {
            const zA = parseInt(getComputedStyle(a).zIndex) || 0;
            const zB = parseInt(getComputedStyle(b).zIndex) || 0;
            return zA - zB;
        });

        for (const el of sortedElements) {
            if (count >= maxElements) break;

            try {
                const rect = el.getBoundingClientRect();

                // Skip invisible/off-screen elements
                if (rect.width < 2 || rect.height < 2) continue;
                if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                if (rect.right < 0 || rect.left > window.innerWidth) continue;

                const style = getComputedStyle(el);
                if (style.visibility === 'hidden' || style.opacity === '0') continue;
                if (style.display === 'none') continue;

                const opacity = parseFloat(style.opacity) || 1;
                ctx.globalAlpha = opacity;

                // Draw element background
                const bg = style.backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)') {
                    ctx.fillStyle = bg;

                    // Handle border radius
                    const borderRadius = parseFloat(style.borderRadius) || 0;
                    if (borderRadius > 0) {
                        this.roundRect(ctx, rect.left, rect.top, rect.width, rect.height, borderRadius);
                        ctx.fill();
                    } else {
                        ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
                    }
                }

                // Draw borders
                const borderWidth = parseFloat(style.borderWidth) || 0;
                const borderColor = style.borderColor;
                if (borderWidth > 0 && borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    const borderRadius = parseFloat(style.borderRadius) || 0;
                    if (borderRadius > 0) {
                        this.roundRect(ctx, rect.left, rect.top, rect.width, rect.height, borderRadius);
                        ctx.stroke();
                    } else {
                        ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
                    }
                }

                // Draw text content
                const tagName = el.tagName.toLowerCase();
                const textTags = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'li', 'td', 'th', 'label', 'button', 'div'];

                if (textTags.includes(tagName) && el.childNodes.length > 0) {
                    // Check if element has direct text content
                    let hasText = false;
                    for (const child of el.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                            hasText = true;
                            break;
                        }
                    }

                    if (hasText) {
                        const textColor = style.color;
                        const fontSize = parseFloat(style.fontSize) || 16;
                        const fontFamily = style.fontFamily || 'sans-serif';
                        const fontWeight = style.fontWeight || 'normal';

                        ctx.fillStyle = textColor;
                        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
                        ctx.textBaseline = 'top';

                        // Get text content
                        let text = '';
                        for (const child of el.childNodes) {
                            if (child.nodeType === Node.TEXT_NODE) {
                                text += child.textContent;
                            }
                        }
                        text = text.trim();

                        if (text) {
                            // Simple text rendering with clipping
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(rect.left, rect.top, rect.width, rect.height);
                            ctx.clip();

                            const paddingLeft = parseFloat(style.paddingLeft) || 0;
                            const paddingTop = parseFloat(style.paddingTop) || 0;
                            ctx.fillText(text, rect.left + paddingLeft, rect.top + paddingTop, rect.width - paddingLeft * 2);

                            ctx.restore();
                        }
                    }
                }

                // Draw images
                if (tagName === 'img' && el.complete && el.naturalWidth > 0) {
                    try {
                        ctx.drawImage(el, rect.left, rect.top, rect.width, rect.height);
                    } catch (e) {
                        // Cross-origin image, draw placeholder
                        ctx.fillStyle = 'rgba(128, 128, 160, 0.3)';
                        ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
                    }
                }

                // Draw canvas elements
                if (tagName === 'canvas') {
                    try {
                        ctx.drawImage(el, rect.left, rect.top, rect.width, rect.height);
                    } catch (e) {
                        // Tainted canvas
                    }
                }

                // Draw SVG as image
                if (tagName === 'svg') {
                    try {
                        const svgData = new XMLSerializer().serializeToString(el);
                        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                        const url = URL.createObjectURL(svgBlob);
                        const img = new Image();
                        img.src = url;
                        // Note: This is async, might not render in time
                    } catch (e) {
                        // Skip SVG
                    }
                }

                ctx.globalAlpha = 1.0;
                count++;
            } catch (e) {
                // Skip problematic elements
            }
        }

        return canvas;
    },

    /**
     * Helper to draw rounded rectangles
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    /**
     * Get the captured canvas
     * @returns {HTMLCanvasElement|null}
     */
    getCanvas() {
        return this.capturedCanvas;
    },

    /**
     * Get the capture method used
     * @returns {string|null}
     */
    getMethod() {
        return this.captureMethod;
    },

    /**
     * Reset snapshot state
     */
    reset() {
        this.capturedCanvas = null;
        this.captureMethod = null;
    }
};
