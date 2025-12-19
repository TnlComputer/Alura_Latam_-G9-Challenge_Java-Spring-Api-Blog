// // (() => {
// //   const token = localStorage.getItem('token');
// //   if (!token) {
// //     location.href = '../login.html';
// //     return;
// //   }

// //   const tableBody = document.querySelector('#postsTable tbody');
// //   const filterAuthor = document.getElementById('filterAuthor');
// //   const filterCategory = document.getElementById('filterCategory');
// //   let currentPage = 0;
// //   const pageSize = 10;

// //   if (!tableBody) {
// //     console.error('No se encontró la tabla de posts');
// //     return;
// //   }

// //   // -----------------------------
// //   // CARGAR USUARIOS PARA FILTRO
// //   // -----------------------------
// //   async function cargarUsuariosFiltro() {
// //     try {
// //       const res = await fetch('http://localhost:8081/admin/users/enabled', {
// //         headers: {Authorization: `Bearer ${token}`}
// //       });
// //       const usuarios = await res.json();

// //       filterAuthor.innerHTML = '<option value="">Todos los autores</option>';
// //       usuarios.forEach(u => {
// //         const option = document.createElement('option');
// //         option.value = u.id;
// //         option.textContent = u.fullName;
// //         filterAuthor.appendChild(option);
// //       });
// //     } catch (e) {
// //       console.error(e);
// //     }
// //   }

// //   // -----------------------------
// //   // CARGAR CATEGORÍAS PARA FILTRO
// //   // -----------------------------
// //   async function cargarCategoriasFiltro() {
// //     try {
// //       const res = await fetch('http://localhost:8081/api/categories', {
// //         headers: {Authorization: `Bearer ${token}`}
// //       });
// //       if (!res.ok) throw new Error('Error al cargar categorías');

// //       const data = await res.json();
// //       const categorias = Array.isArray(data) ? data : data.content || [];

// //       filterCategory.innerHTML = '<option value="">Todas las categorías</option>';

// //       categorias.forEach(c => {
// //         const option = document.createElement('option');
// //         option.value = c.id;
// //         option.textContent = c.name;
// //         filterCategory.appendChild(option);
// //       });
// //     } catch (e) {
// //       console.error(e);
// //     }
// //   }

// //   // -----------------------------
// //   // CARGAR POSTS
// //   // -----------------------------
// //   async function cargarPosts() {
// //     try {
// //       let url = `http://localhost:8081/api/posts?page=${currentPage}&size=${pageSize}`;

// //       // Aplicar filtros
// //       if (filterAuthor.value) url += `&authorId=${filterAuthor.value}`;
// //       if (filterCategory.value) url += `&categoryId=${parseInt(filterCategory.value)}`;

// //       const res = await fetch(url, {
// //         headers: {Authorization: `Bearer ${token}`}
// //       });
// //       if (!res.ok) throw new Error('Error al cargar posts');

// //       const data = await res.json();

// //       // Determinar si es paginación de Spring Boot (Page<Post>)
// //       const posts = Array.isArray(data) ? data : data.content || [];

// //       renderPosts(posts);

// //       // =============================
// //       // Control de botones
// //       // =============================
// //       const prevBtn = document.getElementById('prevPage');
// //       const nextBtn = document.getElementById('nextPage');

// //       if (data.first !== undefined && data.last !== undefined) {
// //         prevBtn.disabled = data.first;
// //         nextBtn.disabled = data.last;
// //       } else {
// //         // fallback si data es array simple
// //         prevBtn.disabled = currentPage === 0;
// //         nextBtn.disabled = posts.length < pageSize;
// //       }
// //     } catch (e) {
// //       console.error(e);
// //       tableBody.innerHTML = `
// //       <tr>
// //         <td colspan="9">Error al cargar posts</td>
// //       </tr>
// //     `;
// //     }
// //   }

