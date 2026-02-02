# 🪞 Mirror World

> *What if your browser stopped pretending stability was real?*

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-brightgreen?style=for-the-badge&logo=googlechrome" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Hackathon-System%20Collapse-purple?style=for-the-badge" alt="System Collapse Hackathon">
  <img src="https://img.shields.io/badge/Version-1.0.7-orange?style=for-the-badge" alt="Version 1.0.7">
</p>

---

## 🌌 Overview

**Mirror World** is a Chrome browser extension that intentionally destabilizes websites by freezing the active page, capturing its visual state, and reconstructing it as a shattered, drifting *"mirror dimension"* — a Doctor Strange–inspired alternate reality that responds to user interaction with escalating entropy.

This project was created for the **System Collapse Hackathon** (72 hours) and embodies the hackathon theme by demonstrating that **instability is not failure — it is a design material**.

### The Philosophy

Modern web interfaces enforce an illusion of permanence and control. Every click yields predictable results. Every reload restores order. **Mirror World challenges this assumption** by transforming the user's browser into a theatrical stage where stability is the anomaly and collapse is the feature.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔮 **Page Freeze** | Instantly freezes all page interactions and captures the viewport |
| 💎 **Geometric Shattering** | Divides the page into floating rectangular shards with 3D parallax |
| 🌀 **Time Stone Effects** | Doctor Strange-inspired mystical circles, aurora lights, and glowing core |
| 👆 **Fold Impulses** | Click anywhere to create hexagonal ripple disturbances |
| 📈 **Entropy System** | Chaos escalates over time — the more you interact, the faster it collapses |
| 🎬 **60fps Performance** | Smooth Canvas 2D rendering optimized for cinematic experience |
| ⎋ **Easy Exit** | Press `ESC` or click the extension icon again to restore the page |

### The Betrayal Contract

| User Expectation | System Response |
|------------------|-----------------|
| "Clicking will fix it" | Clicking accelerates collapse |
| "Waiting will stabilize it" | Inaction still leads to entropy (slowly) |
| "Refreshing will restore it" | Refresh works, but proves your surrender |
| "There's a way to win" | There is no win state — only witness or leave |

---

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Developer Mode)

1. **Download or Clone the Repository**
   ```bash
   git clone https://github.com/your-username/systemcollapse.git
   cd systemcollapse
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in your Chrome browser
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to and select the `mirror-world` folder inside this repository
   - The extension should now appear in your extensions list

5. **Pin the Extension** (Recommended)
   - Click the puzzle piece icon (🧩) in the Chrome toolbar
   - Find "Mirror World" and click the pin icon to keep it visible

### Method 2: Quick Console Activation

If the extension is already loaded, you can also trigger it from the browser console:

```javascript
// Start the collapse
window.mirrorWorldStart()

// Force exit if needed
window.mirrorWorldExit()
```

---

## 🎮 Usage

### Activating the Mirror World

1. **Navigate to any website** (works on most sites except Chrome internal pages)
2. **Click the Mirror World extension icon** in the Chrome toolbar
3. **Watch the page shatter** into floating geometric tiles
4. **Click anywhere** to create fold impulses and accelerate entropy
5. **Press `ESC`** or click the extension icon again to restore the page

### Demo Page

For the best demonstration experience, open the included demo page:

1. Navigate to `mirror-world/demo-page.html` (open it with Chrome)
2. Click the extension icon to activate
3. The dark-themed demo page provides optimal visual contrast

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Extension Icon** | Toggle Mirror World on/off |
| **ESC** | Exit Mirror World and restore page |
| **Click anywhere** | Create fold impulse (hexagonal ripple) |

---

## 🏗️ Project Structure

```
systemcollapse/
├── README.md                    # This file
├── PRD_MirrorWorld.md           # Product Requirements Document
│
└── mirror-world/                # Chrome Extension
    ├── manifest.json            # Extension manifest (MV3)
    ├── demo-page.html           # Demo page for testing
    ├── DEMO_GUIDE.md            # Demo guide
    ├── README.md                # Extension-specific readme
    │
    ├── background/
    │   └── service-worker.js    # Handles icon clicks & messaging
    │
    ├── content/
    │   ├── content.js           # Main orchestrator
    │   ├── entropy.js           # Entropy system (chaos progression)
    │   ├── freeze.js            # Page freezing logic
    │   ├── snapshot.js          # Viewport capture system
    │   ├── shards.js            # Tile tessellation & transforms
    │   ├── input.js             # Fold impulse handling
    │   └── renderer.js          # Canvas rendering engine
    │
    ├── lib/
    │   └── html2canvas.min.js   # Screenshot capture library
    │
    └── icons/
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

---

## 🔧 Technical Architecture

### Core Systems

| System | File | Purpose |
|--------|------|---------|
| **Orchestrator** | `content.js` | Coordinates all subsystems, handles lifecycle |
| **Freeze Engine** | `freeze.js` | Blocks page interactions, creates overlay |
| **Snapshot Capture** | `snapshot.js` | Captures viewport as high-res image |
| **Tile System** | `shards.js` | Creates floating rectangular tiles with transforms |
| **Entropy Engine** | `entropy.js` | Manages chaos progression over time |
| **Input Handler** | `input.js` | Detects clicks and creates fold impulses |
| **Renderer** | `renderer.js` | 60fps Canvas 2D animation loop |
| **Service Worker** | `service-worker.js` | Extension icon handling, script injection |

