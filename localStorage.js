//Store value of input into memory by copying it. Thats card img and p. (div.card)

//Item here will be img and p (div.card). We can use any name we want for keyName. input.value is what we want to store into the memory.

// Psuedo:

// const cards.

//herocard = document.querySelector('herocard')

// herocard.innerHTML = localStorage.getItem("value")
// div.card.addEventListner('click', display)

// function display() {
// localStorage.setItem('value', div.card.value)
// herocard.innerHTML = localStorage.getItem("value")
// }

// Find card Elements that were created by Scryfall results.

const cards = document.querySelectorAll("div.card");

//When a card is clicked. Get info belonging to that card.

cards.addEventlistener("click", display);

// Save the card information into localStorage

function display() {
  //Get cards name
  //Get cards img url
  //Create object including name/img url
  //Object into string with JSON.stringify()
  //Save string
}

//Get saved card from localStorage
//JSON.parse()
//Display card in hero section
