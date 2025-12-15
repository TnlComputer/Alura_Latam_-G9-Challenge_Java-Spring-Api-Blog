document.addEventListener('DOMContentLoaded', () => {
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

  if (!userForm) {
    console.error('No se encontró el formulario de usuarios');
    return;
  }

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
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 403) {
        alert('No autorizado para ver usuarios');
        window.location.href = '/index.html';
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const msg = errorData?.message || 'Error al cargar usuarios';
        alert(msg);
        return;
      }

      const usuarios = await res.json();
      renderizarUsuarios(usuarios);
    } catch (e) {
      console.error(e);
      alert('Error de conexión al cargar usuarios');
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
          <button type="button" onclick="editarUsuario(${u.id})">Editar</button>
          <button type="button" onclick="eliminarUsuario(${u.id})">Eliminar</button>
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
    const roles = Array.from(
      document.getElementById('roles').selectedOptions
    ).map(o => o.value);
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
        const msg = errorData?.message || 'Error al guardar usuario';
        alert(msg);
        return;
      }

      userForm.reset();
      document.getElementById('userId').value = '';
      cargarUsuarios();
    } catch (e) {
      console.error(e);
      alert('Error de conexión al guardar usuario');
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
        const msg = errorData?.message || 'Error al eliminar usuario';
        alert(msg);
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
});

