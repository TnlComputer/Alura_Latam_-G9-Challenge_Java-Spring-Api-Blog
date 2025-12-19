(() => {
  const postTitle = document.getElementById('postTitle');
  const postDate = document.getElementById('postDate');
  const postMensaje = document.getElementById('postMensaje');
  const postImage = document.getElementById('postImage');

  // Obtener id de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    postTitle.textContent = 'Post no encontrado';
    postMensaje.textContent = 'No se especificó un ID válido.';
    return;
  }

  async function fetchPost() {
    try {
      const res = await fetch(`http://localhost:8081/api/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Descomenta si el endpoint requiere login
        }
      });

      if (!res.ok) throw new Error('No se pudo cargar el post');

      const post = await res.json();
      renderPost(post);
    } catch (err) {
      console.error(err);
      postTitle.textContent = 'Error al cargar el post';
      postMensaje.textContent = 'No se pudo obtener la información del post.';
    }
  }

  function renderPost(post) {
    postTitle.textContent = post.title;
    postDate.textContent = new Date(post.createdAt).toLocaleDateString();
    postMensaje.textContent = post.mensaje;
    if (post.imageUrl) postImage.src = post.imageUrl;
  }

  fetchPost();
})();

