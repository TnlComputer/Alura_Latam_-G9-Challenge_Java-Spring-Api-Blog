(() => {
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!postsContainer) return;

  let POSTS = [];
  let filteredPosts = [];
  let page = 0;
  const SIZE = 6;

  const token = localStorage.getItem('token'); // JWT

  // blog.js
const BACKEND = 'http://localhost:8081';

async function fetchPosts() {
  try {
    const res = await fetch(`${BACKEND}/api/posts?page=${page}&size=${SIZE}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
      }
      throw new Error('Error al cargar posts');
    }

    const data = await res.json();
    POSTS = [...POSTS, ...data];
    filteredPosts = [...POSTS];
    renderPosts(filteredPosts);

    loadMoreBtn.style.display = data.length < SIZE ? 'none' : 'inline-block';
  } catch (err) {
    console.error(err);
    postsContainer.innerHTML = '<p>No se pudieron cargar los posts.</p>';
  }
}


  function renderPosts(posts) {
    postsContainer.innerHTML = '';
    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>No se encontraron posts.</p>';
      return;
    }

    posts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card clickable fade-in';
      card.onclick = () => (location.href = `post.html?id=${post.id}`);
      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.excerpt || post.content.slice(0, 100) + '...'}</p>
        <span class="tag">${post.category || 'General'}</span>
      `;
      postsContainer.appendChild(card);
    });
  }

  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const category = categoryFilter?.value;
    filteredPosts = POSTS.filter(post => {
      const matchText = post.title.toLowerCase().includes(search) || post.content.toLowerCase().includes(search);
      const matchCategory = !category || post.category === category;
      return matchText && matchCategory;
    });
    renderPosts(filteredPosts);
  }

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);

  loadMoreBtn?.addEventListener('click', () => {
    page++;
    fetchPosts();
  });

  fetchPosts();
})();

