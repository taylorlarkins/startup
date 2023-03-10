function login() {
   const username = document.querySelector("#username").value;
   const password = document.querySelector("#password").value;
   
   if(username === "" || password === "") {
      login_err("You must enter a username and a password!");
   } else {
      let user_data = localStorage.getItem("user_data");
      if(user_data === null) {
         localStorage.setItem("user_data", JSON.stringify({}));
      }
      user_data = JSON.parse(localStorage.getItem("user_data"));

      if(!(username in user_data)) {
         user_data[username] = password;
         localStorage.setItem("user_data", JSON.stringify(user_data))
      }
      correct_pass = user_data[username];

      if(password === correct_pass) {
         localStorage.setItem("current_user", username);
         window.location.href = "create.html";
      } else {
         login_err("Password is incorrect!");
      }
   }
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