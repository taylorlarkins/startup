let gallery = [];

async function load_gallery() {
   try {
      const response = await fetch('/api/gallery');
      gallery = await response.json();
      localStorage.setItem('gallery', JSON.stringify(gallery));
   } catch {
      const galleryText = localStorage.getItem('gallery');
      if(galleryText) {
         gallery = JSON.parse(galleryText);
      }
   }
   if(gallery.length !== 0) {
      load_piece(gallery.length - 1);
      document.getElementById('gallery-box').style.display = 'flex';
      localStorage.setItem('current-piece', gallery.length - 1);
   } else {
      document.getElementById('gallery-box').display = 'none';
      document.querySelector('main').innerHTML = '<p>No artwork to display. Go make some art!</p>'
   }
}

function load_piece(i) {
   let piece = gallery[i];
   document.querySelectorAll('td').forEach((e, j) => {
      e.style.background = piece.grid[j];
   });
   document.getElementById('piece-title').innerText = piece.title;
   document.getElementById('piece-artist').innerText = `Artist: ${piece.artist}`;
   document.getElementById('piece-date').innerText = `Date: ${piece.date}`;
   update_buttons(i);
}

function previous_piece() {
   let current_piece = localStorage.getItem('current-piece');
   current_piece++;
   load_piece(current_piece);
   localStorage.setItem('current-piece', current_piece);

}

function next_piece() {
   let current_piece = localStorage.getItem('current-piece');
   current_piece--;
   load_piece(current_piece);
   localStorage.setItem('current-piece', current_piece);
}

function random_piece() {
   let temp = parseInt(localStorage.getItem('current-piece'));
   let current_piece;
   do {
      current_piece = Math.floor(Math.random() * (gallery.length - 0) + 0);
   } while(temp === current_piece);
   load_piece(current_piece);
   localStorage.setItem('current-piece', current_piece);
}

function update_buttons(current_piece) {
   document.getElementById('next-btn').disabled = false;
   document.getElementById('prev-btn').disabled = false;
   document.getElementById('rand-btn').disabled = false;
   if(current_piece === 0) {
      document.getElementById('next-btn').disabled = true;
   }
   if(current_piece === gallery.length - 1) {
      document.getElementById('prev-btn').disabled = true;
   }
   if(gallery.length === 1) {
      document.getElementById('rand-btn').disabled = true;
   }
}

load_gallery();