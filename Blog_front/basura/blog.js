// (() => {
//   const postsContainer = document.getElementById('postsContainer');
//   const searchInput = document.getElementById('searchInput');
//   const categoryFilter = document.getElementById('categoryFilter');
//   const loadMoreBtn = document.getElementById('loadMoreBtn');

//   if (!postsContainer) return;

//   let POSTS = [];
//   let filteredPosts = [];
//   let page = 0;
//   const SIZE = 6;
//   const BACKEND = 'http://localhost:8081';
//   const token = localStorage.getItem('token'); // JWT

//   // -----------------------------
//   // Leer filtro de URL o localStorage
//   // -----------------------------
//   const params = new URLSearchParams(window.location.search);
//   let selectedCategory = params.get('category') || localStorage.getItem('selectedCategory') || '';

//   // Si viene de URL, guardamos temporalmente
//   if (params.get('category')) {
//     localStorage.setItem('selectedCategory', selectedCategory);
//   }

//   // Inicializar select
//   if (categoryFilter) categoryFilter.value = selectedCategory;

//   // -----------------------------
//   // FETCH POSTS
//   // -----------------------------
//   async function fetchPosts() {
//     try {
//       let url = `${BACKEND}/api/posts?page=${page}&size=${SIZE}`;

//       // Filtrar por categoría si existe
//       const category = categoryFilter?.value || selectedCategory;
//       if (category) url += `&category=${encodeURIComponent(category)}`;

//       const res = await fetch(url, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: token ? `Bearer ${token}` : ''
//         }
//       });

//       if (!res.ok) {
//         if (res.status === 401 || res.status === 403) {
//           window.location.href = 'login.html';
//         }
//         throw new Error('Error al cargar posts');
//       }

//       const data = await res.json();
//       const posts = data.content || data;

//       // Agregar posts a la lista
//       POSTS = [...POSTS, ...posts];
//       applyFilters();

//       loadMoreBtn.style.display = posts.length < SIZE ? 'none' : 'inline-block';
//     } catch (err) {
//       console.error(err);
//       postsContainer.innerHTML = '<p>No se pudieron cargar los posts.</p>';
//     }
//   }

//   // -----------------------------
//   // RENDER POSTS
//   // -----------------------------
//   function renderPosts(posts) {
//     postsContainer.innerHTML = '';
//     if (posts.length === 0) {
//       postsContainer.innerHTML = '<p>No se encontraron posts.</p>';
//       return;
//     }

//     posts.forEach(post => {
//       const card = document.createElement('article');
//       card.className = 'post-card clickable fade-in';
//       card.onclick = () => (location.href = `post.html?id=${post.id}`);
//       card.innerHTML = `
//           ${post.imageUrl ? `<img src="${post.imageUrl}" alt="" style="width:100%; max-height:300px; object-fit:cover; border-radius:4px;">` : ''}
//           <h3>${post.title || 'Sin título'}</h3>
//           <p>${post.excerpt || post.content?.slice(0, 100) + '...'}</p>
//           <p><strong>Autor:</strong> ${post.authorName || 'Desconocido'}</p>
//           <p><strong>Categoría:</strong> ${post.category || 'General'}</p>
//           <p><strong>Estado:</strong> ${post.status || 'ABIERTO'}</p>
//           <p><small>${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</small></p>
//       `;
//       postsContainer.appendChild(card);
//     });
//   }

//   // -----------------------------
//   // FILTRO LOCAL (SEARCH + CATEGORY)
//   // -----------------------------
//   function applyFilters() {
//     const search = searchInput?.value.toLowerCase() || '';
//     const category = categoryFilter?.value || selectedCategory || '';

//     filteredPosts = POSTS.filter(post => {
//       const postTitle = post.title || '';
//       const postContent = post.content || '';
//       const postCategory = post.category || '';

//       const matchText = postTitle.toLowerCase().includes(search) || postContent.toLowerCase().includes(search);
//       const matchCategory = !category || postCategory.toLowerCase() === category.toLowerCase();

