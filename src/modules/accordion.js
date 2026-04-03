// Experience accordion — handles the "Me" section where each job (Salesforce, Kajabi, etc.)
// can be expanded. Hover previews the detail panel, click locks it in place.
export default function initAccordion() {
  var activeIndex = 0

  // Switch the active accordion item and its matching detail panel
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

  // Hover shows a preview, mouseleave reverts after a short delay, click commits the selection
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
