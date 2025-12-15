(() => {
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

  // --------------------
  // LOGOUT
  // --------------------
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });

  // --------------------
  // CARGAR USUARIOS
  // --------------------
  async function cargarUsuarios() {
    try {
      const res = await fetch('http://localhost:8081/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        alert('No autorizado');
        window.location.href = '/index.html';
        return;
      }

      const usuarios = await res.json();
      renderizarUsuarios(usuarios);
    } catch (e) {
      console.error(e);
      alert('Error al cargar usuarios');
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
        <td>${Array.from(u.roles).join(', ')}</td>
        <td>${u.enabled ? 'Sí' : 'No'}</td>
        <td>
          <button onclick="editarUsuario(${u.id})">Editar</button>
          <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
        </td>
      `;
      userTableBody.appendChild(row);
    });
  }

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

    // 👉 NO mandar password si está vacío
    const body = {fullName, email, roles, enabled};
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
        alert('Error al guardar usuario');
        return;
      }

      userForm.reset();
      document.getElementById('userId').value = '';
      cargarUsuarios();
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  });

  // --------------------
  // EDITAR USUARIO
  // --------------------
  window.editarUsuario = async id => {
    try {
      const res = await fetch('http://localhost:8081/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const usuarios = await res.json();
      const usuario = usuarios.find(u => u.id === id);
      if (!usuario) return;

      document.getElementById('userId').value = usuario.id;
      document.getElementById('fullName').value = usuario.fullName;
      document.getElementById('email').value = usuario.email;
      document.getElementById('password').value = ''; // 🔒 nunca mostrar
      document.getElementById('enabled').checked = usuario.enabled;

      const rolesSelect = document.getElementById('roles');
      Array.from(rolesSelect.options).forEach(opt => {
        opt.selected = usuario.roles.includes(opt.value);
      });
    } catch (e) {
      console.error(e);
    }
  };

  // --------------------
  // ELIMINAR
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
        alert('Error al eliminar usuario');
        return;
      }

      cargarUsuarios();
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    }
  };

  // --------------------
  // INIT
  // --------------------
  cargarUsuarios();
})();