// //   function renderPosts(posts) {
// //     const tableBody = document.querySelector('#postsTable tbody');
// //     tableBody.innerHTML = '';

// //     if (posts.length === 0) {
// //       tableBody.innerHTML = `<tr><td colspan="9">No hay posts</td></tr>`;
// //       return;
// //     }

// //     posts.forEach(p => {
// //       const tr = document.createElement('tr');
// //       tr.classList.add('post-row');

// //       // Mensaje truncado (preview) + mensaje completo (full)
// //       const mensajePreview = p.mensaje.length > 100 ? p.mensaje.substring(0, 100) + '...' : p.mensaje;

// //       tr.innerHTML = `
// //       <td>${p.id}</td>
// //       <td>${p.title}</td>
// //       <td class="mensaje">
// //         <div class="mensaje-preview">${mensajePreview}</div>
// //         <div class="mensaje-full">${p.mensaje}</div>
// //       </td>
// //       <td>${p.authorId || 'Desconocido'}</td>
// //       <td>${p.category || 'Sin categoría'}</td>
// //       <td>${new Date(p.createdAt).toLocaleString()}</td>
// //       <td>${p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ''}</td>
// //       <td>${p.activo ? 'Sí' : 'No'}</td>
// //       <td class="actions-cell">
// //         <button class="edit-btn" title="Editar post" data-id="${p.id}">✏️</button>
// //         <button class="delete-btn ${p.activo ? '' : 'enabled'}"
// //                 title="${p.activo ? 'Eliminar post' : 'Habilitar post'}"
// //                 data-id="${p.id}">
// //           ${p.activo ? '🗑️' : '✅'}
// //         </button>
// //       </td>
// //     `;

// //       tableBody.appendChild(tr);
// //     });
// //   }

// //   // -----------------------------
// //   // ASOCIAR EVENTOS BOTONES
// //   // -----------------------------
// //   function attachActionButtons() {
// //     document.querySelectorAll('.edit-btn').forEach(btn => {
// //       btn.onclick = () => editarPost(btn.dataset.id);
// //     });

// //     document.querySelectorAll('.delete-btn').forEach(btn => {
// //       btn.onclick = () => {
// //         const id = btn.dataset.id;
// //         if (confirm(btn.title)) eliminarPost(id);
// //       };
// //     });
// //   }

// //   window.editarPost = id => alert('Editar post ' + id);
// //   window.eliminarPost = id => alert('Eliminar/Habilitar post ' + id);

// //   // -----------------------------
// //   // PAGINACIÓN
// //   // -----------------------------
// //   window.prevPage = () => {
// //     if (currentPage > 0) {
// //       currentPage--;
// //       cargarPosts();
// //     }
// //   };

// //   window.nextPage = () => {
// //     currentPage++;
// //     cargarPosts();
// //   };

// //   /* ------------------------------
// //   abrir modal
// //   ------------------------------- */
// //  async function abrirEdicion(id) {
// //   postEditandoId = id;

// //   const res = await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
// //     headers: { Authorization: `Bearer ${token}` }
// //   });

// //   const post = await res.json();

// //   document.getElementById('editTitle').value = post.title;
// //   document.getElementById('editMensaje').value = post.mensaje;

// //   cargarCategoriasEdicion(post.categoryId);

// //   document.getElementById('editModal').classList.remove('hidden');
// // }

// //   // -----------------------------
// //   // INIT
// //   // -----------------------------
// //   cargarUsuariosFiltro();
// //   cargarCategoriasFiltro();
// //   cargarPosts();

// //   filterAuthor.addEventListener('change', () => {
// //     currentPage = 0;
// //     cargarPosts();
// //   });
// //   filterCategory.addEventListener('change', () => {
// //     currentPage = 0;
// //     cargarPosts();
// //   });
// // })();













// // (() => {
// //   const token = localStorage.getItem('token');
// //   if (!token) {
// //     location.href = '../login.html';
// //     return;
// //   }

