(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    location.href = '../login.html';
    return;
  }

  const content = document.getElementById('adminContent');
  const buttons = document.querySelectorAll('[data-view]');
  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token');
    location.href = '../login.html';
  });

  async function loadView(view) {
    try {
      const res = await fetch(`./partials/${view}.html`);
      if (!res.ok) throw new Error('Vista no encontrada');

      content.innerHTML = await res.text();

      // eliminar script previo
      const oldScript = document.getElementById('adminViewScript');
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.src = `./js/${view}.js`;
      script.id = 'adminViewScript';

      script.onload = () => {
        // 🔥 inicializar vista si existe
        const initFn = window[`init${view.charAt(0).toUpperCase() + view.slice(1)}`];
        if (typeof initFn === 'function') {
          initFn();
        }
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
})();
