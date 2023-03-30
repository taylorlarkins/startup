let selected_color = 'red';
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'];
let grid = document.querySelectorAll("td");
grid.forEach((e) => {
   e.addEventListener('click', () => {
      e.style.background = selected_color;
   });
});
document.querySelectorAll(".color-selector").forEach((e, i) => {
   e.addEventListener('click', () => {
      select_color(colors[i]);
   });
});

function select_color(color) {
   document.querySelector(`#${selected_color}-btn`).style.border = `solid 2px ${selected_color}`;
   selected_color = color;
   document.querySelector(`#${selected_color}-btn`).style.border = `solid 2px ${color === 'white' ? 'black' : 'white'}`;
}

async function submit() {
   let temp = new Date();
   let date = `${temp.getMonth() + 1}.${temp.getDate()}.${temp.getFullYear()}`;
   let gridOfColors = [];
   grid.forEach((e) => {
      gridOfColors.push(e.style.background);
   });
   let title = document.getElementById('art-title').value;
   if(!title) {
      art_err('You must enter a title for your artwork!');
      return;
   } else if(title.length < 2) {
      art_err('Your title is too short!');
      return;
   } else if(title.length > 25) {
      art_err('Your title is too long!');
      return;
   }

   let piece = {
      title: document.getElementById('art-title').value,
      artist: localStorage.getItem('username'),
      date: date,
      grid: gridOfColors
   }

   try {
      const response = await fetch('/api/newpiece', {
         method: 'POST',
         headers: {'content-type': 'application/json'},
         body: JSON.stringify(piece)
      });

      const gallery = await response.json()
      localStorage.setItem('gallery', JSON.stringify(gallery));
   } catch {
      this.updateGalleryLocally(piece);
   }

   window.location.href = 'gallery.html';
}

function updateGalleryLocally(piece) {
   let gallery = [];
   const galleryText = localStorage.getItem('gallery');
   if(galleryText) {
      gallery = JSON.parse(galleryText);
   }
   gallery.push(piece);
   localStorage.setItem('gallery', JSON.stringify(gallery))
}

async function load_create_page() {
   let user = await get_user(localStorage.getItem('username'));
   let authenticated = user?.authenticated;
   if(!authenticated) {
      document.querySelector('main').innerHTML = '<p>Sign in to create artwork!</p>';
      return null;
   }
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

function art_err(msg) {
   const errEl = document.querySelector("#invalid-title")
   errEl.textContent = msg
   errEl.style.display = "block";
   let p = new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, 3000);
   });
   p.then(() => errEl.style.display = "none");
}

load_create_page();