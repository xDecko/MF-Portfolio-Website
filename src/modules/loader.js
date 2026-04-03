export default function initLoader() {
  window.loaderDone = false
  document.getElementById('canvas3d').style.opacity = '0'
  document.getElementById('canvas3d').style.transition = 'opacity 0.8s ease'

  window.addEventListener('load', function(){
    setTimeout(function(){
      document.getElementById('loader').classList.add('hidden')
      setTimeout(function(){
        window.loaderDone = true
        var cv = document.getElementById('canvas3d')
        cv.style.transition = 'none'
        cv.style.opacity = '1'
      }, 600)
    }, 1000)
  })
}
