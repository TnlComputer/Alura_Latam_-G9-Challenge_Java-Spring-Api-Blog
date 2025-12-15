(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  if (!themeBtn) return;

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = localStorage.getItem('theme') || (systemDark ? 'dark' : 'light');

  applyTheme(theme);

  themeBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
})();