//       return matchText && matchCategory;
//     });

//     renderPosts(filteredPosts);
//   }

//   // -----------------------------
//   // EVENTOS
//   // -----------------------------
//   searchInput?.addEventListener('input', applyFilters);

//   categoryFilter?.addEventListener('change', () => {
//     selectedCategory = categoryFilter.value;

//     // Si selecciona “Todas las categorías”, eliminar filtro
//     if (!selectedCategory) {
//       localStorage.removeItem('selectedCategory');
//     } else {
//       localStorage.setItem('selectedCategory', selectedCategory);
//     }

//     page = 0;
//     POSTS = [];
//     fetchPosts();
//   });

//   loadMoreBtn?.addEventListener('click', () => {
//     page++;
//     fetchPosts();
//   });

//   // -----------------------------
//   // INICIO
//   // -----------------------------
//   fetchPosts();
// })();

// (() => {
//   const postsContainer = document.getElementById('postsContainer');
//   const searchInput = document.getElementById('searchInput');
//   const categoryFilter = document.getElementById('categoryFilter');
//   const loadMoreBtn = document.getElementById('loadMoreBtn');

//   if (!postsContainer) return;

//   const BACKEND = 'http://localhost:8081';
//   const token = localStorage.getItem('token');
//   const SIZE = 6;

//   let POSTS = [];
//   let page = 0;
//   let selectedCategory = '';

//   const categoryColors = {
//     general: '#0077ff',
//     programacion: '#ff6600',
//     backend: '#33cc33',
//     'data & bi': '#9933ff',
//     data: '#9933ff',
//     devops: '#ffcc00',
//     repositorios: '#00cccc'
//   };

//   // -----------------------------
//   // CATEGORÍA DESDE URL / STORAGE
//   // -----------------------------
//   const params = new URLSearchParams(window.location.search);
//   selectedCategory = params.get('category') || localStorage.getItem('selectedCategory') || '';

//   // -----------------------------
//   // FETCH CATEGORIES
//   // -----------------------------
//   async function fetchCategories() {
//     try {
//       const res = await fetch(`${BACKEND}/api/categories`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : ''
//         }
//       });

//       if (!res.ok) throw new Error();

//       const categories = await res.json();

//       // Opción por defecto
//       categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';

//       categories.forEach(cat => {
//         const option = document.createElement('option');
//         option.value = cat.name; // 🔑 USAMOS NAME
//         option.textContent = cat.name;
//         categoryFilter.appendChild(option);
//       });

//       // Valor inicial visible correcto
//       categoryFilter.value = selectedCategory || '';
//     } catch (e) {
//       console.error('Error cargando categorías', e);
//     }
//   }

//   // -----------------------------
//   // FETCH POSTS
//   // -----------------------------
//   async function fetchPosts(reset = false) {
//     try {
//       if (reset) {
//         page = 0;
//         POSTS = [];
//         postsContainer.innerHTML = '';
//       }

//       let url = `${BACKEND}/api/posts?page=${page}&size=${SIZE}`;
//       if (selectedCategory) {
//         url += `&category=${encodeURIComponent(selectedCategory)}`;
//       }

//       const res = await fetch(url, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : ''
//         }
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       const posts = data.content || data;

//       POSTS = [...POSTS, ...posts];
//       renderPosts(filterBySearch(POSTS));

//       loadMoreBtn.style.display = posts.length < SIZE ? 'none' : 'inline-block';
//     } catch (e) {
//       console.error(e);
//       postsContainer.innerHTML = '<p>No se pudieron cargar los posts.</p>';
//     }
//   }

//   // -----------------------------
//   // SEARCH LOCAL
//   // -----------------------------
//   function filterBySearch(posts) {
//     const search = searchInput?.value.toLowerCase() || '';
//     if (!search) return posts;

