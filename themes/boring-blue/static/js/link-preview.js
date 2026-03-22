(function() {
  var index = null;
  var popup = null;
  var hideTimeout = null;
  var showTimeout = null;

  function init() {
    fetch('/index.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        index = {};
        data.forEach(function(item) {
          index[item.permalink] = item;
        });
        attachListeners();
      })
      .catch(function() { /* graceful degradation */ });
  }

  function attachListeners() {
    document.addEventListener('mouseover', function(e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;

      // Skip nav links
      if (link.closest('.sidebar') || link.closest('.pagination')) return;

      var item = index[href];
      if (!item) return;

      clearTimeout(hideTimeout);
      showTimeout = setTimeout(function() {
        showPopup(link, item);
      }, 300);
    });

    document.addEventListener('mouseout', function(e) {
      var link = e.target.closest('a');
      if (!link) return;

      clearTimeout(showTimeout);
      hideTimeout = setTimeout(function() {
        removePopup();
      }, 200);
    });
  }

  function showPopup(anchor, item) {
    removePopup();
    popup = document.createElement('div');
    popup.className = 'link-preview-popup';
    popup.innerHTML = '<h4>' + item.title + '</h4>' +
      '<div class="meta">' + item.date + '</div>' +
      '<div class="excerpt">' + item.summary.substring(0, 150) + '...</div>';

    document.body.appendChild(popup);

    var rect = anchor.getBoundingClientRect();
    var popupRect = popup.getBoundingClientRect();
    var top = rect.top + window.scrollY - popupRect.height - 8;
    if (top < window.scrollY) {
      top = rect.bottom + window.scrollY + 8;
    }
    popup.style.top = top + 'px';
    popup.style.left = Math.max(8, rect.left + window.scrollX) + 'px';
  }

  function removePopup() {
    if (popup && popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
    popup = null;
  }

  init();
})();
