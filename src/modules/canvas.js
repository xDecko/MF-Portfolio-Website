// Hero 3D canvas — draws the animated Salesforce cloud with orbiting satellites,
// nucleus circles, surface nodes and field lines. Reacts to mouse movement
// and fades out on scroll. Pauses when not visible to save performance.
export default function initCanvas() {
  window.canvasPaused = false

  var c = document.getElementById('canvas3d')
  var ctx = c.getContext('2d')
  var W, H
  var mouseNX = 0.5, mouseNY = 0.5
  var mouseSpeed = 0, prevMX = 0.5, prevMY = 0.5
  var cx, cy, scale

  function resize(){
    var dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = window.innerWidth
    H = window.innerHeight
    c.width = W * dpr
    c.height = H * dpr
    c.style.width = W + 'px'
    c.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cx = W * 0.70
    cy = H * 0.53
    scale = H * 0.22
  }
  resize()
  window.addEventListener('resize', resize)

  // Get targetMX/MY from cursor module
  function getTargetMX(){ return window.targetMX ? window.targetMX() : 0.5 }
  function getTargetMY(){ return window.targetMY ? window.targetMY() : 0.5 }

  function drawCloudPath(ctx2, ox, oy, sc) {
    var offX = -46, offY = -28
    function tx(x) { return ox + (x + offX) * sc }
    function ty(y) { return oy + (y + offY) * sc }

    ctx2.beginPath()
    ctx2.moveTo(tx(38.33), ty(6.98))

    var x = 38.33, y = 6.98
    function rc(dx1, dy1, dx2, dy2, dx, dy) {
      ctx2.bezierCurveTo(tx(x + dx1), ty(y + dy1), tx(x + dx2), ty(y + dy2), tx(x + dx), ty(y + dy))
      x += dx
      y += dy
    }

    rc(2.95, -3.07, 7.05, -4.98, 11.59, -4.98)
    rc(6.04, 0, 11.3, 3.37, 14.1, 8.36)
    rc(2.44, -1.09, 5.13, -1.7, 7.97, -1.7)
    rc(10.89, 0, 19.71, 8.9, 19.71, 19.88)

    var cp1x = x, cp1y = y + 10.98
    ctx2.bezierCurveTo(tx(cp1x), ty(cp1y), tx(x - 8.82), ty(y + 19.88), tx(x - 19.71), ty(y + 19.88))
    x += -19.71
    y += 19.88

    rc(-1.33, 0, -2.63, -0.13, -3.88, -0.39)
    rc(-2.47, 4.4, -7.18, 7.38, -12.58, 7.38)
    rc(-2.26, 0, -4.4, -0.52, -6.3, -1.45)
    rc(-2.5, 5.89, -8.34, 10.02, -15.13, 10.02)

    var cp1x2 = x - 6.79, cp1y2 = y
    ctx2.bezierCurveTo(tx(cp1x2), ty(cp1y2), tx(x - 13.11), ty(y - 4.48), tx(x - 15.43), ty(y - 10.76))
    x += -15.43
    y += -10.76

    rc(-1.01, 0.21, -2.06, 0.33, -3.14, 0.33)
    rc(-8.43, 0, -15.26, -6.9, -15.26, -15.42)
    rc(0, -5.71, 3.07, -10.69, 7.63, -13.36)
    rc(-0.94, -2.16, -1.46, -4.55, -1.46, -7.05)

    ctx2.bezierCurveTo(tx(6.45), ty(7.94), tx(14.41), ty(0), tx(24.21), ty(0))
    ctx2.bezierCurveTo(tx(29.97), ty(0), tx(35.09), ty(2.74), tx(38.33), ty(6.98))

    ctx2.closePath()
  }

  function renderCloud2D(ctx2, centerX2, centerY2, cloudScale, t) {
    var fillAlpha = 0.08 + Math.sin(t * 0.5) * 0.015
    ctx2.save()
    drawCloudPath(ctx2, centerX2, centerY2, cloudScale)
    ctx2.clip()
    ctx2.fillStyle = 'rgba(1,118,211,' + fillAlpha.toFixed(4) + ')'
    ctx2.fillRect(centerX2 - 50 * cloudScale, centerY2 - 35 * cloudScale, 100 * cloudScale, 70 * cloudScale)
    ctx2.restore()

    var strokeAlpha = 0.78 + Math.sin(t * 0.4) * 0.05
    drawCloudPath(ctx2, centerX2, centerY2, cloudScale)
    ctx2.strokeStyle = 'rgba(1,118,211,' + strokeAlpha.toFixed(3) + ')'
    ctx2.lineWidth = 2.2
    ctx2.stroke()

    var innerScale = cloudScale * 0.88
    var innerAlpha = 0.36 + Math.sin(t * 0.5 + 1) * 0.04
    drawCloudPath(ctx2, centerX2, centerY2 + cloudScale * 1.5, innerScale)
    ctx2.strokeStyle = 'rgba(1,118,211,' + innerAlpha.toFixed(3) + ')'
    ctx2.lineWidth = 1.1
    ctx2.stroke()

    var hiAlpha = 0.24 + Math.sin(t * 0.3 + 2) * 0.03
    var hiScale = cloudScale * 0.95
    drawCloudPath(ctx2, centerX2, centerY2 - cloudScale * 0.8, hiScale)
    ctx2.strokeStyle = 'rgba(1,118,211,' + hiAlpha.toFixed(3) + ')'
    ctx2.lineWidth = 0.8
    ctx2.stroke()
  }

  var PI = Math.PI, TAU = PI * 2
  function lerp(a, b, t) { return a + (b - a) * t }
  function rotX(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c] }
  function rotY(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c] }
  function proj(p) { var z = p[2] + 5.5; var s = 5.5 / z; return {x: cx + p[0] * s * scale, y: cy + p[1] * s * scale, z: z, s: s} }

  var nR = 1.05
  var circles = [
    {tx: 0, ty: 0, a: 0.54, w: 1.85},
    {tx: PI / 2, ty: 0, a: 0.40, w: 1.5},
    {tx: PI / 4, ty: PI / 4, a: 0.32, w: 1.2},
    {tx: PI / 3, ty: -PI / 3, a: 0.26, w: 1.05},
    {tx: PI / 6, ty: PI / 2, a: 0.22, w: 0.9}
  ]

  var orbits = [
    {rx: 1.85, ry: 1.85, tx: 0.35, ty: 0.15, spd: 0.12, a: 0.45, w: 1.3},
    {rx: 2.15, ry: 1.90, tx: 1.10, ty: 0.40, spd: -0.08, a: 0.34, w: 1.05},
    {rx: 2.45, ry: 2.10, tx: 0.70, ty: 1.60, spd: 0.06, a: 0.25, w: 0.85}
  ]

  var sats = []
  orbits.forEach(function(o, i){
    sats.push({oi: i, ang: i * TAU / 3, spd: (0.4 + i * 0.15) * (o.spd > 0 ? 1 : -1), sz: 3.2 - i * 0.4, glow: 16 - i * 2, tLen: 25 - i * 4, trail: []})
    sats.push({oi: i, ang: i * TAU / 3 + PI, spd: (0.25 + i * 0.1) * (o.spd > 0 ? 1 : -1), sz: 1.7 - i * 0.2, glow: 8.5, tLen: 12, trail: []})
  })

  var fnodes = []
  for(var i = 0; i < 16; i++){
    fnodes.push({
      th: (i / 16) * TAU + (i % 3) * 0.4,
      ph: PI * 0.15 + (i / 16) * PI * 0.7,
      pp: Math.random() * TAU,
      ps: 0.3 + Math.random() * 0.5,
      sz: 1.2 + Math.random() * 0.9
    })
  }

  function orbitPt(o, ang, gx, gy){
    var p = [o.rx * Math.cos(ang), o.ry * Math.sin(ang), 0]
    p = rotX(p, o.tx)
    p = rotY(p, o.ty)
    p = rotX(p, gx * 0.45)
    p = rotY(p, gy * 0.45)
    return p
  }

  function nucPt(th, ph, t, gx, gy){
    var r = nR * (1 + Math.sin(t * 0.4) * 0.025 + Math.sin(th * 2 + t * 0.6) * 0.02)
    var p = [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)]
    p = rotX(p, gx)
    p = rotY(p, gy)
    return p
  }

  var time = 0
  var introTime = 0
  var introDuration = 3.8

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }
  function layerProgress(t, startPct, endPct){
    if(t <= startPct) return 0
    if(t >= endPct) return 1
    return easeOutCubic((t - startPct) / (endPct - startPct))
  }

  function draw(){
    requestAnimationFrame(draw)
    if(!window.loaderDone || window.canvasPaused) return
    time += 0.0025
    if(introTime < introDuration) introTime += 0.0167
    var introT = Math.min(introTime / introDuration, 1)

    var pCloud = layerProgress(introT, 0.0, 0.35)
    var pNucleus = layerProgress(introT, 0.08, 0.50)
    var pOrbits = layerProgress(introT, 0.10, 0.55)
    var pSats = layerProgress(introT, 0.30, 0.75)
    var pField = layerProgress(introT, 0.50, 1.0)

    var targetMX = getTargetMX()
    var targetMY = getTargetMY()
    mouseNX = lerp(mouseNX, targetMX, 0.025)
    mouseNY = lerp(mouseNY, targetMY, 0.025)
    var dmx = mouseNX - prevMX, dmy = mouseNY - prevMY
    mouseSpeed = lerp(mouseSpeed, Math.sqrt(dmx * dmx + dmy * dmy) * 60, 0.08)
    prevMX = mouseNX
    prevMY = mouseNY

    ctx.clearRect(0, 0, W, H)

    var gRY = (mouseNX - 0.5) * 0.55 + time * 0.08
    var gRX = (mouseNY - 0.5) * 0.35 + Math.sin(time * 0.2) * 0.06
    var react = 1.0 + mouseSpeed * 2.5

    // NUCLEUS great circles
    if(pNucleus > 0.001){
      var nucScale = 0.3 + pNucleus * 0.7
      for(var ci = 0; ci < circles.length; ci++){
        var gc = circles[ci]
        var ciDelay = ci * 0.06
        var ciProg = Math.max(0, Math.min(1, (pNucleus - ciDelay) / (1 - ciDelay)))
        var ba = gc.a * (1 + Math.sin(time * 0.5 + ci) * 0.15) * ciProg
        if(ba < 0.003) continue
        ctx.strokeStyle = 'rgba(1,118,211,' + ba.toFixed(3) + ')'
        ctx.lineWidth = gc.w
        var segs = ci < 2 ? 120 : 64
        ctx.beginPath()
        for(var i = 0; i <= segs; i++){
          var a = (i / segs) * TAU
          var r = nR * (1 + Math.sin(time * 0.4) * 0.025) * nucScale
          var pt = [r * Math.cos(a), r * Math.sin(a), 0]
          pt = rotX(pt, gc.tx)
          pt = rotY(pt, gc.ty)
          pt = rotY(pt, time * 0.012 * (ci % 2 === 0 ? 1 : -1))
          pt = rotX(pt, gRX)
          pt = rotY(pt, gRY)
          var pr = proj(pt)
          if(i === 0) ctx.moveTo(pr.x, pr.y)
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.stroke()
      }
    }

    // SURFACE NODES + network
    var pfn = []
    for(var i = 0; i < fnodes.length; i++){
      var fn = fnodes[i]
      var pulse = 1 + Math.sin(time * fn.ps + fn.pp) * 0.12
      var pt = nucPt(fn.th + time * 0.024, fn.ph, time, gRX, gRY)
      var pr = proj(pt)
      var da = Math.max(0.15, Math.min(0.65, (pr.z - 3.5) / 3.5))
      var sz = fn.sz * pulse * pr.s * 1.0
      pfn.push({x: pr.x, y: pr.y, z: pr.z, pt: pt, a: da, sz: sz})

      if(pNucleus > 0.001){
        var nodeProg = Math.max(0, Math.min(1, (pNucleus - i * 0.02) / (1 - i * 0.02)))

        var g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, sz * 5.5)
        g.addColorStop(0, 'rgba(1,118,211,' + (da * 0.62 * nodeProg).toFixed(3) + ')')
        g.addColorStop(1, 'rgba(1,118,211,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(pr.x, pr.y, sz * 5, 0, TAU)
        ctx.fill()

        ctx.fillStyle = 'rgba(1,118,211,' + (da * nodeProg).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(pr.x, pr.y, sz, 0, TAU)
        ctx.fill()
      }
    }

    // Surface network
    if(pNucleus > 0.3){
      var netAlpha = Math.min(1, (pNucleus - 0.3) / 0.7)
      ctx.lineWidth = 0.85
      for(var i = 0; i < pfn.length; i++){
        for(var k = 1; k <= 2; k++){
          var j = (i + k) % pfn.length
          var al = Math.min(pfn[i].a, pfn[j].a) * 0.46 * netAlpha
          ctx.strokeStyle = 'rgba(1,118,211,' + al.toFixed(3) + ')'
          ctx.beginPath()
          ctx.moveTo(pfn[i].x, pfn[i].y)
          ctx.lineTo(pfn[j].x, pfn[j].y)
          ctx.stroke()
        }
      }
    }

    // SALESFORCE CLOUD
    if(pCloud > 0.001){
      var cpt0 = rotY(rotX([0, 0, 0], gRX), gRY)
      var cpr0 = proj(cpt0)
      var cloudScale = nR * 2 * cpr0.s * scale * 0.405 / 92
      cloudScale *= (0.4 + pCloud * 0.6)
      var cloudOffX = (mouseNX - 0.5) * 7.2 + Math.sin(time * 0.7) * 1.8
      var cloudOffY = (mouseNY - 0.5) * 4.8 + Math.cos(time * 0.5) * 1.2
      ctx.globalAlpha = pCloud
      renderCloud2D(ctx, cpr0.x + cloudOffX, cpr0.y + cloudOffY, cloudScale, time)
      ctx.globalAlpha = 1
    }

    // ORBITAL PATHS
    if(pOrbits > 0.001){
      var orbScale = 0.4 + pOrbits * 0.6
      for(var oi = 0; oi < orbits.length; oi++){
        var orb = orbits[oi]
        var orbDelay = oi * 0.12
        var orbProg = Math.max(0, Math.min(1, (pOrbits - orbDelay) / (1 - orbDelay)))
        var oMod = {rx: orb.rx * orbScale, ry: orb.ry * orbScale, tx: orb.tx, ty: orb.ty + time * orb.spd}
        var oa = orb.a * (1 + Math.sin(time * 0.3 + oi * 2) * 0.1) * orbProg
        if(oa < 0.003) continue
        ctx.strokeStyle = 'rgba(1,118,211,' + oa.toFixed(3) + ')'
        ctx.lineWidth = orb.w
        ctx.beginPath()
        for(var i = 0; i <= 140; i++){
          var a = (i / 140) * TAU
          var pt = orbitPt(oMod, a, gRX, gRY)
          var pr = proj(pt)
          if(i === 0) ctx.moveTo(pr.x, pr.y)
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.stroke()
      }
    }

    // SATELLITES + trails + field lines
    for(var si = 0; si < sats.length; si++){
      var sat = sats[si]
      var orb = orbits[sat.oi]
      sat.ang += sat.spd * react * 0.003

      var oMod = {rx: orb.rx, ry: orb.ry, tx: orb.tx, ty: orb.ty + time * orb.spd}
      var pt = orbitPt(oMod, sat.ang, gRX, gRY)
      var pr = proj(pt)

      sat.trail.push({x: pr.x, y: pr.y, z: pr.z, s: pr.s})
      if(sat.trail.length > sat.tLen) sat.trail.shift()

      var satDelay = si * 0.08
      var satProg = Math.max(0, Math.min(1, (pSats - satDelay) / (1 - satDelay)))
      if(satProg < 0.003) continue

      // Trail
      if(sat.trail.length > 2){
        for(var ti = 1; ti < sat.trail.length; ti++){
          var t0 = sat.trail[ti - 1], t1 = sat.trail[ti]
          var ta = (ti / sat.trail.length) * 0.42 * satProg
          var tw = (ti / sat.trail.length) * sat.sz * 0.95
          ctx.strokeStyle = 'rgba(1,118,211,' + ta.toFixed(3) + ')'
          ctx.lineWidth = tw
          ctx.beginPath()
          ctx.moveTo(t0.x, t0.y)
          ctx.lineTo(t1.x, t1.y)
          ctx.stroke()
        }
      }

      // Glow
      var gs = sat.glow * (1 + mouseSpeed * 1.5) * satProg
      var g = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, gs)
      g.addColorStop(0, 'rgba(1,118,211,' + (0.66 * satProg).toFixed(3) + ')')
      g.addColorStop(0.4, 'rgba(1,118,211,' + (0.22 * satProg).toFixed(3) + ')')
      g.addColorStop(1, 'rgba(1,118,211,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(pr.x, pr.y, gs, 0, TAU)
      ctx.fill()

      // Core
      ctx.fillStyle = 'rgba(1,118,211,' + (0.92 * satProg).toFixed(3) + ')'
      ctx.beginPath()
      ctx.arc(pr.x, pr.y, sat.sz * pr.s * 0.85, 0, TAU)
      ctx.fill()
      ctx.fillStyle = 'rgba(1,118,211,' + (1 * satProg).toFixed(3) + ')'
      ctx.beginPath()
      ctx.arc(pr.x, pr.y, sat.sz * pr.s * 0.4, 0, TAU)
      ctx.fill()

      // Field lines
      if(pField < 0.003) continue
      var c1d = Infinity, c2d = Infinity, c1i = -1, c2i = -1
      for(var fi = 0; fi < pfn.length; fi++){
        var dx = pt[0] - pfn[fi].pt[0], dy = pt[1] - pfn[fi].pt[1], dz = pt[2] - pfn[fi].pt[2]
        var d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if(d < c1d){
          c2d = c1d
          c2i = c1i
          c1d = d
          c1i = fi
        } else if(d < c2d){
          c2d = d
          c2i = fi
        }
      }
      if(c1i >= 0){
        var fn = pfn[c1i]
        var la = Math.max(0, 0.24 - c1d * 0.02) * pField
        if(la > 0.01){
          ctx.strokeStyle = 'rgba(1,118,211,' + la.toFixed(3) + ')'
          ctx.lineWidth = 1.0
          var mx2 = (pr.x + fn.x) / 2 + (pr.y - fn.y) * 0.08
          var my2 = (pr.y + fn.y) / 2 - (pr.x - fn.x) * 0.08
          ctx.beginPath()
          ctx.moveTo(pr.x, pr.y)
          ctx.quadraticCurveTo(mx2, my2, fn.x, fn.y)
          ctx.stroke()
        }
      }
      if(c2i >= 0){
        var fn2 = pfn[c2i]
        var la2 = Math.max(0, 0.14 - c2d * 0.015) * pField
        if(la2 > 0.01){
          ctx.strokeStyle = 'rgba(1,118,211,' + la2.toFixed(3) + ')'
          ctx.lineWidth = 0.65
          var mx3 = (pr.x + fn2.x) / 2 - (pr.y - fn2.y) * 0.06
          var my3 = (pr.y + fn2.y) / 2 + (pr.x - fn2.x) * 0.06
          ctx.beginPath()
          ctx.moveTo(pr.x, pr.y)
          ctx.quadraticCurveTo(mx3, my3, fn2.x, fn2.y)
          ctx.stroke()
        }
      }
    }
  }
  draw()

  // Fade canvas on scroll
  var scrollTicking = false
  window.addEventListener('scroll', function(){
    if(scrollTicking) return
    scrollTicking = true
    requestAnimationFrame(function(){
      var cv = document.getElementById('canvas3d')
      if(!cv){ scrollTicking = false; return }
      var scrollY = window.scrollY || window.pageYOffset
      var fadeOver = window.innerHeight * 0.4
      var opacity = Math.max(0, 1 - (scrollY / fadeOver))
      cv.style.opacity = opacity
      window.canvasPaused = opacity < 0.05
      scrollTicking = false
    })
  })
}
