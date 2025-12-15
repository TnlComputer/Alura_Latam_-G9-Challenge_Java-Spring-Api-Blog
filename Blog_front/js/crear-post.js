(() => {
  const form = document.getElementById('create-post-form');
  const statusMessage = document.getElementById('statusMessage');
  const categoryDisplay = document.getElementById('categoryDisplay');

  // ---------------------------
  // Obtener categoría desde la URL
  // ---------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('cat') || 'general';
  categoryDisplay.textContent = `Categoría: ${category}`;

  // ---------------------------
  // Enviar formulario
  // ---------------------------
  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusMessage.textContent = '';

    const title = document.getElementById('title').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim() || '';

    if (!title || !mensaje) {
      statusMessage.textContent = 'Título y mensaje son obligatorios.';
      statusMessage.style.color = 'red';
      return;
    }

    const payload = {title, mensaje, content, imageUrl, category};

    try {
      // ---------------------------
      // Obtener el token JWT del login
      // ---------------------------
      const token = localStorage.getItem('token'); // asegúrate de guardar el token al hacer login
      if (!token) throw new Error('No se encontró token de autenticación');

      const response = await fetch('http://localhost:8081/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error al crear el post: ${errText}`);
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
