// (() => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     location.href = '../login.html';
//     return;
//   }

//   const content = document.getElementById('adminContent');
//   const buttons = document.querySelectorAll('[data-view]');
//   const logoutBtn = document.getElementById('logoutBtn');

//   logoutBtn?.addEventListener('click', () => {
//     localStorage.removeItem('token');
//     location.href = '../login.html';
//   });

//   async function loadView(view) {
//     try {
//       const res = await fetch(`./partials/${view}.html`);
//       if (!res.ok) throw new Error('Vista no encontrada');

//       content.innerHTML = await res.text();

//       // eliminar script previo
//       const oldScript = document.getElementById('adminViewScript');
//       if (oldScript) oldScript.remove();

//       const script = document.createElement('script');
//       script.src = `./js/${view}.js`;
//       script.id = 'adminViewScript';

//       script.onload = () => {
//         // 🔥 inicializar vista si existe
//         const initFn = window[`init${view.charAt(0).toUpperCase() + view.slice(1)}`];
//         if (typeof initFn === 'function') {
//           initFn();
//         }
//       };

//       document.body.appendChild(script);

//     } catch (e) {
//       console.error(e);
//       content.innerHTML = '<p>Error al cargar la vista</p>';
//     }
//   }

//   buttons.forEach(btn => {
//     btn.addEventListener('click', () => {
//       loadView(btn.dataset.view);
//     });
//   });
// })();




document.addEventListener('DOMContentLoaded', () => {
  // =============================
  // VARIABLES GLOBALES
  // =============================
  const tokenKey = 'token';
  const token = localStorage.getItem(tokenKey);
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const logoutBtn = document.getElementById('logoutBtn');
  const currentPage = window.location.pathname.split('/').pop();
  const protectedPages = [
    'index.html',
    'blog.html',
    'post.html',
    'admin/index.html'
  ];
  const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 min
  let inactivityTimer;

  // =============================
  // TEMA
  // =============================
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = localStorage.getItem('theme') || (systemDark ? 'dark' : 'light');
  applyTheme(theme);

  themeBtn?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn && (themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙');
  }

  // =============================
  // FUNCIÓN LOGOUT
  // =============================
  function logout(msg) {
    alert(msg || 'Tu sesión ha expirado.');
    localStorage.removeItem(tokenKey);
    window.location.href = '/login.html';
  }

  // =============================
  // TOKEN Y REDIRECCIÓN
  // =============================
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  // Verificar token al cargar
  if (!token && protectedPages.includes(currentPage)) {
    window.location.href = '/login.html';
    return;
  }
  if (token && isTokenExpired(token)) {
    logout('Tu sesión ha expirado.');
    return;
  }
  if (token && (currentPage === 'login.html' || currentPage === 'register.html')) {
    window.location.href = '/index.html';
    return;
  }

  // =============================
  // BOTONES LOGIN / LOGOUT
  // =============================
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');

  if (token) {
    loginLink && (loginLink.style.display = 'none');
    registerLink && (registerLink.style.display = 'none');
    logoutBtn && (logoutBtn.style.display = 'inline-block');
    logoutBtn && (logoutBtn.textContent = 'Cerrar sesión');
  } else {
    logoutBtn && (logoutBtn.style.display = 'none');
    loginLink && (loginLink.style.display = 'inline-block');
    registerLink && (registerLink.style.display = 'inline-block');
  }

  logoutBtn?.addEventListener('click', () => {
    logout('Has cerrado sesión.');
  });

  // =============================
  // MENÚS SEGÚN ROL
  // =============================
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];

      const isUser =
        roles.includes('USER') ||
        roles.includes('COORDINATOR') ||
        roles.includes('ADMIN') ||
        roles.includes('SUPER');

      const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER');

      if (isUser) {
        const postMenu = document.getElementById('postMenu');
        postMenu && (postMenu.innerHTML = `<a href="blog.html">Blog</a>`);
      }

      if (isAdmin) {
        const adminMenu = document.getElementById('adminMenu');
        adminMenu && (adminMenu.innerHTML = `<a href="admin/index.html">Panel Admin</a>`);
      }
    } catch (e) {
      console.error('Error al leer roles del token:', e);
    }
  }

  // =============================
  // TIMEOUT DE INACTIVIDAD
  // =============================
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      logout('Sesión cerrada por inactividad.');
    }, SESSION_TIMEOUT);
  }

  ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt =>
    document.addEventListener(evt, resetInactivityTimer)
  );

  resetInactivityTimer();

  // Revisar token cada minuto
  setInterval(() => {
    const currentToken = localStorage.getItem(tokenKey);
    if (!currentToken || isTokenExpired(currentToken)) {
      logout('Tu sesión ha expirado.');
    }
  }, 60000);

  // =============================
  // CARGA DINÁMICA DE VISTAS (USERS / POSTS)
  // =============================
  const content = document.getElementById('adminContent');
  const buttons = document.querySelectorAll('[data-view]');

  async function loadView(view) {
    try {
      const res = await fetch(`./partials/${view}.html`);
      if (!res.ok) throw new Error('Vista no encontrada');

      content.innerHTML = await res.text();

      // eliminar script previo
      const oldScript = document.getElementById('adminViewScript');
      oldScript?.remove();

      const script = document.createElement('script');
      script.src = `./js/${view}.js`;
      script.id = 'adminViewScript';

      script.onload = () => {
        const initFn = window[`init${view.charAt(0).toUpperCase() + view.slice(1)}`];
        typeof initFn === 'function' && initFn();
      };

      document.body.appendChild(script);
    } catch (e) {
      console.error(e);
      content.innerHTML = '<p>Error al cargar la vista</p>';
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadView(btn.dataset.view);
    });
  });
});
