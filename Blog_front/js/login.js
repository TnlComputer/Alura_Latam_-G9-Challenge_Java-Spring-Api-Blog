const form = document.getElementById('loginForm');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:8081/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password})
  });

  if (!response.ok) {
    alert('Login incorrecto');
    return;
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);

  // Redirigir según rol (opcional)
  const payload = JSON.parse(atob(data.token.split('.')[1]));
  const roles = payload.roles || [];
  if (roles.includes('ADMIN')) {
    window.location.href = 'admin/index.html';
  } else {
    window.location.href = 'index.html';
  }
});
