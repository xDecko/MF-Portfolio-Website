export default function initAccordion() {
  var activeIndex = 0

  function switchPanel(idx) {
    if (idx === activeIndex) return
    activeIndex = idx

    document.querySelectorAll('.acc-item').forEach(function(item, i) {
      item.classList.toggle('active', i === idx)
    })

    document.querySelectorAll('.me-detail-panel').forEach(function(panel) {
      var isTarget = parseInt(panel.dataset.panel) === idx
      if (isTarget) {
        panel.classList.add('active')
      } else {
        panel.classList.remove('active')
      }
    })
  }

  var hoverTimer
  document.querySelectorAll('.acc-item').forEach(function(item, i) {
    item.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimer)
      document.querySelectorAll('.me-detail-panel').forEach(function(p) {
        p.classList.toggle('active', parseInt(p.dataset.panel) === i)
      })
    })

    item.addEventListener('mouseleave', function() {
      hoverTimer = setTimeout(function() {
        document.querySelectorAll('.me-detail-panel').forEach(function(p) {
          p.classList.toggle('active', parseInt(p.dataset.panel) === activeIndex)
        })
      }, 120)
    })

    item.addEventListener('click', function() {
      clearTimeout(hoverTimer)
      switchPanel(i)
    })
  })
}
