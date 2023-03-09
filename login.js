function login() {
   const userNameEl = document.querySelector("#username");
   const passEl = document.querySelector("#password");

   const credentials = {
      username: userNameEl.value,
      password: passEl.value
   };
   
   if(credentials.username === "" || credentials.password === "") {
      alert("You must enter a username and a password!");
   }

   let user_info = localStorage.getItem(credentials.username);
   if(user_info === null) {
      localStorage.setItem(credentials.username, JSON.stringify(credentials))
      user_info = localStorage.getItem(credentials.username);
   } 
   user_info = JSON.parse(user_info);
   if(user_info.password === credentials.password) {
      localStorage.setItem("current_user", credentials.username);
      window.location.href = "create.html";
   } else {
      alert("Password is incorrect!");
   }
}