(function() {
  // Theme toggle
  var toggle = document.getElementById('theme-toggle');
  var icon = document.getElementById('theme-icon');

  function updateIcon() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    icon.textContent = isDark ? '🌙' : '☀️';
  }

  if (toggle) {
    toggle.addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateIcon();
    });
    updateIcon();
  }
})();
