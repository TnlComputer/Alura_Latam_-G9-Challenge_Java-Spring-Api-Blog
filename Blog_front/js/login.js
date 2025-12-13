const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:8081/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) {
    alert('Login incorrecto');
    return;
  }

  const data = await response.json();

  // 🔐 guardar JWT
  localStorage.setItem('token', data.token);

  alert('Login OK');
});

