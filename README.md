# MF Portfolio Website

My personal portfolio — I'm a Multimedia Engineer & CRM Specialist based in Cali, Colombia.

I wanted a site that felt intentional in every detail. No templates, no UI frameworks, no libraries. Just vanilla JavaScript, CSS, and a lot of care put into every interaction. Everything here was written from scratch.

## The 3D Hero

The centerpiece of the site is a hand-coded 2D canvas that simulates a 3D Salesforce cloud. It renders orbital rings, glowing satellites with motion trails, a nucleus made of interconnected surface nodes, and field lines that connect them dynamically. The whole scene rotates and reacts to mouse movement in real time, and fades smoothly as you scroll down. It's not Three.js or WebGL — it's plain Canvas 2D with custom projection math, built to feel alive without heavy dependencies.

## Interactions & Effects

- **Custom cursor** — A dot, a trailing ring, and a rotating SVG text that appears on hoverable elements. The cursor also drives a dot-grid spotlight effect across the background.
- **Scroll reveal** — Sections fade in and slide up as they enter the viewport using IntersectionObserver.
- **Experience accordion** — Hovering an item previews the detail panel instantly; clicking locks it. Designed so you can browse quickly without committing.
- **Project cards** — Images start desaturated and come to life on hover with a smooth zoom. On mobile, they show at full color since there's no hover.
- **Loading sequence** — A blurred name animation introduces the site, then the canvas fades in with a layered intro where each element appears progressively.

## Code Structure

Built on **Vite** with zero runtime dependencies. All JavaScript is organized in small ES modules under `src/modules/`:

| Module | What it does |
|---|---|
| `main.js` | Entry point — imports styles and initializes everything |
| `loader.js` | Loading screen and canvas startup signal |
| `cursor.js` | Custom cursor + mouse position shared with the canvas |
| `canvas.js` | The full 3D scene — cloud, orbits, satellites, nodes, field lines |
| `accordion.js` | Experience section with hover preview and click locking |
| `reveal.js` | Scroll-triggered animations via IntersectionObserver |

Styles live in a single `style.css` with four responsive breakpoints (1200 / 1024 / 768 / 480px) covering everything from large desktops down to small phones.

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
