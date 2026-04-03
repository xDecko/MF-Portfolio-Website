export default function initCursor() {
  var cDot = document.getElementById('cDot')
  var cRing = document.getElementById('cRing')
  var cText = document.getElementById('cText')
  var mx = 0, my = 0, rx = 0, ry = 0
  var targetMX = 0.5, targetMY = 0.5

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

  // Expose targeting for canvas
  window.targetMX = () => targetMX
  window.targetMY = () => targetMY

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
