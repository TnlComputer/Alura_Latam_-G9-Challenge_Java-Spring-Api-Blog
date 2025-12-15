(() => {
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!postsContainer) return;

  let POSTS = [];
  let filteredPosts = [];
  let visibleCount = 6; // cantidad inicial
  const STEP = 3;

  // --------------------
  // FETCH POSTS
  // --------------------
  async function fetchPosts() {
    try {
      const res = await fetch('http://localhost:8081/api/posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error(`Error al cargar posts. Status: ${res.status} ${res.statusText}`);

      POSTS = await res.json();
      filteredPosts = [...POSTS];
      renderPosts();
    } catch (err) {
      console.error(err);
      postsContainer.innerHTML = '<p>No se pudieron cargar los posts.</p>';
    }
  }

  // --------------------
  // RENDER POSTS
  // --------------------
  function renderPosts() {
    postsContainer.innerHTML = '';

    filteredPosts.slice(0, visibleCount).forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card clickable fade-in';
      card.onclick = () => (location.href = `post.html?id=${post.id}`);

      const excerpt = post.excerpt || (post.content ? post.content.slice(0, 120) : '');
      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${excerpt}...</p>
        <span class="tag ${post.category || ''}">${post.category || ''}</span>
      `;

      postsContainer.appendChild(card);
    });

    if (loadMoreBtn) {
      loadMoreBtn.style.display = visibleCount >= filteredPosts.length ? 'none' : 'inline-block';
    }
  }

  // --------------------
  // FILTROS DE BÚSQUEDA
  // --------------------
  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const category = categoryFilter?.value;

    filteredPosts = POSTS.filter(post => {
      const matchText = post.title.toLowerCase().includes(search) || (post.content?.toLowerCase().includes(search));
      const matchCategory = !category || post.category === category;
      return matchText && matchCategory;
    });

    visibleCount = STEP;
    renderPosts();
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);

  loadMoreBtn?.addEventListener('click', () => {
    visibleCount += STEP;
    renderPosts();
  });

  // --------------------
  // CATEGORÍAS DEL INDEX
  // --------------------
  function handleCategoryClick() {
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.category;
        const postsDeCat = POSTS.filter(post => post.category === cat);

        if (postsDeCat.length > 0) {
          // Hay posts → vamos al blog filtrado
          window.location.href = `blog.html?cat=${cat}`;
        } else {
          // No hay posts → vamos a crear post
          window.location.href = `crear-post.html?cat=${cat}`;
        }
      });
    });
  }

  // --------------------
  // INIT
  // --------------------
  fetchPosts().then(handleCategoryClick);
})();
