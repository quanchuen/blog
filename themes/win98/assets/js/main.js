(function() {
  var root = document.documentElement;

  // ----- Window controls -----
  var appWindow = document.getElementById('app-window');
  var taskButton = document.getElementById('task-button');

  function setMinimized(minimized) {
    root.classList.toggle('minimized', minimized);
    if (taskButton) {
      taskButton.classList.toggle('active', !minimized);
      taskButton.setAttribute('aria-pressed', String(!minimized));
    }
  }

  var minBtn = document.getElementById('win-minimize');
  if (minBtn) minBtn.addEventListener('click', function() { setMinimized(true); });

  if (taskButton) {
    taskButton.addEventListener('click', function() {
      setMinimized(!root.classList.contains('minimized'));
    });
  }

  var maxBtn = document.getElementById('win-maximize');
  function updateMaxBtn() {
    if (!maxBtn) return;
    maxBtn.setAttribute('aria-label', root.classList.contains('maximized') ? 'Restore' : 'Maximize');
  }
  if (maxBtn) {
    maxBtn.addEventListener('click', function() {
      var maximized = root.classList.toggle('maximized');
      localStorage.setItem('win98-maximized', maximized);
      updateMaxBtn();
    });
    updateMaxBtn();
  }
  // Double-clicking the title bar maximizes, like the real thing
  var titleBar = appWindow && appWindow.querySelector('.title-bar');
  if (titleBar && maxBtn) {
    titleBar.addEventListener('dblclick', function(e) {
      if (!e.target.closest('button')) maxBtn.click();
    });
  }

  var closeBtn = document.getElementById('win-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      if (closeBtn.dataset.href) window.location.href = closeBtn.dataset.href;
    });
  }

  // ----- Start menu -----
  var startBtn = document.getElementById('start-button');
  var startMenu = document.getElementById('start-menu');

  function setStartOpen(open) {
    startMenu.hidden = !open;
    startBtn.classList.toggle('active', open);
    startBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      var first = startMenu.querySelector('a');
      if (first) first.focus();
    }
  }

  if (startBtn && startMenu) {
    startBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      setStartOpen(startMenu.hidden);
    });
    document.addEventListener('click', function(e) {
      if (!startMenu.hidden && !startMenu.contains(e.target)) setStartOpen(false);
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !startMenu.hidden) {
        setStartOpen(false);
        startBtn.focus();
      }
    });
  }

  // ----- File list: clicking anywhere on a row opens it -----
  document.addEventListener('click', function(e) {
    var row = e.target.closest('.file-list tbody tr');
    if (!row || e.target.closest('a')) return;
    var link = row.querySelector('a.file-name');
    if (link) link.click();
  });

  // ----- Shut Down... (harmless: any click or key brings the desktop back) -----
  var shutdownBtn = document.getElementById('shutdown-button');
  var shutdownScreen = document.getElementById('shutdown-screen');

  if (shutdownBtn && shutdownScreen && startMenu) {
    var wake = function() {
      shutdownScreen.hidden = true;
      startBtn.focus();
    };
    shutdownBtn.addEventListener('click', function() {
      setStartOpen(false);
      shutdownScreen.hidden = false;
      // The screen holds focus, so its own keydown listener sees the next key
      shutdownScreen.focus();
    });
    shutdownScreen.addEventListener('click', wake);
    shutdownScreen.addEventListener('keydown', function(e) {
      e.preventDefault();
      wake();
    });
  }

  // ----- Tray clock -----
  var clock = document.getElementById('tray-clock');
  if (clock) {
    var tick = function() {
      var now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      clock.setAttribute('datetime', now.toISOString());
    };
    tick();
    setInterval(tick, 15000);
  }

  // ----- Vertical text toggle -----
  var verticalToggle = document.getElementById('vertical-toggle');
  var mainContent = document.getElementById('main-content');

  if (verticalToggle && mainContent) {
    var setVertical = function(on) {
      mainContent.classList.toggle('vertical-layout', on);
      verticalToggle.classList.toggle('active', on);
      verticalToggle.setAttribute('aria-pressed', String(on));
    };
    setVertical(localStorage.getItem('vertical-text') === 'true');

    verticalToggle.addEventListener('click', function() {
      var on = !mainContent.classList.contains('vertical-layout');
      setVertical(on);
      localStorage.setItem('vertical-text', on);
    });
  }
})();
