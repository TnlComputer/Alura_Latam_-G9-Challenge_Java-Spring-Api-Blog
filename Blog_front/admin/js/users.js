window.initUsers = function () {
  // --------------------
  // AUTH
  // --------------------
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // --------------------
  // ELEMENTOS
  // --------------------
  const userTableBody = document.querySelector('#userTable tbody');
  const userForm = document.getElementById('userForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  if (!userForm || !userTableBody) {
    console.error('Vista de usuarios no cargada');
    return;
  }

  let currentPage = 0;
  const pageSize = 10;

  // --------------------
  // LOGOUT
  // --------------------
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });

  // --------------------
  // CARGAR USUARIOS (PAGINADO)
  // --------------------
  async function cargarUsuarios() {
    try {
      const res = await fetch(
        `http://localhost:8081/admin/users?page=${currentPage}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        alert('Error al cargar usuarios');
        return;
      }

      const pageData = await res.json();

      renderizarUsuarios(pageData.content);
      renderPagination(pageData);

    } catch (e) {
      console.error(e);
    }
  }

  // --------------------
  // RENDER TABLA
  // --------------------
  function renderizarUsuarios(usuarios) {
    userTableBody.innerHTML = '';

    usuarios.forEach(u => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${u.id}</td>
        <td>${u.fullName}</td>
        <td>${u.email}</td>
        <td>${u.roles.join(', ')}</td>
        <td>${u.enabled ? 'Sí' : 'No'}</td>
        <td class="actions-cell">
          <div class="actions-dropdown">
            <button class="actions-btn">⚙️</button>
            <div class="actions-menu">
              <button class="edit" onclick="editarUsuario(${u.id})">Editar</button>
              <button class="delete" onclick="eliminarUsuario(${u.id})">Eliminar</button>
            </div>
          </div>
        </td>
      `;
      userTableBody.appendChild(row);
    });
  }

  // --------------------
  // PAGINACIÓN REAL
  // --------------------
  function renderPagination(pageData) {
    prevBtn.disabled = pageData.first;
    nextBtn.disabled = pageData.last;
  }

  window.prevPage = () => {
    if (currentPage > 0) {
      currentPage--;
      cargarUsuarios();
    }
  };

  window.nextPage = () => {
    currentPage++;
    cargarUsuarios();
  };

  // --------------------
  // CREAR / ACTUALIZAR
  // --------------------
  userForm.addEventListener('submit', async e => {
    e.preventDefault();

    const id = document.getElementById('userId').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const roles = Array.from(document.getElementById('roles').selectedOptions).map(o => o.value);
    const enabled = document.getElementById('enabled').checked;

    const body = { fullName, email, roles, enabled };
    if (password && password.trim() !== '') {
      body.password = password;
    }

    let url = 'http://localhost:8081/admin/users';
    let method = 'POST';

    if (id) {
      url += `/${id}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.message || 'Error al guardar usuario');
        return;
      }

      userForm.reset();
      document.getElementById('userId').value = '';
      currentPage = 0;
      cargarUsuarios();

    } catch (e) {
      console.error(e);
      alert('Error de conexión al guardar usuario');
    }
  });

  // --------------------
  // EDITAR USUARIO (FIX)
  // --------------------
  window.editarUsuario = async id => {
    try {
      const res = await fetch(
        `http://localhost:8081/admin/users?page=${currentPage}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const pageData = await res.json();
      const usuario = pageData.content.find(u => u.id === id);
      if (!usuario) return;

      document.getElementById('userId').value = usuario.id;
      document.getElementById('fullName').value = usuario.fullName;
      document.getElementById('email').value = usuario.email;
      document.getElementById('password').value = '';
      document.getElementById('enabled').checked = usuario.enabled;

      const rolesSelect = document.getElementById('roles');
      Array.from(rolesSelect.options).forEach(opt => {
        opt.selected = usuario.roles.includes(opt.value);
      });

    } catch (e) {
      console.error(e);
      alert('Error al cargar datos del usuario');
    }
  };

  // --------------------
  // ELIMINAR USUARIO
  // --------------------
  window.eliminarUsuario = async id => {
    if (!confirm('¿Eliminar usuario?')) return;

    try {
      const res = await fetch(`http://localhost:8081/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.message || 'Error al eliminar usuario');
        return;
      }

      cargarUsuarios();

    } catch (e) {
      console.error(e);
      alert('Error de conexión al eliminar usuario');
    }
  };

  // --------------------
  // INIT
  // --------------------
  cargarUsuarios();
};