//     return posts.filter(
//       p => (p.title || '').toLowerCase().includes(search) || (p.content || '').toLowerCase().includes(search)
//     );
//   }

//   // -----------------------------
//   // RENDER POSTS (IGUAL AL INDEX)
//   // -----------------------------
//   function renderPosts(posts) {
//     postsContainer.innerHTML = '';

//     posts.forEach(p => {
//       const card = document.createElement('div');
//       card.classList.add('post-card');

//       const color = categoryColors[p.category?.toLowerCase()] || '#0077ff';

//       // pestaña
//       const tab = document.createElement('div');
//       tab.classList.add('category-tab');
//       tab.style.backgroundColor = color;
//       card.appendChild(tab);

//       // fecha
//       let dateText = '';
//       if (p.createdAt) {
//         const d = new Date(p.createdAt);
//         if (!isNaN(d.getTime())) {
//           dateText = d.toLocaleDateString('es-ES', {
//             day: 'numeric',
//             month: 'long'
//           });
//         }
//       }

//       card.innerHTML += `
//         <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
//           <div style="margin-left:16px;">
//             <div style="display:flex; align-items:center; gap:8px;">
//               <span style="font-size:2em;">👤</span>
//               <strong style="font-size:1.4em;">
//                 ${p.authorName || 'Desconocido'}
//               </strong>
//             </div>
//             ${dateText ? `<div style="color:#999; margin-left:48px;">${dateText}</div>` : ''}
//           </div>
//           ${p.category ? `<div style="color:${color}; font-weight:600; margin-right:16px;">${p.category}</div>` : ''}
//         </div>

//         <h3 style="margin-left:100px; font-size:2.2em;">
//           ${p.title}
//         </h3>

//         ${
//           p.image_url
//             ? `<img src="${p.image_url}" style="margin:10px 0 0 100px; max-width:100%; border-radius:8px;">`
//             : ''
//         }

//         <p style="margin-left:100px; font-size:1.2em;">
//           ${p.content || ''}
//         </p>
//       `;

//       card.onclick = () => {
//         location.href = `post.html?id=${p.id}`;
//       };

//       postsContainer.appendChild(card);
//     });
//   }

//   // -----------------------------
//   // EVENTOS
//   // -----------------------------
//   searchInput?.addEventListener('input', () => {
//     renderPosts(filterBySearch(POSTS));
//   });

//   categoryFilter?.addEventListener('change', () => {
//     selectedCategory = categoryFilter.value;

//     if (selectedCategory) {
//       localStorage.setItem('selectedCategory', selectedCategory);
//     } else {
//       localStorage.removeItem('selectedCategory');
//     }

//     fetchPosts(true);
//   });

//   loadMoreBtn?.addEventListener('click', () => {
//     page++;
//     fetchPosts();
//   });

//   // -----------------------------
//   // filtro de Post
//   // -----------------------------
//   function filterPosts(posts) {
//     const search = searchInput?.value.toLowerCase() || '';
//     const category = selectedCategory;

//     return posts.filter(p => {
//       const matchText =
//         !search || (p.title || '').toLowerCase().includes(search) || (p.content || '').toLowerCase().includes(search);

//       const matchCategory = !category || p.category === category;

//       return matchText && matchCategory;
//     });
//   }

//   // -----------------------------
//   // INIT
//   // -----------------------------
//   fetchCategories().then(() => fetchPosts());
// })();



