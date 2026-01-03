(() => {
  const BACKEND = 'http://localhost:8081';
  const token = localStorage.getItem('token');

  let currentUser = null;
  let topicoActual = null;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    alert('Tópico inválido');
    return;
  }

const mainMenu = document.getElementById('mainMenu');

if (mainMenu) {
  mainMenu.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    e.preventDefault();

    const action = btn.dataset.action;

    if (action === 'home') {
      window.location.href = '/index.html';
    }
  });
}


  /**
   * Pasa la primer letra a mayuscula
   * pensado para tener nombre compuestos
   * como Jose maria
   */
  function capitalize(text) {
    return text
      ?.toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  /* ======================================================
     TOAST
  ====================================================== */
  function showToast(message, type = 'info') {
    const colors = {
      success: 'linear-gradient(to right, #00b09b, #96c93d)',
      error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      warning: 'linear-gradient(to right, #f7971e, #ffd200)',
      info: 'linear-gradient(to right, #4facfe, #00f2fe)'
    };

    Toastify({
      text: message,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      style: {background: colors[type] || colors.info}
    }).showToast();
  }

  /* ======================================================
     USUARIO LOGUEADO
  ====================================================== */
  // async function obtenerUsuario() {
  //   if (!token) return;

  //   const res = await fetch(`${BACKEND}/auth/me`, {
  //     headers: {Authorization: `Bearer ${token}`}
  //   });

  //   if (res.ok) currentUser = await res.json();
  // }

  // ============================================
  // OBTENER USUARIO LOGUEADO
  // ============================================
  async function obtenerUsuario() {
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND}/auth/me`, {
        headers: {Authorization: `Bearer ${token}`}
      });

      if (!res.ok) return;

      currentUser = await res.json();

      const roles = Array.isArray(currentUser.roles) ? currentUser.roles : [];

      // PANEL ADMIN (solo link)
      if (roles.includes('ADMIN') && adminMenu) {
        adminMenu.innerHTML = `
        <a href="./admin/index.html" class="admin-link nav-btn">
          🛠 Panel Admin
        </a>
      `;
      }
    } catch (e) {
      console.error('Error obteniendo usuario:', e);
    }
  }

  /* ======================================================
     RENDER TÓPICO
  ====================================================== */
//   function renderTopico(topico) {
//     const container = document.getElementById('topicoContainer');
//     container.innerHTML = '';

//     const fecha = new Date(topico.fechaCreacion).toLocaleDateString('es-ES', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });

//     const statusClass = topico.status === 'ABIERTO' ? 'status-open' : 'status-closed';

//     const div = document.createElement('div');
//     div.className = 'topico-detail fade-in';

//     div.innerHTML = `
//       <h1>${topico.titulo}</h1>
//       <p style="opacity:.7;">👤 ${capitalize(topico.autor)}
//  · 📅 ${fecha}</p>
//       <span class="${statusClass}">${topico.status}</span>
//       <p id="topicoContent">${topico.mensaje}</p>
//       <span id="topicoCurso">📚 ${topico.curso}</span>
//       <div id="topicoActions"></div>
//     `;

//     container.appendChild(div);
//   }

function renderTopico(topico) {
  const container = document.getElementById('topicoContainer');
  container.innerHTML = '';

  const fecha = new Date(topico.fechaCreacion).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const statusClass =
    topico.status === 'ABIERTO' ? 'status-open' : 'status-closed';

  const div = document.createElement('div');
  div.className = 'topico-detail fade-in';

  div.innerHTML = `
    <!-- HEADER -->
    <div class="topico-header">
      <div class="topico-autor">
        👤 ${capitalize(topico.autor)}
      </div>
      <div class="topico-fecha">
        📅 ${fecha}
      </div>
    </div>

    <!-- TITULO -->
    <h1 class="topico-titulo">${topico.titulo}</h1>

    <!-- MENSAJE -->
    <p class="topico-mensaje">${topico.mensaje}</p>

    <!-- FOOTER -->
    <div class="topico-footer">
      <div class="topico-meta">
        <span id="topicoCurso">📚 ${topico.curso}</span>
      </div>

      <div class="topico-actions-wrapper">
        <div id="topicoActions"></div>
        <span class="${statusClass}">${topico.status}</span>
      </div>
    </div>
  `;

  container.appendChild(div);
}


  /* ======================================================
     BOTONES DE ACCIÓN
  ====================================================== */
  function renderBotonesAccion() {
    const actions = document.getElementById('topicoActions');
    if (!actions || !currentUser || !topicoActual) return;

    actions.innerHTML = '';

    const esAutor =
      currentUser.id === topicoActual.autorId ||
      currentUser.fullName === topicoActual.autor ||
      currentUser.email === topicoActual.autor;

    // 💬 Responder (cualquiera logueado)
    const btnResponder = document.createElement('button');
    btnResponder.className = 'btn-action btn-responder';
    btnResponder.textContent = '💬 Responder';
    btnResponder.onclick = responderTopico;
    actions.appendChild(btnResponder);

    // ✏️ Editar → SOLO AUTOR
    if (esAutor) {
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn-action btn-editar';
      btnEditar.textContent = '✏️ Editar';
      btnEditar.onclick = editarTopico;
      actions.appendChild(btnEditar);
    }

    // 🔒 Cerrar → SOLO AUTOR y si está abierto
    if (esAutor && topicoActual.status === 'ABIERTO') {
      const btnCerrar = document.createElement('button');
      btnCerrar.className = 'btn-action btn-cerrar';
      btnCerrar.textContent = '🔒 Cerrar';
      btnCerrar.onclick = cerrarTopico;
      actions.appendChild(btnCerrar);
    }
  }

  /* ======================================================
     RESPUESTAS (CARDS)
  ====================================================== */
  function renderRespuesta(respuesta, nivel = 0) {
    const div = document.createElement('div');
    div.className = `respuesta ${respuesta.solucion ? 'solucion' : ''}`;
    div.style.marginLeft = `${nivel * 24}px`;

    const puedeResponder = currentUser && topicoActual?.status === 'ABIERTO';

    const esAutorRespuesta =
      currentUser &&
      (currentUser.id === respuesta.autorId ||
        currentUser.fullName === respuesta.autor ||
        currentUser.email === respuesta.autor);

    div.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <strong>👤 ${capitalize(respuesta.autor)}</strong>

      <small>${new Date(respuesta.fechaCreacion).toLocaleString('es-ES')}</small>
    </div>

    <p style="margin:12px 0;">${respuesta.mensaje}</p>

    ${respuesta.solucion ? `<span class="solucion-badge">✅ Solución aceptada</span>` : ''}

    <div class="respuesta-actions">

      ${
        puedeResponder
          ? `
            <button
              class="btn-action btn-responder-anidada"
              data-respuesta-id="${respuesta.id}">
              💬 Responder
            </button>
          `
          : ''
      }

      ${
        esAutorRespuesta
          ? `
            <button
              class="btn-action btn-editar-respuesta"
              data-respuesta-id="${respuesta.id}">
              ✏️ Editar
            </button>

            <button
              class="btn-action btn-eliminar-respuesta"
              data-respuesta-id="${respuesta.id}">
              🗑 Eliminar
            </button>
          `
          : ''
      }

    </div>
  `;

    return div;
  }

  /**********************************
   * Cergar Respuesta               *
   * ********************************/
  async function cargarRespuestas() {
    const container = document.getElementById('respuestasContainer');
    container.innerHTML = '';

    const res = await fetch(`${BACKEND}/topicos/${id}/respuestas`);
    if (!res.ok) return;

    const respuestas = await res.json();

    if (respuestas.length === 0) {
      container.innerHTML = `<p style="text-align:center;opacity:.6;">Aún no hay respuestas</p>`;
      return;
    }

    respuestas.forEach(r => {
      container.appendChild(renderRespuesta(r));
      if (r.respuestas?.length) {
        renderAnidadas(r.respuestas, 1, container);
      }
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-responder-anidada');
    if (!btn) return;

    const respuestaId = btn.dataset.respuestaId;
    responderRespuesta(respuestaId);
  });

  async function responderRespuesta(respuestaId) {
    if (!currentUser) {
      showToast('Debes iniciar sesión', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Responder a esta respuesta',
      input: 'textarea',
      inputLabel: 'Tu respuesta',
      inputAttributes: {rows: 5},
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6'
    });

    if (!result.isConfirmed || !result.value?.trim()) return;

    const res = await fetch(`${BACKEND}/topicos/${id}/respuestas/${respuestaId}/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({mensaje: result.value.trim()})
    });

    if (res.ok) {
      showToast('Respuesta enviada', 'success');
      cargarRespuestas();
    } else {
      showToast('Error al responder', 'error');
    }
  }

  /* ======================================================
     ACCIONES
  ====================================================== */
  async function responderTopico() {
    if (!currentUser) {
      showToast('Debes iniciar sesión', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Responder Tópico',
      input: 'textarea',
      inputAttributes: {rows: 5},
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`${BACKEND}/topicos/${id}/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({mensaje: result.value})
    });

    if (res.ok) {
      showToast('Respuesta enviada', 'success');
      cargarRespuestas();
    }
  }

  async function editarTopico() {
    const result = await Swal.fire({
      title: 'Editar Tópico',
      input: 'textarea',
      inputValue: topicoActual.mensaje,
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    await fetch(`${BACKEND}/topicos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo: topicoActual.titulo,
        mensaje: result.value,
        curso: topicoActual.curso
      })
    });

    location.reload();
  }

  async function cerrarTopico() {
    await fetch(`${BACKEND}/topicos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({...topicoActual, status: 'CERRADO'})
    });

    location.reload();
  }

  /* ======================================================
     FETCH TÓPICO
  ====================================================== */
  async function fetchTopico() {
    const res = await fetch(`${BACKEND}/topicos/${id}`);
    topicoActual = await res.json();
    renderTopico(topicoActual);
    renderBotonesAccion();
    cargarRespuestas();
  }

  /* ======================================================
     INIT
  ====================================================== */
  obtenerUsuario().then(fetchTopico);
})();
