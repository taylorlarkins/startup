let gallery = localStorage.getItem('gallery');
let current_piece = 0;
let size = 0;

if(gallery !== null) {
   gallery = JSON.parse(gallery);
   size = gallery.creations.length;
   current_piece = size - 1;
   load_piece(current_piece);
} else {
   document.getElementById('gallery-box').display = 'none';
   document.querySelector('main').innerHTML = '<p>No artwork to display. Go make some art!'
}

function load_piece(i) {
   let piece = gallery.creations[i];
   document.querySelectorAll('td').forEach((e, j) => {
      e.style.background = piece.grid[j];
   });
   document.getElementById('piece-title').innerText = piece.title;
   document.getElementById('piece-artist').innerText = `Artist: ${piece.artist}`;
   document.getElementById('piece-date').innerText = `Date: ${piece.date}`;
   update_buttons();
}

function previous_piece() {
   current_piece++;
   load_piece(current_piece);
}

function next_piece() {
   current_piece--;
   load_piece(current_piece);
}

function random_piece() {
   let temp = current_piece;
   do {
      current_piece = Math.floor(Math.random() * (size - 0) + 0);
   } while(temp === current_piece);
   load_piece(current_piece);
}

function update_buttons() {
   document.getElementById('next-btn').disabled = false;
   document.getElementById('prev-btn').disabled = false;
   document.getElementById('rand-btn').disabled = false;
   if(current_piece === 0) {
      document.getElementById('next-btn').disabled = true;
   }
   if(current_piece === size - 1) {
      document.getElementById('prev-btn').disabled = true;
   }
   if(size === 1) {
      document.getElementById('rand-btn').disabled = true;
   }
}