//Event Messages
const CREATE_PIECE = 'create_piece';
const UPLOAD_PIECE = 'upload_piece';

let selected_color = 'red';
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'];
let grid = document.querySelectorAll("td");
let socket;

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
      broadcast_event(piece.artist, UPLOAD_PIECE, piece.title);
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
   if(authenticated) {
      document.querySelector('.grid-container').style.display = 'flex';
      configure_web_socket();
      await delay(2000);
      broadcast_event(user.username, CREATE_PIECE, null);
   } else {
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

function configure_web_socket() {
   const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
   socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
   socket.onopen = (event) => {
      display_message('system', 'CreationZone', 'Connected! &#x2705');
   };
   socket.onclose = (event) => {
      display_message('system', 'CreationZone', 'Disconnected! &#x1F480');
   };
   socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if(msg.type === CREATE_PIECE) {
         display_message('artist', msg.from, 'started working on a new piece! &#x1F3A8');
      } else if (msg.type === UPLOAD_PIECE) {
         display_message('artist', msg.from, `uploaded a piece titled: ${msg.title} &#x1F389`);
      }
   };
}

function display_message(cls, from, msg) {
   const player_messages = document.querySelector('#player-messages');
   player_messages.innerHTML = `<div><span class="${cls}-event">${from}</span> ${msg}</div>` + player_messages.innerHTML;
}

function broadcast_event(from, type, title) {
   const event = { from: from, type: type, title: title};
   socket.send(JSON.stringify(event));
}

function delay(time) {
   return new Promise((res) => {
      setTimeout(res, time);
   })
}

load_create_page();