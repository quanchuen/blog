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

  // Vertical text toggle
  var verticalToggle = document.getElementById('vertical-toggle');
  var mainContent = document.getElementById('main-content');

  if (verticalToggle && mainContent) {
    // Check for saved preference
    var savedVertical = localStorage.getItem('vertical-text');
    if (savedVertical === 'true') {
      mainContent.classList.add('vertical-layout');
      verticalToggle.classList.add('active');
    }

    verticalToggle.addEventListener('click', function() {
      var isVertical = mainContent.classList.toggle('vertical-layout');
      verticalToggle.classList.toggle('active', isVertical);
      localStorage.setItem('vertical-text', isVertical);
    });
  }
})();
