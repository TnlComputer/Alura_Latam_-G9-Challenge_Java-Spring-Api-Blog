(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    location.href = '../login.html';
    return;
  }

  const tableBody = document.querySelector('#postsTable tbody');
  const filterAuthor = document.getElementById('filterAuthor');
  const filterCategory = document.getElementById('filterCategory');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  let currentPage = 0;
  const pageSize = 10;
  let postEditandoId = null;

  /* =============================
     POSTS
  ============================= */
  async function cargarPosts() {
    let url = `http://localhost:8081/api/admin/posts?page=${currentPage}&size=${pageSize}`;

    if (filterAuthor.value) url += `&authorId=${filterAuthor.value}`;
    if (filterCategory.value) url += `&categoryId=${filterCategory.value}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    renderPosts(data.content || []);

    prevBtn.disabled = data.first;
    nextBtn.disabled = data.last;
  }

  function renderPosts(posts) {
    tableBody.innerHTML = '';

    if (!posts.length) {
      tableBody.innerHTML = `<tr><td colspan="9">No hay posts</td></tr>`;
      return;
    }

    posts.forEach(p => {
      const preview = p.mensaje.length > 120
        ? p.mensaje.substring(0, 120) + '...'
        : p.mensaje;

      tableBody.innerHTML += `
        <tr class="post-row">
          
          <td>${p.title}</td>
          <td class="mensaje">
            <div class="mensaje-preview">${preview}</div>
            <div class="mensaje-full">${p.mensaje}</div>
          </td>
          <td>${p.authorName}</td>
          <td>${p.categoryName}</td>
          <td>${new Date(p.createdAt).toLocaleString()}</td>
          <td>${p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ''}</td>
          <td>${p.activo ? 'Sí' : 'No'}</td>
          <td>
            <button class="edit-btn" data-id="${p.id}">✏️</button>
            <button class="delete-btn ${p.activo ? '' : 'enabled'}"
                    data-id="${p.id}">
              ${p.activo ? '🗑️' : '✅'}
            </button>
          </td>
        </tr>
      `;
    });
  }

  /* =============================
     FILTROS
  ============================= */
  async function cargarCategorias() {
    const res = await fetch('http://localhost:8081/api/categories');
    const categorias = await res.json();

    filterCategory.innerHTML = `<option value="">Todas las categorías</option>`;
    categorias.forEach(c => {
      filterCategory.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  async function cargarAutores() {
    const res = await fetch('http://localhost:8081/admin/users/enabled', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return;

    const autores = await res.json();
    filterAuthor.innerHTML = `<option value="">Todos los autores</option>`;

    autores.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.fullName;
      filterAuthor.appendChild(opt);
    });
  }

  /* =============================
     EDITAR POST
  ============================= */
  async function abrirEdicion(id) {
    postEditandoId = id;

    const res = await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const post = await res.json();

    document.getElementById('editTitle').value = post.title;
    document.getElementById('editMensaje').value = post.mensaje;

    await cargarCategoriasEdicion(post.categoryId);

    document.getElementById('editModal').classList.remove('hidden');
  }

  async function cargarCategoriasEdicion(selectedId) {
    const res = await fetch('http://localhost:8081/api/categories');
    const categorias = await res.json();

    const select = document.getElementById('editCategory');
    select.innerHTML = '';

    categorias.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      if (c.id === selectedId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  document.getElementById('saveEdit').onclick = async () => {
    await fetch(`http://localhost:8081/api/admin/posts/${postEditandoId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: editTitle.value,
        mensaje: editMensaje.value,
        categoryId: editCategory.value
      })
    });

    cerrarModal();
    cargarPosts();
  };

  document.getElementById('cancelEdit').onclick = cerrarModal;

  function cerrarModal() {
    document.getElementById('editModal').classList.add('hidden');
    postEditandoId = null;
  }

  /* =============================
     ELIMINAR / HABILITAR / EDITAR
  ============================= */
  tableBody.addEventListener('click', async e => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      abrirEdicion(editBtn.dataset.id);
      return;
    }

    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    const habilitar = deleteBtn.classList.contains('enabled');

    if (!confirm(habilitar ? '¿Habilitar post?' : '¿Eliminar post?')) return;

    await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        activo: habilitar,
        status: habilitar ? 'ABIERTO' : 'ELIMINADO'
      })
    });

    cargarPosts();
  });

  /* =============================
     INIT
  ============================= */
  cargarCategorias();
  cargarAutores();
  cargarPosts();

  filterAuthor.onchange = filterCategory.onchange = () => {
    currentPage = 0;
    cargarPosts();
  };

  window.prevPage = () => {
    if (currentPage > 0) {
      currentPage--;
      cargarPosts();
    }
  };

  window.nextPage = () => {
    currentPage++;
    cargarPosts();
  };
})();
