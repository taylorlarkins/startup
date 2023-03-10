class Art {
   artist;
   grid;
   date;
   selected_color;
   colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black'];

   constructor() {
      this.artist = localStorage.getItem("current_user");
      this.selected_color = "red";
      let temp = new Date();
      this.date = `${temp.getMonth() + 1}.${temp.getDay()}.${temp.getFullYear}`;
      
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
      document.querySelector(`#${this.selected_color}-btn`).style.border = "solid 2px white";
   }
}

const art = new Art();