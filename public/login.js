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