// //   const tableBody = document.querySelector('#postsTable tbody');
// //   const filterAuthor = document.getElementById('filterAuthor');
// //   const filterCategory = document.getElementById('filterCategory');
// //   const prevBtn = document.getElementById('prevPage');
// //   const nextBtn = document.getElementById('nextPage');

// //   let currentPage = 0;
// //   const pageSize = 10;
// //   let postEditandoId = null;

// //   /* =============================
// //      CARGAR POSTS
// //   ============================= */
// //   async function cargarPosts() {
// //     let url = `http://localhost:8081/api/admin/posts?page=${currentPage}&size=${pageSize}`;

// //     if (filterAuthor.value) url += `&authorId=${filterAuthor.value}`;
// //     if (filterCategory.value) url += `&categoryId=${filterCategory.value}`;

// //     const res = await fetch(url, {
// //       headers: {Authorization: `Bearer ${token}`}
// //     });

// //     const data = await res.json();
// //     const posts = data.content || [];

// //     renderPosts(posts);

// //     prevBtn.disabled = data.first;
// //     nextBtn.disabled = data.last;
// //   }

// //   /* =============================
// //      RENDER
// //   ============================= */
// //   function renderPosts(posts) {
// //     tableBody.innerHTML = '';

// //     if (posts.length === 0) {
// //       tableBody.innerHTML = `<tr><td colspan="9">No hay posts</td></tr>`;
// //       return;
// //     }

// //     posts.forEach(p => {
// //       const tr = document.createElement('tr');
// //       tr.classList.add('post-row');

// //       const preview = p.mensaje.length > 120 ? p.mensaje.substring(0, 120) + '...' : p.mensaje;

// //       tr.innerHTML = `
// //         <td>${p.id}</td>
// //         <td>${p.title}</td>
// //         <td class="mensaje">
// //           <div class="mensaje-preview">${preview}</div>
// //           <div class="mensaje-full">${p.mensaje}</div>
// //         </td>
// //         <td>${p.authorName}</td>
// //         <td>${p.categoryName}</td>
// //         <td>${new Date(p.createdAt).toLocaleString()}</td>
// //         <td>${p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ''}</td>
// //         <td>${p.activo ? 'Sí' : 'No'}</td>
// //         <td>
// //           <button class="edit-btn" data-id="${p.id}" title="Editar">✏️</button>
// //           <button class="delete-btn ${p.activo ? '' : 'enabled'}"
// //                 title="${p.activo ? 'Eliminar post' : 'Habilitar post'}"
// //                 data-id="${p.id}">
// //           ${p.activo ? '🗑️' : '✅'}
// //         </button>
// //         </td>
// //       `;

// //       tableBody.appendChild(tr);
// //     });

// //     document.querySelectorAll('.edit-btn').forEach(btn => {
// //       btn.onclick = () => abrirEdicion(btn.dataset.id);
// //     });
// //   }

// //   /* =============================
// //      EDITAR
// //   ============================= */
// //   async function abrirEdicion(id) {
// //     postEditandoId = id;

// //     const res = await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
// //       headers: {Authorization: `Bearer ${token}`}
// //     });

// //     const post = await res.json();

// //     document.getElementById('editTitle').value = post.title;
// //     document.getElementById('editMensaje').value = post.mensaje;

// //     cargarCategoriasEdicion(post.categoryId);

// //     document.getElementById('editModal').classList.remove('hidden');
// //   }

// //   async function cargarCategoriasEdicion(selectedId) {
// //     const res = await fetch('http://localhost:8081/api/categories', {
// //       headers: {Authorization: `Bearer ${token}`}
// //     });
// //     const data = await res.json();
// //     const categorias = Array.isArray(data) ? data : data.content || [];

// //     const select = document.getElementById('editCategory');
// //     select.innerHTML = '';

