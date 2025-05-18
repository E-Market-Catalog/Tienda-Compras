// register.js
import { supabase } from './auth.js';

const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('¡Registro exitoso! Revisa tu correo para confirmar.');
  }
});
