if(localStorage.getItem('current_user') === null) {
   localStorage.setItem('current_user', 'Anonymous')
}

class Art {
   artist;
   grid;
   date;
   selected_color;
   colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'];

   constructor() {
      this.artist = localStorage.getItem("current_user");
      this.selected_color = "red";
      let temp = new Date();
      this.date = `${temp.getMonth() + 1}.${temp.getDate()}.${temp.getFullYear()}`;
      
      //Add 'click' eventListeners to all grid squares
      this.grid = document.querySelectorAll("td");
      this.grid.forEach((e) => {
         e.addEventListener('click', () => {
            e.style.background = this.selected_color;
         });
      });

      //Add 'click' eventListeners to color selector buttons
      document.querySelectorAll(".color-selector").forEach((e, i) => {
         e.addEventListener('click', () => {
            this.select_color(this.colors[i]);
         });
      });
   }
   
   select_color(color) {
      document.querySelector(`#${this.selected_color}-btn`).style.border = `solid 2px ${this.selected_color}`;
      this.selected_color = color;
      document.querySelector(`#${this.selected_color}-btn`).style.border = `solid 2px ${color === 'white' ? 'black' : 'white'}`;
   }

   submit() {
      let color_arr = [];
      this.grid.forEach((e) => {
         color_arr.push(e.style.background);
      })

      let t = document.getElementById('art-title').value;
      if(t === "") {
         t = 'Untitled Creation'
      }
      
      let creation = {
         title: t,
         artist: this.artist,
         date: this.date,
         grid: color_arr
      };

      let gallery = localStorage.getItem('gallery');
      if(gallery === null) {
         localStorage.setItem('gallery', JSON.stringify({creations: []}));
         gallery = localStorage.getItem('gallery');
      }
      gallery = JSON.parse(gallery);
      gallery.creations.push(creation);
      localStorage.setItem('gallery', JSON.stringify(gallery));

      window.location.href = "gallery.html";
   }
}

const art = new Art();