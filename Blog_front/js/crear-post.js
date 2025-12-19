(() => {
  const form = document.getElementById('create-post-form');
  const statusMessage = document.getElementById('statusMessage');
  const categorySelect = document.getElementById('categorySelect');

  const BACKEND = 'http://localhost:8081';

  // ---------------------------
  // Verificar login
  // ---------------------------
  const token = localStorage.getItem('token');
  if (!token) {
    statusMessage.textContent = 'Debes iniciar sesión para crear un post.';
    statusMessage.style.color = 'red';
    form.style.display = 'none';
    return;
  }

  // ---------------------------
  // Cargar categorías
  // ---------------------------
  async function cargarCategorias() {
    try {
      const res = await fetch(`${BACKEND}/api/categories`, {
        headers: {Authorization: `Bearer ${token}`}
      });

      if (!res.ok) throw new Error('Error al cargar categorías');

      const categorias = await res.json();
      categorySelect.innerHTML = '';

      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    } catch (err) {
      console.error(err);
      const option = document.createElement('option');
      option.textContent = 'No se pudieron cargar las categorías';
      option.disabled = true;
      categorySelect.appendChild(option);
    }
  }

  cargarCategorias();

  // ---------------------------
  // Enviar formulario
  // ---------------------------
  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusMessage.textContent = '';

    const title = document.getElementById('title').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim() || '';
    const categoryId = parseInt(categorySelect.value) || null;

    if (!title || !mensaje) {
      statusMessage.textContent = 'Título y mensaje son obligatorios.';
      statusMessage.style.color = 'red';
      return;
    }

    const payload = {title, mensaje, imageUrl, categoryId};

    try {
      console.log(token);
      const response = await fetch('http://localhost:8081/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        console.log(response);
        throw new Error('No autorizado. Verifica tu sesión.');
      }

      if (!response.ok) {
        let errorText;
        try {
          errorText = JSON.stringify(await response.json());
        } catch {
          errorText = await response.text();
        }
        throw new Error(errorText || response.statusText);
      }

      const createdPost = await response.json();
      statusMessage.textContent = `Post creado correctamente! ID: ${createdPost.id}`;
      statusMessage.style.color = 'green';
      form.reset();
    } catch (err) {
      console.error(err);
      statusMessage.textContent = `No se pudo crear el post. ${err.message}`;
      statusMessage.style.color = 'red';
    }
  });
})();
