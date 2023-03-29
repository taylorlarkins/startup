async function load_home_page() {
   let user = await get_user(localStorage.getItem('username'));
   let authenticated = user?.authenticated;
   if(authenticated) {
      document.getElementById('login').style.display = 'none';
      document.getElementById('signed-in').style.display = 'block';
      document.getElementById('current-user').innerHTML = user.username;
   } else {
      document.getElementById('signed-in').style.display = 'none';
      document.getElementById('login').style.display = 'block';
   }
}

load_home_page();

async function login_or_create(endpoint) {
   const username = document.querySelector("#username")?.value;
   const password = document.querySelector("#password")?.value;
   const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({username: username, password: password}),
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      }
   });
   
   const body = await response.json();
   if(response?.status === 200) {
      localStorage.setItem('username', username);
      window.location.href = 'create.html';
   } else {
      login_err(body.msg);
   }

}

function logout() {
   fetch('/api/auth/logout', {
      method: 'delete'
   }).then(() => (window.location.href = 'index.html'));
}

async function get_user(username) {
   if(username === null) {
      return null;
   }
   const response = await fetch(`/api/user/${username}`);
   if(response.status === 200) {
      return response.json();
   }
   return null;
}

function login_err(msg) {
   const errEl = document.querySelector("#login-error")
   errEl.textContent = msg
   errEl.style.visibility = "visible";
   let p = new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, 3000);
   });
   p.then(() => errEl.style.visibility = "hidden");
}