// //     categorias.forEach(c => {
// //       const opt = document.createElement('option');
// //       opt.value = c.id;
// //       opt.textContent = c.name;
// //       if (c.id === selectedId) opt.selected = true;
// //       select.appendChild(opt);
// //     });
// //   }

// //   document.getElementById('saveEdit').onclick = async () => {
// //     await fetch(`http://localhost:8081/api/admin/posts/${postEditandoId}`, {
// //       method: 'PUT',
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         title: document.getElementById('editTitle').value,
// //         mensaje: document.getElementById('editMensaje').value,
// //         categoryId: document.getElementById('editCategory').value
// //       })
// //     });

// //     cerrarModal();
// //     cargarPosts();
// //   };

// //   document.getElementById('cancelEdit').onclick = cerrarModal;

// //   function cerrarModal() {
// //     document.getElementById('editModal').classList.add('hidden');
// //     postEditandoId = null;
// //   }

// //   /* ===============================
// //          Eliminacion
// // ================================ */
// // tableBody.addEventListener('click', async (e) => {

// //   // BOTÓN ELIMINAR
// //   if (e.target.classList.contains('delete-btn')) {
// //     const id = e.target.dataset.id;

// //     if (!confirm('¿Eliminar este post?')) return;

// //     await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
// //       method: 'DELETE',
// //       headers: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     });

// //     cargarPosts();
// //   }

// //   // BOTÓN EDITAR
// //   if (e.target.classList.contains('edit-btn')) {
// //     abrirEdicion(e.target.dataset.id);
// //   }

// // });

// //   /* =============================
// //      PAGINACIÓN
// //   ============================= */
// //   window.prevPage = () => {
// //     if (currentPage > 0) {
// //       currentPage--;
// //       cargarPosts();
// //     }
// //   };

// //   window.nextPage = () => {
// //     currentPage++;
// //     cargarPosts();
// //   };

// //   /* =============================
// //      INIT
// //   ============================= */
// //   cargarPosts();

// //   filterAuthor.onchange = () => {
// //     currentPage = 0;
// //     cargarPosts();
// //   };
// //   filterCategory.onchange = () => {
// //     currentPage = 0;
// //     cargarPosts();
// //   };
// // })();









// (() => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     location.href = '../login.html';
//     return;
//   }

//   const tableBody = document.querySelector('#postsTable tbody');
//   const filterAuthor = document.getElementById('filterAuthor');
//   const filterCategory = document.getElementById('filterCategory');
//   const prevBtn = document.getElementById('prevPage');
//   const nextBtn = document.getElementById('nextPage');

//   let currentPage = 0;
//   const pageSize = 10;
//   let postEditandoId = null;

//   /* =============================
//      CARGAR POSTS
//   ============================= */
//   async function cargarPosts() {
//     let url = `http://localhost:8081/api/admin/posts?page=${currentPage}&size=${pageSize}`;

//     if (filterAuthor.value) url += `&authorId=${filterAuthor.value}`;
//     if (filterCategory.value) url += `&categoryId=${filterCategory.value}`;

//     const res = await fetch(url, {
//       headers: {Authorization: `Bearer ${token}`}
//     });

//     const data = await res.json();
//     const posts = data.content || [];

//     renderPosts(posts);

//     prevBtn.disabled = data.first;
//     nextBtn.disabled = data.last;
//   }

//   /* =============================
//      RENDER
//   ============================= */
//   function renderPosts(posts) {
//     tableBody.innerHTML = '';

//     if (!posts.length) {
//       tableBody.innerHTML = `<tr><td colspan="9">No hay posts</td></tr>`;
//       return;
//     }

//     posts.forEach(p => {
//       const preview = p.mensaje.length > 120 ? p.mensaje.substring(0, 120) + '...' : p.mensaje;

