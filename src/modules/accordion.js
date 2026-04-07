// Experience timeline — handles the "Me" section where each job (Salesforce, Kajabi, etc.)
// can be selected. Hover previews the detail panel, click locks it in place.
export default function initAccordion() {
  var activeIndex = 0
  var yearLabels = ['2026', '2023', '2022', '2021']
  var hoverTimer

  function switchPanel(idx) {
    if (idx === activeIndex) return
    activeIndex = idx

    document.querySelectorAll('.tl-item').forEach(function(item) {
      item.classList.toggle('active', parseInt(item.dataset.index) === idx)
    })

    document.querySelectorAll('.me-detail-panel').forEach(function(panel) {
      var isTarget = parseInt(panel.dataset.panel) === idx
      if (isTarget) {
        panel.classList.add('active')
      } else {
        panel.classList.remove('active')
      }
    })

    var yearEl = document.getElementById('detailYear')
    if (yearEl) {
      yearEl.style.opacity = '0'
      setTimeout(function() {
        yearEl.textContent = yearLabels[idx] || ''
        yearEl.style.opacity = '1'
      }, 200)
    }
  }

  document.querySelectorAll('.tl-item').forEach(function(item) {
    var idx = parseInt(item.dataset.index)

    item.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimer)
      document.querySelectorAll('.me-detail-panel').forEach(function(p) {
        p.classList.toggle('active', parseInt(p.dataset.panel) === idx)
      })
      var yearEl = document.getElementById('detailYear')
      if (yearEl) yearEl.textContent = yearLabels[idx] || ''
    })

    item.addEventListener('mouseleave', function() {
      hoverTimer = setTimeout(function() {
        document.querySelectorAll('.me-detail-panel').forEach(function(p) {
          p.classList.toggle('active', parseInt(p.dataset.panel) === activeIndex)
        })
        var yearEl = document.getElementById('detailYear')
        if (yearEl) yearEl.textContent = yearLabels[activeIndex] || ''
      }, 150)
    })

    item.addEventListener('click', function() {
      clearTimeout(hoverTimer)
      switchPanel(idx)
    })
  })
}
