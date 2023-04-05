function display_quote() {
   const quoteEl = document.querySelector('#quote');
   const authorEl = document.querySelector('#quote-author');

   fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
         quoteEl.innerText = data.content;
         authorEl.innerText = '-' + data.author;
      });
}

display_quote();