(() => {
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!postsContainer || !categoryFilter) {
    console.error('Faltan elementos del DOM');
    return;
  }

  const BACKEND = 'http://localhost:8081';
  const SIZE = 6;
  const token = localStorage.getItem('token');

  let POSTS = [];
  let page = 0;
  let selectedCategory = '';

  const categoryColors = {
    general: '#0077ff',
    programacion: '#ff6600',
    backend: '#33cc33',
    data: '#9933ff',
    'data & bi': '#9933ff',
    devops: '#ffcc00',
    repositorios: '#00cccc'
  };

  // -----------------------------
  // CATEGORY FROM URL / STORAGE
  // -----------------------------
  const params = new URLSearchParams(window.location.search);
  selectedCategory =
    params.get('category') ||
    localStorage.getItem('selectedCategory') ||
    '';

  // -----------------------------
  // FETCH CATEGORIES (FIX)
  // -----------------------------
  async function fetchCategories() {
    try {
      const res = await fetch(`${BACKEND}/api/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) throw new Error('Error categorías');

      const data = await res.json();
      const categories = Array.isArray(data) ? data : data.content;

      categoryFilter.innerHTML =
        '<option value="">Todas las categorías</option>';

      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.name;
        opt.textContent = cat.name;
        categoryFilter.appendChild(opt);
      });

      categoryFilter.value = selectedCategory || '';
    } catch (e) {
      console.error('No se pudieron cargar categorías', e);
    }
  }

  // -----------------------------
  // FETCH POSTS (BACKEND FILTER)
  // -----------------------------
  async function fetchPosts(reset = false) {
    try {
      if (reset) {
        page = 0;
        POSTS = [];
        postsContainer.innerHTML = '';
      }

      let url = `${BACKEND}/api/posts?page=${page}&size=${SIZE}`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) throw new Error('Error posts');

      const data = await res.json();
      const posts = data.content || data;

      POSTS = [...POSTS, ...posts];
      renderPosts(filterBySearch(POSTS));

      loadMoreBtn.style.display =
        posts.length < SIZE ? 'none' : 'inline-block';
    } catch (e) {
      console.error(e);
      postsContainer.innerHTML = '<p>No se pudieron cargar los posts.</p>';
    }
  }

  // -----------------------------
  // SEARCH (FRONTEND ONLY)
  // -----------------------------
  function filterBySearch(posts) {
    const q = searchInput?.value.toLowerCase() || '';
    if (!q) return posts;

    return posts.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.content || '').toLowerCase().includes(q)
    );
  }

  // -----------------------------
  // RENDER POSTS (INDEX STYLE)
  // -----------------------------
  function renderPosts(posts) {
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>No se encontraron posts.</p>';
      return;
    }

    posts.forEach(p => {
      const card = document.createElement('article');
      card.className = 'post-card';

      const color =
        categoryColors[p.category?.toLowerCase()] || '#0077ff';

      card.innerHTML = `
        <div class="category-tab" style="background:${color}"></div>

        <div style="margin-left:50px">
          <div style="display:flex; justify-content:space-between">
            <strong>${p.authorName || 'Desconocido'}</strong>
            <span style="color:${color}; font-weight:600">
              ${p.category || ''}
            </span>
          </div>

          <div style="font-size:.9em; color:#999">
            ${
              p.createdAt
                ? new Date(p.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long'
                  })
                : ''
            }
          </div>

          <h3>${p.title}</h3>

          ${
            p.image_url
              ? `<img src="${p.image_url}"
                   style="max-width:100%; border-radius:8px; margin:10px 0">`
              : ''
          }

          <p>${p.content || ''}</p>
        </div>
      `;

      card.onclick = () =>
        (location.href = `post.html?id=${p.id}`);

      postsContainer.appendChild(card);
    });
  }

  // -----------------------------
  // EVENTS
  // -----------------------------
  searchInput?.addEventListener('input', () =>
    renderPosts(filterBySearch(POSTS))
  );

  categoryFilter?.addEventListener('change', () => {
    selectedCategory = categoryFilter.value;

    selectedCategory
      ? localStorage.setItem('selectedCategory', selectedCategory)
      : localStorage.removeItem('selectedCategory');

    fetchPosts(true);
  });

  loadMoreBtn?.addEventListener('click', () => {
    page++;
    fetchPosts();
  });

  // -----------------------------
  // INIT
  // -----------------------------
  fetchCategories().then(() => fetchPosts());
})();
