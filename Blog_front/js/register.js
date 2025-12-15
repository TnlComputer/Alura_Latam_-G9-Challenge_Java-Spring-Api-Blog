const form = document.getElementById('registerForm');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;

  if (password !== password2) {
    alert('Las contraseñas no coinciden');
    return;
  }

  const response = await fetch('http://localhost:8081/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fullName: nombre,
      email: email,
      password: password
    })
  });

  if (!response.ok) {
    alert('Error al registrar usuario');
    return;
  }

  // alert('Usuario registrado correctamente');
  window.location.href = 'login.html';
});
