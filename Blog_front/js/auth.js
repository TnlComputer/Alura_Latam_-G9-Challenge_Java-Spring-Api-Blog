document.addEventListener('DOMContentLoaded', () => {
  // --------------------
  // DETECCIÓN DE TEMA
  // --------------------
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  // Verificar si existe el botón y asignar el tema
  if (!themeBtn) {
    console.warn('themeToggle no encontrado');
    return;
  }

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = localStorage.getItem('theme') || (systemDark ? 'dark' : 'light');

  // Aplicar el tema inicial
  applyTheme(theme);

  // Cambiar de tema
  themeBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // --------------------
  // AUTENTICACIÓN Y REDIRECCIÓN
  // --------------------
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  const protectedPages = [
    'index.html',
    'blog.html',
    'post.html',
    'admin/index.html'
  ];

  // --------------------
  // TOKEN EXPIRADO
  // --------------------
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
    return;
  }

  // Redirección si no está logueado
  if (!token && protectedPages.includes(currentPage)) {
    window.location.href = '/login.html';
    return;
  }

  // Redirección si ya está logueado y entra a login / register
  if (token && (currentPage === 'login.html' || currentPage === 'register.html')) {
    window.location.href = '/index.html';
    return;
  }

  // --------------------
  // BOTONES LOGIN / LOGOUT
  // --------------------
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutBtn = document.getElementById('logoutBtn');

  // Si hay token, mostramos el logout y ocultamos login / register
  if (token) {
    loginLink && (loginLink.style.display = 'none');
    registerLink && (registerLink.style.display = 'none');
    logoutBtn && (logoutBtn.style.display = 'inline-block');
    logoutBtn && (logoutBtn.textContent = 'Cerrar sesión');
  } else {
    logoutBtn && (logoutBtn.style.display = 'none');
    loginLink && (loginLink.style.display = 'inline-block');
    registerLink && (registerLink.style.display = 'inline-block');
    loginLink && (loginLink.textContent = 'Iniciar sesión');
    registerLink && (registerLink.textContent = 'Registrar');
  }

  // Logout manual
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });
  }

  // --------------------
  // MENÚS SEGÚN ROL
  // --------------------
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];

      const isUser =
        roles.includes('USER') ||
        roles.includes('COORDINATOR') ||
        roles.includes('ADMIN') ||
        roles.includes('SUPER');

      const isCoordinator =
        roles.includes('COORDINATOR') || roles.includes('ADMIN') || roles.includes('SUPER');

      const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER');

      // ---- Blog (todos los usuarios logueados)
      if (isUser) {
        const postMenu = document.getElementById('postMenu');
        if (postMenu) {
          postMenu.innerHTML = `<a href="blog.html">Blog</a>`;
        }
      }

      // ---- Panel Admin
      if (isAdmin) {
        const adminMenu = document.getElementById('adminMenu');
        if (adminMenu) {
          adminMenu.innerHTML = `<a href="admin/index.html">Panel Admin</a>`;
        }
      }
    } catch (e) {
      console.error('Error al leer roles del token:', e);
    }
  }

  // --------------------
  // UTIL
  // --------------------
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }
});
