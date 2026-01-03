// =========================
// HELPER TOAST ✅ GLOBAL (FUERA DEL IIFE)
// =========================

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
    stopOnFocus: true,
    style: {
      background: colors[type] || colors.info
    }
  }).showToast();
}

// =========================
// IIFE PRINCIPAL
// =========================
(async () => {
  // CONFIG
  const BACKEND = 'http://localhost:8081';
  const pageSize = 6;

  let currentPage = 0;
  let allLoadedPosts = [];
  let searchTimeout = null;

  const token = localStorage.getItem('token');
  let currentUser = null;

  // ELEMENTOS DOM
  const postsContainer = document.getElementById('postsContainer');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const btnCrearTopico = document.getElementById('btnCrearTopico');
  const adminMenu = document.getElementById('adminMenu');
  const searchInput = document.getElementById('searchInput');

  // MODAL HOME
  const modalHome = document.getElementById('crearTopicoModal');
  const topicoFormHome = document.getElementById('topicoFormHome');
  const closeModalHome = document.getElementById('closeModalHome');
  const cancelModalHome = document.getElementById('cancelModalHome');

  // SELECT CURSO EN MODAL
  const cursoSelect = document.getElementById('cursoSelect');

  // =========================
  // CARGAR CURSOS PARA EL SELECT
  // =========================

  // ✅ FUNCIÓN RECARGAR CURSOS (mejorada)
  async function cargarCursosHome() {
    const cursoSelect = document.getElementById('cursoSelect');
    if (!cursoSelect) return;

    try {
      const headers = {'Content-Type': 'application/json'};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${BACKEND}/api/cursos`, {headers});

      if (!res.ok) {
        console.error('Error cargando cursos:', res.status);
        return;
      }

      const cursos = await res.json();
      cursoSelect.innerHTML = '<option value="">Seleccioná un curso</option>';

      cursos.forEach(curso => {
        const opt = document.createElement('option');
        opt.value = curso.nombreVisible;
        opt.textContent = curso.nombreVisible;
        cursoSelect.appendChild(opt);
      });

      // console.log('✅ Cursos cargados:', cursos.length); // Debug
    } catch (e) {
      console.error('Error de red cargando cursos', e);
    }
  }

  // ✅ BOTÓN CREAR TÓPICO (recarga cursos)
  btnCrearTopico.addEventListener('click', async e => {
    e.preventDefault();
    e.stopPropagation();
    await cargarCursosHome(); // ← RECARGA
    topicoFormHome.reset();
    document.getElementById('modalTitleHome').textContent = 'Crear Nuevo Tópico';
    delete topicoFormHome.dataset.editandoId;
    modalHome.style.display = 'flex';
  });

  // =========================
  // OBTENER USUARIO LOGUEADO
  // =========================
  if (token) {
    try {
      const res = await fetch(`${BACKEND}/auth/me`, {
        headers: {Authorization: `Bearer ${token}`}
      });

      if (res.ok) {
        currentUser = await res.json();
      } else {
        console.error('❌ Error al obtener usuario, status:', res.status);
        localStorage.removeItem('token');
      }
    } catch (e) {
      console.error('❌ Error obteniendo usuario', e);
    }
  } else {
    console.log('⚠️ No hay token en localStorage');
  }

  // BOTÓN CREAR TÓPICO
  if (btnCrearTopico) btnCrearTopico.style.display = 'none';

  if (currentUser && btnCrearTopico && ['USER', 'ADMIN'].some(r => currentUser.roles.includes(r))) {
    btnCrearTopico.style.display = 'inline-block';
    btnCrearTopico.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      topicoFormHome.reset();
      document.getElementById('modalTitleHome').textContent = 'Crear Nuevo Tópico';
      delete topicoFormHome.dataset.editandoId;
      modalHome.style.display = 'flex';
    });
  }

  // PANEL ADMIN
  if (currentUser && adminMenu && currentUser.roles.includes('ADMIN')) {
    adminMenu.innerHTML = `
      <a href="/admin/index.html" class="admin-link nav-btn">
        🛠 Panel Admin
      </a>
    `;
  }

  // MODAL EVENTS
  const closeModalSafe = e => {
    e.preventDefault();
    e.stopPropagation();
    modalHome.style.display = 'none';
    topicoFormHome.reset();
    delete topicoFormHome.dataset.editandoId;
  };

  closeModalHome?.addEventListener('click', closeModalSafe);
  cancelModalHome?.addEventListener('click', closeModalSafe);

  modalHome?.addEventListener('click', e => {
    if (e.target === modalHome) {
      modalHome.style.display = 'none';
      topicoFormHome.reset();
      delete topicoFormHome.dataset.editandoId;
    }
  });

  // SEARCH EN TIEMPO REAL
  if (searchInput) {
    searchInput.addEventListener('input', async e => {
      const query = e.target.value.trim();

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        currentPage = 0;

        if (query.length >= 2) {
          await buscarTopicos(query);
        } else {
          await cargarTopicos(true);
        }
      }, 300);
    });
  }

  // FUNCIÓN SEARCH BACKEND - ✅ CON ORDENAMIENTO
  async function buscarTopicos(query) {
    try {
      const res = await fetch(
        `${BACKEND}/topicos/search?q=${encodeURIComponent(query)}&page=0&size=20&sortBy=fechaCreacion&direction=DESC`,
        {headers: token ? {Authorization: `Bearer ${token}`} : {}}
      );

      if (!res.ok) {
        if (res.status === 400) {
          showToast('Parámetros de búsqueda inválidos', 'warning');
          return;
        }
        showToast('Error en búsqueda', 'error');
        return;
      }

      const results = await res.json();
      allLoadedPosts = results.content || [];
      renderPosts(allLoadedPosts);

      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } catch (e) {
      console.error('Error búsqueda:', e);
      showToast('Error de conexión en búsqueda', 'error');
    }
  }

  // FUNCIÓN RESPONDER TÓPICO
  async function responderTopico(topicoId, e) {
    e.stopPropagation();

    const result = await Swal.fire({
      title: 'Responder Tópico',
      input: 'textarea',
      inputLabel: 'Tu respuesta',
      inputPlaceholder: 'Escribe tu respuesta aquí...',
      inputAttributes: {
        'aria-label': 'Escribe tu respuesta',
        rows: 5
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar Respuesta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      inputValidator: value => {
        if (!value || !value.trim()) {
          return 'Debes escribir una respuesta';
        }
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BACKEND}/topicos/${topicoId}/respuestas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            mensaje: result.value,
            solucion: false
          })
        });

        if (res.ok) {
          showToast('¡Respuesta enviada exitosamente!', 'success');
        } else {
          const error = await res.json().catch(() => ({}));
          showToast(error.message || 'Error al enviar respuesta', 'error');
        }
      } catch (e) {
        console.error('Error:', e);
        showToast('Error de conexión al enviar respuesta', 'error');
      }
    }
  }

  // FUNCIÓN EDITAR TÓPICO - ✅ CORREGIDO
  async function editarTopico(topico, e) {
    e.stopPropagation();

    document.getElementById('tituloHome').value = topico.titulo;
    document.getElementById('mensajeHome').value = topico.mensaje;
    document.getElementById('cursoSelect').value = topico.curso; // ✅ CAMBIADO
    document.getElementById('modalTitleHome').textContent = 'Editar Tópico';

    topicoFormHome.dataset.editandoId = topico.id;

    modalHome.style.display = 'flex';
  }

  // CREAR/EDITAR TÓPICO DESDE HOME - ✅ CORREGIDO
  if (topicoFormHome) {
    topicoFormHome.addEventListener('submit', async e => {
      e.preventDefault();
      e.stopPropagation();

      const titulo = document.getElementById('tituloHome').value;
      const mensaje = document.getElementById('mensajeHome').value;
      const curso = document.getElementById('cursoSelect').value; // ✅ CAMBIADO
      const editandoId = topicoFormHome.dataset.editandoId;

      if (!titulo.trim() || !mensaje.trim() || !curso.trim()) {
        showToast('Título, mensaje y curso son obligatorios', 'error');
        return;
      }

      try {
        const method = editandoId ? 'PUT' : 'POST';
        const url = editandoId ? `${BACKEND}/topicos/${editandoId}` : `${BACKEND}/topicos`;

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({titulo, mensaje, curso})
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          showToast(errorData?.message || `Error al ${editandoId ? 'actualizar' : 'crear'} tópico`, 'error');
          return;
        }

        showToast(`¡Tópico ${editandoId ? 'actualizado' : 'creado'} exitosamente!`, 'success');
        modalHome.style.display = 'none';
        topicoFormHome.reset();
        delete topicoFormHome.dataset.editandoId;
        if (searchInput) searchInput.value = '';
        currentPage = 0;
        await cargarTopicos(true);
      } catch (e) {
        console.error(e);
        showToast('Error de conexión', 'error');
      }
    });
  }

  // RENDER TÓPICOS
  function capitalize(str) {
    if (!str) return '';
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  }

  function renderPosts(posts) {
    postsContainer.innerHTML = '';

    posts.forEach(t => {
      const card = document.createElement('div');
      card.classList.add('post-card');

      const fecha = new Date(t.fechaCreacion).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // console.log('🔍 POSTS:', posts[0]);  // DEBUG
      // ✅ DEFINIR esAutor ANTES de innerHTML
      const esAutor = currentUser && (currentUser.id === t.autorId || currentUser.username === t.autor);

      // ✅ DEBUG CANTIDAD
    // console.log(`Topico ${t.id}: ${t.cantidadRespuestas} respuestas`);

      card.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <strong>👤 ${capitalize(t.autor)}</strong>
        <span style="color:#999;">${fecha}</span>
      </div>
      <h3 style="margin-top:8px;">${t.titulo}</h3>
      <p style="color:#666; margin-top:8px;">
        ${t.mensaje.length > 150 ? t.mensaje.substring(0, 150) + '...' : t.mensaje}
      </p>
      <div style="margin-top:10px; font-size:0.85em; color:#888;">
        📚 ${t.curso}
        <span style="margin-left:15px; opacity:${(t.cantidadRespuestas || 0) > 0 ? '1' : '0.5'};">
          💬 Respuestas ${t.cantidadRespuestas || 0}
        </span>
      </div>
    `;

      // ✅ ACCIONES
      if (currentUser) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'post-actions';

        const btnResponder = document.createElement('button');
        btnResponder.className = 'btn-responder';
        btnResponder.textContent = '💬 Responder';
        btnResponder.onclick = e => responderTopico(t.id, e);
        actionsDiv.appendChild(btnResponder);

        if (esAutor) {
          const btnEditar = document.createElement('button');
          btnEditar.className = 'btn-editar';
          btnEditar.textContent = '✏️ Editar';
          btnEditar.onclick = e => editarTopico(t, e);
          actionsDiv.appendChild(btnEditar);
        }

        if (actionsDiv.children.length > 0) {
          card.appendChild(actionsDiv);
        }
      }

      card.addEventListener('click', e => {
        if (!e.target.closest('.post-actions')) {
          location.href = `topico.html?id=${t.id}`;
        }
      });

      postsContainer.appendChild(card);
    });
  }

  // CARGAR TÓPICOS - ✅ CON ORDENAMIENTO Y VALIDACIÓN
  async function cargarTopicos(reset = false) {
    try {
      const url = `${BACKEND}/topicos?page=${currentPage}&size=${pageSize}&sortBy=fechaCreacion&direction=DESC`;

      const res = await fetch(url, {
        headers: token ? {Authorization: `Bearer ${token}`} : {}
      });

      if (!res.ok) {
        if (res.status === 400) {
          showToast('Parámetros de ordenamiento inválidos', 'warning');
          return;
        }
        const err = await res.json().catch(() => ({}));
        showToast(err.message || 'Error cargando tópicos', 'error');
        return;
      }

      const page = await res.json();

      if (reset) {
        allLoadedPosts = [];
        postsContainer.innerHTML = '';
      }

      allLoadedPosts = [...allLoadedPosts, ...page.content];
      renderPosts(allLoadedPosts);

      if (loadMoreBtn) {
        const isLast = page.page + 1 >= page.totalPages;
        loadMoreBtn.style.display = isLast ? 'none' : 'inline-block';
      }
    } catch (e) {
      console.error(e);
      showToast('Error al cargar tópicos', 'error');
    }
  }

  // EVENTOS
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      currentPage++;
      cargarTopicos();
    });
  }

  // INIT
  await cargarCursosHome(); // ✅ Carga cursos al inicio
  cargarTopicos();
})();