//       const tr = document.createElement('tr');
//       tr.innerHTML = `
//         <td>${p.id}</td>
//         <td>${p.title}</td>
//         <td class="mensaje">
//           <div class="mensaje-preview">${preview}</div>
//           <div class="mensaje-full">${p.mensaje}</div>
//         </td>
//         <td>${p.authorName}</td>
//         <td>${p.categoryName}</td>
//         <td>${new Date(p.createdAt).toLocaleString()}</td>
//         <td>${p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ''}</td>
//         <td>${p.activo ? 'Sí' : 'No'}</td>
//         <td>
//           <button class="edit-btn" data-id="${p.id}">✏️</button>
//           <button class="delete-btn ${p.activo ? '' : 'enabled'}"
//                   data-id="${p.id}">
//             ${p.activo ? '🗑️' : '✅'}
//           </button>
//         </td>
//       `;
//       tableBody.appendChild(tr);
//     });
//   }

//   /* ===============================
//    ELIMINAR / HABILITAR / EDITAR
// ================================ */
//   tableBody.addEventListener('click', async e => {
//     /* -------- EDITAR -------- */
//     const editBtn = e.target.closest('.edit-btn');
//     if (editBtn) {
//       abrirEdicion(editBtn.dataset.id);
//       return;
//     }

//     /* -------- ELIMINAR / HABILITAR -------- */
//     const deleteBtn = e.target.closest('.delete-btn');
//     if (!deleteBtn) return;

//     const id = deleteBtn.dataset.id;
//     const habilitar = deleteBtn.classList.contains('enabled');

//     const mensaje = habilitar ? '¿Habilitar este post?' : '¿Eliminar este post?';

//     if (!confirm(mensaje)) return;

//     await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         activo: habilitar,
//         status: habilitar ? 'ABIERTO' : 'ELIMINADO'
//       })
//     });

//     cargarPosts();
//   });

//   /* =============================
//      EDITAR
//   ============================= */
//   async function abrirEdicion(id) {
//     postEditandoId = id;

//     const res = await fetch(`http://localhost:8081/api/admin/posts/${id}`, {
//       headers: {Authorization: `Bearer ${token}`}
//     });

//     const post = await res.json();

//     document.getElementById('editTitle').value = post.title;
//     document.getElementById('editMensaje').value = post.mensaje;

//     cargarCategoriasEdicion(post.categoryId);
//     document.getElementById('editModal').classList.remove('hidden');
//   }

//   async function cargarCategoriasEdicion(selectedId) {
//     const res = await fetch('http://localhost:8081/api/categories', {
//       headers: {Authorization: `Bearer ${token}`}
//     });

//     const categorias = await res.json();
//     const select = document.getElementById('editCategory');
//     select.innerHTML = '';

//     categorias.forEach(c => {
//       const opt = document.createElement('option');
//       opt.value = c.id;
//       opt.textContent = c.name;
//       opt.selected = c.id === selectedId;
//       select.appendChild(opt);
//     });
//   }

//   document.getElementById('saveEdit').onclick = async () => {
//     await fetch(`http://localhost:8081/api/admin/posts/${postEditandoId}`, {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         title: editTitle.value,
//         mensaje: editMensaje.value,
//         categoryId: editCategory.value
//       })
//     });

//     cerrarModal();
//     cargarPosts();
//   };

//   document.getElementById('cancelEdit').onclick = cerrarModal;

//   function cerrarModal() {
//     document.getElementById('editModal').classList.add('hidden');
//     postEditandoId = null;
//   }

//   /* =============================
//      PAGINACIÓN
//   ============================= */
//   window.prevPage = () => {
//     if (currentPage > 0) {
//       currentPage--;
//       cargarPosts();
//     }
//   };

//   window.nextPage = () => {
//     currentPage++;
//     cargarPosts();
//   };

//   /* =============================
//      INIT
//   ============================= */
//   cargarPosts();

//   filterAuthor.onchange = filterCategory.onchange = () => {
//     currentPage = 0;
//     cargarPosts();
//   };
// })();





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
          <td>${p.id}</td>
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
