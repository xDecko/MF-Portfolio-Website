// Custom cursor — replaces the default cursor with a dot + ring + rotating text.
// Also exposes mouse position (targetMX/MY) for the canvas parallax effect.
// On hover over links and cards, the ring hides and the "VIEW · EXPLORE" text appears.
export default function initCursor() {
  var cDot = document.getElementById('cDot')
  var cRing = document.getElementById('cRing')
  var cText = document.getElementById('cText')
  var mx = 0, my = 0, rx = 0, ry = 0
  var targetMX = 0.5, targetMY = 0.5

  // Track mouse and update the dot grid spotlight (CSS --mx/--my vars)
  document.addEventListener('mousemove', function(e){
    document.body.style.setProperty('--mx', e.clientX + 'px')
    document.body.style.setProperty('--my', e.clientY + 'px')
    mx = e.clientX
    my = e.clientY
    cDot.style.left = (mx - 3) + 'px'
    cDot.style.top = (my - 3) + 'px'
    targetMX = e.clientX / window.innerWidth
    targetMY = e.clientY / window.innerHeight
  })

  // Ring follows the dot with a smooth lag
  function ringLoop(){
    rx += (mx - rx) * 0.1
    ry += (my - ry) * 0.1
    cRing.style.left = (rx - 16) + 'px'
    cRing.style.top = (ry - 16) + 'px'
    cText.style.left = (rx - 45) + 'px'
    cText.style.top = (ry - 45) + 'px'
    requestAnimationFrame(ringLoop)
  }
  ringLoop()

  // Expose mouse position so the canvas module can read it
  window.targetMX = () => targetMX
  window.targetMY = () => targetMY

  // Show rotating text cursor on interactive elements (except badges, CTAs, footer, accordion)
  document.querySelectorAll('a,.work-card,.svc-row').forEach(function(el){
    if(el.closest('.hero-badge-cert') || el.closest('.hero-cta') || el.classList.contains('hero-cta-secondary') || el.closest('.footer-social') || el.closest('.acc-item')) return
    el.addEventListener('mouseenter', function(){
      cRing.classList.add('hover')
      cText.classList.add('hover')
    })
    el.addEventListener('mouseleave', function(){
      cRing.classList.remove('hover')
      cText.classList.remove('hover')
    })
  })
}
