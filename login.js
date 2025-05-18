//login.js

import { supabase } from './auth.js';


const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error, session } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Bienvenido');
      window.location.href = 'index.html'; // o dashboard si es admin
    }
});