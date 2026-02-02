# Mirror World — Demo Guide

## Quick Start (For Judges)

### Installation (30 seconds)
1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `mirror-world` folder
6. The shattered glass icon appears in your toolbar

### Activation
- Click the **Mirror World icon** in the toolbar
- Or use keyboard shortcut (if configured)

### Exit
- Press **ESC** to restore the page instantly
- Or click the **Mirror World icon** again

---

## Demo Script (2 Minutes)

### Setup (Before Demo)
- Have a visually rich page open (recommend: custom landing page or apple.com)
- Chrome DevTools closed (cleaner presentation)
- Full screen browser window

### The Script

| Time | Action | What to Say |
|------|--------|-------------|
| 0:00-0:15 | Show normal page, scroll around | "This is a normal webpage. You scroll, you click, you trust it." |
| 0:15-0:20 | Hover over extension icon | "What if that trust was misplaced?" |
| 0:20-0:25 | **Click the icon** | *Pause for effect* |
| 0:25-0:40 | Watch the shatter | "The page freezes. Reality fractures. Welcome to the mirror world." |
| 0:40-1:00 | Click 3-4 times slowly | "Try to fix it. Go ahead." |
| 1:00-1:15 | Click rapidly 5-6 times | "The more you interact, the faster it collapses." |
| 1:15-1:30 | Hands off, watch drift | "Every system breaks. This one does it beautifully." |
| 1:30-1:45 | Let entropy build | "There is no win state. Only witness." |
| 1:45-1:55 | Press ESC | "Or you can leave..." |
| 1:55-2:00 | Normal page restored | "...but you'll never see the page the same way again." |

### The "Wow" Moment
The instant the page shatters (0:25-0:30) must be:
- **Instant** (no loading delay)
- **Beautiful** (parallax depth, glass edges)
- **Silent** (let visuals speak)

---

## Emergency Procedures

### If ESC Doesn't Work
1. Click the extension icon again
2. Refresh the page (F5)
3. Open DevTools (F12) → Console → Type: `window.mirrorWorldExit()`

### If Page Looks Broken After Restore
1. Refresh the page (F5)
2. This should never happen, but refresh is always available

### If Extension Won't Activate
1. Check if you're on a special page (chrome://, about:, etc.)
2. These pages don't allow content scripts
3. Navigate to a normal website

---

## Recommended Demo Sites

### Primary (Safest)
Create a simple local HTML file with:
- Dark background
- High-contrast images
- No CSP restrictions

### Backup Options
| Site | Risk Level | Notes |
|------|------------|-------|
| `apple.com` | Low | Clean, visual |
| `awwwards.com` | Low | Already beautiful |
| `github.com` | Medium | Some CSP restrictions |
| `google.com` | High | May have CSP issues |

---

## Key Talking Points

### For Judges
1. **"This is not a bug, it's a feature."**
   - The collapse is intentional, controlled, deterministic.

2. **"Given the same inputs, it behaves the same way."**
   - No randomness. Pure entropy math.

3. **"Every click makes it worse."**
   - The system punishes attempts at control.

4. **"There is no win state."**
   - You can only witness or leave.

5. **"It's beautiful even when broken."**
   - Every frame is screenshot-worthy.

### System Collapse Theme Alignment
- "We built a system that uses instability instead of resisting it."
- "The collapse is the feature, not the failure."
- "User interaction doesn't fix—it accelerates."
- "Entropy is not random. It's inevitable."

---

## Technical Highlights (If Asked)

| Feature | Implementation |
|---------|----------------|
| Snapshot | html2canvas with fallback |
| Shards | 8x6 grid (48 pieces) |
| Physics | Velocity + friction + parallax |
| Entropy | Deterministic accumulator (0.01/s + 0.05/click) |
| Rendering | Canvas 2D at 60fps |
| Exit | ESC key + icon click + console failsafe |

---

## Console Commands (For Debugging)

```javascript
// Force exit
window.mirrorWorldExit()

// Check state
MirrorWorld.isActive

// Current entropy
MirrorEntropy.value

// Total clicks
MirrorInput.getClickCount()
```

---

## Pre-Demo Checklist

- [ ] Extension loaded in Chrome
- [ ] Icon visible in toolbar
- [ ] Demo page loaded and looking good
- [ ] ESC tested and working
- [ ] Browser in full screen
- [ ] DevTools closed
- [ ] Presentation notes ready
- [ ] Backup site ready if primary fails

---

*Mirror World turns interaction into entropy — the more you try to control the system, the faster it collapses.*
