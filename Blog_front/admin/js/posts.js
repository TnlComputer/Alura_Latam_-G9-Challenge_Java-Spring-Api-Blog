(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    location.href = '../login.html';
    return;
  }

  const tableBody = document.querySelector('#postsTable tbody');
  const filterAuthor = document.getElementById('filterAuthor');
  const filterCategory = document.getElementById('filterCategory');

  if (!tableBody) {
    console.error('No se encontró la tabla de posts');
    return;
  }

  // -----------------------------
  // CARGAR USUARIOS PARA FILTRO
  // -----------------------------
  async function cargarUsuariosFiltro() {
    try {
      const res = await fetch('http://localhost:8081/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar usuarios');

      const usuarios = await res.json();

      // Limpiar select
      filterAuthor.innerHTML = '<option value="">Todos los autores</option>';

      // Agregar opciones con el nombre completo
      usuarios.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id;           // valor interno: id del usuario
        option.textContent = u.fullName; // mostrar solo nombre
        filterAuthor.appendChild(option);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // -----------------------------
  // CARGAR POSTS
  // -----------------------------
  async function cargarPosts() {
    try {
      const res = await fetch('http://localhost:8081/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar posts');

      const posts = await res.json();
      renderPosts(posts);
    } catch (e) {
      console.error(e);
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">Error al cargar posts</td>
        </tr>
      `;
    }
  }

  function renderPosts(posts) {
    tableBody.innerHTML = '';
    posts.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${new Date(p.createdAt).toLocaleDateString()}</td>
        <td>
          <button onclick="editarPost(${p.id})">Editar</button>
          <button onclick="eliminarPost(${p.id})">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // -----------------------------
  // INIT
  // -----------------------------
  cargarUsuariosFiltro(); // primero cargar usuarios para el filtro
  cargarPosts();          // luego cargar posts

  // placeholders
  window.editarPost = id => alert('Editar post ' + id);
  window.eliminarPost = id => {
    if (confirm('¿Eliminar post?')) alert('Eliminar post ' + id);
  };
})();
