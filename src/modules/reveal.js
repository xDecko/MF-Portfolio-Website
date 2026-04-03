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