### Collapse Sequence

```
┌──────────────────────────────────────────────────────────────┐
│  1. TRIGGER (icon click)                                      │
│     → Inject content scripts if not loaded                    │
│     → Send TRIGGER_COLLAPSE message                           │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  2. FREEZE                                                    │
│     → Block pointer events on body                            │
│     → Create full-viewport overlay canvas                     │
│     → Hide scrollbars                                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  3. CAPTURE                                                   │
│     → Use html2canvas to capture viewport                     │
│     → Store as source canvas for tiles                        │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  4. TESSELLATE                                                │
│     → Divide image into rectangular tiles (5×4 grid)          │
│     → Assign orbit, rotation, and velocity to each tile       │
│     → Create multi-layer mirror effect                        │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  5. RENDER LOOP (60fps)                                       │
│     → Update entropy (time + user clicks)                     │
│     → Update tile transforms (orbit, slide, fade)             │
│     → Draw Time Stone background (aurora, circles)            │
│     → Draw all tiles with parallax                            │
│     → Draw fold impulse ripples                               │
│     → Draw vignette overlay                                   │
└──────────────────────────────────────────────────────────────┘
```

### Visual Effects Breakdown

| Effect | Description |
|--------|-------------|
| **Time Stone Core** | Pulsing green-white radial gradient at center |
| **Aurora Lights** | Orbiting elliptical glows with color shifts |
| **Mystical Circles** | 4 rotating rings with rune-like markers |
| **Energy Lines** | 8 radiating gradient lines from center |
| **Tile Parallax** | 3 layers of tiles at different depths |
| **Fold Impulses** | Hexagonal ripples on click |
| **Vignette** | Dark edges with green tint |
| **Scanlines** | Subtle horizontal lines at high entropy |

---

## ⚙️ Configuration

### Entropy Parameters (in `entropy.js`)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `DECAY_RATE` | 0.02 | Entropy increases per second passively |
| `CLICK_BURST` | 0.08 | Entropy added per click |
| `MAX_ENTROPY` | 1.0 | Maximum entropy value |

### Tile Parameters (in `shards.js`)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `COLS` | 5 | Number of horizontal tiles |
| `ROWS` | 4 | Number of vertical tiles |
| `MIRROR_LAYERS` | 3 | Number of depth layers |
| `ORBIT_SPEED` | 0.15 | Base orbital rotation speed |
| `SLIDE_SPEED` | 8 | Horizontal slide speed |

---

## 🎯 Demo Tips

### Best Sites for Demo

| Site | Why It Works |
|------|--------------|
| `demo-page.html` | Custom dark theme, no CSP restrictions |
| `apple.com` | Clean, high-contrast imagery |
| `awwwards.com` | Visually stunning, ironic to shatter |
| Any portfolio/landing page | Rich visuals, single-page layout |

### Avoiding Issues

- ❌ **Chrome internal pages** (`chrome://`, `chrome-extension://`) — blocked by Chrome
- ❌ **Web stores** — extension stores block content scripts
- ❌ **Sites with strict CSP** — may block html2canvas

---

## 🛠️ Development

### Prerequisites

- Google Chrome (or Chromium-based browser)
- Basic understanding of Chrome Extension APIs

### Making Changes

1. Edit files in the `mirror-world/` directory
2. Go to `chrome://extensions/`
3. Click the refresh icon (🔄) on the Mirror World extension
4. Test on any webpage

### Debugging

Open DevTools (F12) and check the Console tab for:
- `Mirror World: Ready` — Extension loaded successfully
- `Mirror World: Activating collapse...` — Trigger received
- `Mirror World: Page restored` — Clean exit

Emergency console commands:
```javascript
window.mirrorWorldExit()  // Force restore if stuck
```

---

## 📋 Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 88+ | ✅ Supported | Full functionality |
| Edge 88+ | ✅ Supported | Chromium-based |
| Brave | ✅ Supported | Chromium-based |
| Firefox | ❌ Not Supported | Different extension API |
| Safari | ❌ Not Supported | Different extension API |

---

## 🏆 Hackathon Context

**Event:** System Collapse Hackathon  
**Duration:** 72 Hours (January 30 - February 2, 2026)  
**Theme:** *Build things that don't just survive instability — they use it.*

### Why This Fits the Theme

> "Mirror World is not an animation effect layered on top of the web. It is a **reactive system** with state, feedback, thresholds, and irreversible transitions. User input is not a command — it is energy injected into the system, accelerating entropy rather than resolving it."

The system:
- Has **memory** (entropy accumulates)
- Has **rules** (clicks worsen distortion)  
- Has **end states** (collapse is inevitable)
- Demonstrates **controlled chaos with deterministic behavior**

---

## 📜 License

This project was created for the System Collapse Hackathon. Feel free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- Inspired by the **Doctor Strange Mirror Dimension** from Marvel Cinematic Universe
- Built with [html2canvas](https://html2canvas.hertzen.com/) for viewport capture
- Created for the **System Collapse Hackathon** community

---

<p align="center">
  <strong>🪞 Mirror World — Where instability is the feature, not the bug.</strong>
</p>
