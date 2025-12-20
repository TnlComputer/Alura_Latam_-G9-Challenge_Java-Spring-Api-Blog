(async () => {
  const token = localStorage.getItem('token');
  let currentUser = null;

  // =========================
  // OBTENER USUARIO
  // =========================
  if (token) {
    try {
      const res = await fetch('http://localhost:8081/auth/me', {
        headers: {Authorization: `Bearer ${token}`}
      });
      if (res.ok) {
        currentUser = await res.json(); // { id, fullName, email, roles }
      } else {
        console.warn('No se pudo obtener currentUser, usando mock temporal');
      }
    } catch (e) {
      console.error('Error obteniendo usuario', e);
    }
  }

  const categoriesContainer = document.getElementById('categoriesContainer');
  const postsContainer = document.getElementById('postsContainer');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const searchInput = document.getElementById('searchInput');
  const btnCrearPost = document.getElementById('btnCrearPost'); // botón ya presente en HTML

  const BACKEND = 'http://localhost:8081';
  const pageSize = 6;

  let currentPage = 0;
  let selectedCategory = null;
  let allLoadedPosts = [];

  const categoryColors = {
    general: '#0077ff',
    programacion: '#ff6600',
    backend: '#33cc33',
    data: '#9933ff',
    'data & bi': '#9933ff',
    devops: '#ffcc00',
    repositorios: '#00cccc'
  };

  function normalizeCategory(name = '') {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  // =========================
  // BOTÓN CREAR POST
  // =========================
  if (currentUser && ['USER', 'ADMIN', 'SUPER', 'COORDINATOR'].some(r => currentUser.roles.includes(r))) {
    btnCrearPost.style.display = 'inline-block';
    btnCrearPost.onclick = () => (location.href = 'crear-post.html');
  } else {
    btnCrearPost.style.display = 'none';
  }

  // =========================
  // CARGAR CATEGORÍAS
  // =========================
  async function cargarCategorias() {
    try {
      const res = await fetch(`${BACKEND}/api/categories`, {
        headers: token ? {Authorization: `Bearer ${token}`} : {}
      });

      if (!res.ok) throw new Error('No se pudieron cargar las categorías');

      const categories = await res.json();
      categoriesContainer.innerHTML = '';

      // Categoría "Todas"
      const allCard = document.createElement('div');
      allCard.classList.add('category-card', 'clickable');
      allCard.dataset.categoryId = '';
      allCard.innerHTML = `<h2>Todas</h2>`;
      const tabAll = document.createElement('div');
      tabAll.classList.add('category-tab');
      tabAll.style.backgroundColor = '#999';
      allCard.appendChild(tabAll);

      allCard.addEventListener('click', () => {
        selectedCategory = null;
        currentPage = 0;
        allLoadedPosts = [];
        cargarPosts(true);
        resaltarCategoria(allCard);
      });

      categoriesContainer.appendChild(allCard);

      // Resto de categorías
      categories.forEach(cat => {
        const normalized = normalizeCategory(cat.name);
        const card = document.createElement('div');
        card.classList.add('category-card', 'clickable');
        card.dataset.categoryId = cat.id;
        card.innerHTML = `<h2>${cat.name}</h2>`;
        const tab = document.createElement('div');
        tab.classList.add('category-tab');
        tab.style.backgroundColor = categoryColors[normalized] || '#0077ff';
        card.appendChild(tab);

        card.addEventListener('click', () => {
          selectedCategory = cat.id;
          currentPage = 0;
          allLoadedPosts = [];
          cargarPosts(true);
          resaltarCategoria(card);
        });

        categoriesContainer.appendChild(card);
      });
    } catch (e) {
      console.error('Error cargando categorías', e);
      categoriesContainer.innerHTML = '<p>Error al cargar categorías</p>';
    }
  }

  function resaltarCategoria(activeCard) {
    document.querySelectorAll('.category-card').forEach(c => {
      c.style.borderColor = '';
      c.style.boxShadow = '';
    });
    activeCard.style.borderColor = 'var(--primary)';
    activeCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }

  // =========================
  // RENDER POSTS
  // =========================
  function renderPosts(posts) {
    postsContainer.innerHTML = '';

    posts.forEach(p => {
      // console.log('Post completo:', p); // <-- Aquí verás todo el objeto
      const card = document.createElement('div');
      card.classList.add('post-card');

      const normalizedCategory = normalizeCategory(p.categoryName);
      const color = categoryColors[normalizedCategory] || '#0077ff';

      const tab = document.createElement('div');
      tab.classList.add('category-tab');
      tab.style.backgroundColor = color;
      card.appendChild(tab);

      let dateText = '';
      if (p.createdAt) {
        const d = new Date(p.createdAt);
        if (!isNaN(d.getTime())) {
          dateText = d.toLocaleDateString('es-ES', {day: 'numeric', month: 'long'});
        }
      }

      card.innerHTML += `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <div style="margin-left:16px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.5em;">👤</span>
              <strong style="font-size:1.0em;">${p.authorName || 'Desconocido'}</strong>
            </div>
            ${dateText ? `<div style="color:#999; margin-left:48px;">${dateText}</div>` : ''}
          </div>
          ${
            p.categoryName
              ? `<div style="color:${color}; font-weight:600; margin-right:16px;">#${p.categoryName}</div>`
              : ''
          }
        </div>
        <h3 style="margin-left:100px; font-size:1.20em;">${p.title}</h3>
        <p style="margin-left:100px; font-size:0.90em;">${p.mensaje || ''}</p>
      `;

      // BOTONES DE ACCIÓN
      if (currentUser) {
        const actions = document.createElement('div');
        actions.classList.add('post-actions');

        // Responder
        const replyBtn = document.createElement('button');
        replyBtn.textContent = 'Responder';
        replyBtn.onclick = e => {
          e.stopPropagation();
          location.href = `reply-post.html?id=${p.id}`;
        };
        actions.appendChild(replyBtn);

        // Editar y Cerrar/Abrir
        if (currentUser.id === p.authorId) {
          const editBtn = document.createElement('button');
          editBtn.textContent = 'Editar';
          editBtn.onclick = e => {
            e.stopPropagation();
            location.href = `edit-post.html?id=${p.id}`;
          };
          actions.appendChild(editBtn);

          const toggleBtn = document.createElement('button');
          toggleBtn.textContent = p.status === 'ABIERTO' ? 'Cerrar' : 'Abrir';
          toggleBtn.onclick = async e => {
            e.stopPropagation();
            await fetch(`${BACKEND}/api/posts/${p.id}/status`, {
              method: 'PUT',
              headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
              body: JSON.stringify({status: p.status === 'ABIERTO' ? 'CERRADO' : 'ABIERTO'})
            });
            currentPage = 0;
            allLoadedPosts = [];
            cargarPosts(true);
          };
          actions.appendChild(toggleBtn);
        }

        // Eliminar (admin/super)
        if (currentUser.roles.includes('ADMIN') || currentUser.roles.includes('SUPER')) {
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Eliminar';
          deleteBtn.onclick = async e => {
            e.stopPropagation();
            if (confirm('¿Seguro que quieres eliminar este post?')) {
              await fetch(`${BACKEND}/api/posts/${p.id}`, {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${token}`}
              });
              currentPage = 0;
              allLoadedPosts = [];
              cargarPosts(true);
            }
          };
          actions.appendChild(deleteBtn);
        }

        card.appendChild(actions);
      }

      card.onclick = () => {
        location.href = `post.html?id=${p.id}`;
      };

      postsContainer.appendChild(card);
    });
  }

  // =========================
  // CARGAR POSTS
  // =========================
  async function cargarPosts(reset = false) {
    try {
      let url = `${BACKEND}/api/posts?page=${currentPage}&size=${pageSize}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      const searchValue = searchInput?.value.trim();
      if (searchValue) url += `&search=${encodeURIComponent(searchValue)}`;

      const res = await fetch(url, {headers: token ? {Authorization: `Bearer ${token}`} : {}});
      const posts = await res.json();
      if (reset) {
        postsContainer.innerHTML = '';
        allLoadedPosts = [];
      }

      allLoadedPosts = [...allLoadedPosts, ...posts];
      renderPosts(allLoadedPosts);

      loadMoreBtn.style.display = posts.length < pageSize ? 'none' : 'inline-block';
    } catch (e) {
      console.error('Error cargando posts', e);
      postsContainer.innerHTML = '<p>Error al cargar posts</p>';
    }
  }

  // =========================
  // EVENTOS
  // =========================
  loadMoreBtn?.addEventListener('click', () => {
    currentPage++;
    cargarPosts();
  });

  searchInput?.addEventListener('input', () => {
    currentPage = 0;
    allLoadedPosts = [];
    cargarPosts(true);
  });

  // =========================
  // INIT
  // =========================
  cargarCategorias();
  cargarPosts();
})();
