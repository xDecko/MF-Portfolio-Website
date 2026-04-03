// Scroll reveal — watches elements with class "rv" and adds "vis" when
// they enter the viewport, triggering the CSS fade-in + slide-up animation
export default function initReveal() {
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting) e.target.classList.add('vis')
    })
  }, {threshold: 0.12})

  document.querySelectorAll('.rv').forEach(function(el){
    obs.observe(el)
  })
}
