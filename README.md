<div align="center">

# MF Portfolio Website

<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=500&size=18&pause=1000&color=F59E0B&center=true&vCenter=true&width=500&lines=Hello!+This+is+my+personal+portfolio;Built+with+vanilla+JavaScript,+CSS,+and+a+lot+of+care" alt="Typing SVG" />

<br/>

<img src="https://img.shields.io/badge/Vanilla%20JavaScript-%F0%9F%92%9B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111" />
<img src="https://img.shields.io/badge/CSS-%F0%9F%8E%A8-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-%E2%9A%A1-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/From%20Scratch-%F0%9F%8C%B8-FF8BA7?style=for-the-badge" />

</div>

---

<div align="center">



I wanted a site that felt intentional in every detail. Just vanilla JavaScript, CSS, and a lot of care put into every interaction. Everything here was written from scratch.

</div>

---

## The 3D Hero

> The centerpiece of the site is a hand-coded 2D canvas that simulates a 3D Salesforce cloud. It renders orbital rings, glowing satellites with motion trails, a nucleus made of interconnected surface nodes, and field lines that connect them dynamically. The whole scene rotates and reacts to mouse movement in real time, and fades smoothly as you scroll down. It's not Three.js or WebGL — it's plain Canvas 2D with custom projection math, built to feel alive without heavy dependencies.

---

## Interactions & Effects

<table>
<tr>
<td width="100%">

- **Custom cursor** — A dot, a trailing ring, and a rotating SVG text that appears on hoverable elements. The cursor also drives a dot-grid spotlight effect across the background.
- **Scroll reveal** — Sections fade in and slide up as they enter the viewport using IntersectionObserver.
- **Experience accordion** — Hovering an item previews the detail panel instantly; clicking locks it. Designed so you can browse quickly without committing.
- **Project cards** — Images start desaturated and come to life on hover with a smooth zoom. On mobile, they show at full color since there's no hover.
- **Loading sequence** — A blurred name animation introduces the site, then the canvas fades in with a layered intro where each element appears progressively.

</td>
</tr>
</table>

---

## Code Structure

<p>
Built on <strong>Vite</strong> with zero runtime dependencies. All JavaScript is organized in small ES modules under <code>src/modules/</code>:
</p>

<table>
  <thead>
    <tr>
      <th align="left">Module</th>
      <th align="left">What it does</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>main.js</code></td>
      <td>Entry point — imports styles and initializes everything</td>
    </tr>
    <tr>
      <td><code>loader.js</code></td>
      <td>Loading screen and canvas startup signal</td>
    </tr>
    <tr>
      <td><code>cursor.js</code></td>
      <td>Custom cursor + mouse position shared with the canvas</td>
    </tr>
    <tr>
      <td><code>canvas.js</code></td>
      <td>The full 3D scene — cloud, orbits, satellites, nodes, field lines</td>
    </tr>
    <tr>
      <td><code>accordion.js</code></td>
      <td>Experience section with hover preview and click locking</td>
    </tr>
    <tr>
      <td><code>reveal.js</code></td>
      <td>Scroll-triggered animations via IntersectionObserver</td>
    </tr>
  </tbody>
</table>

---

<div align="center">

✨

Styles live in a single `style.css` with four responsive breakpoints (1200 / 1024 / 768 / 480px) covering everything from large desktops down to small phones.

</div>
