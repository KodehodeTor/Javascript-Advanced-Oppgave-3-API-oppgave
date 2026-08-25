import { loadedSavedCards, removeCard } from "./localStorage.js";

const heroCard = document.querySelector("#hero_card");
const savedCardCont = document.querySelector("#saved_cards");
const staticCardCont = document.querySelector("#saved_cards_static");
console.log("Animated container:", savedCardCont);
console.log("Static container:", staticCardCont);

export function displayHero(card) {
  if (!heroCard) return;

  heroCard.innerHTML = `
  <img src="${card.image}" alt="${card.name}">
  <h2>${card.name}</h2>
  <p>${card.price ? `€${card.price}` : "Price unavailable"} </p> 
  `;
}

//append saved cards in hero section
export function displaySavedCards() {
  if (!savedCardCont || !staticCardCont) return;

  savedCardCont.innerHTML = "";
  staticCardCont.innerHTML = "";

  const savedCards = loadedSavedCards();
  console.log("Saved cards:", savedCards.length);

  //no saved cards
  if (savedCards.length === 0) {
    savedCardCont.innerHTML = `<p class="no_saved_cards">No saved cards yet</p>`;
    return;
  }

  //Animate cards
  savedCards.forEach((card) => {
    createSavedCard(card, savedCardCont);
  });

  console.log("Creating static cards...");
  //Stationary cards
  savedCards.forEach((card) => {
    createSavedCard(card, staticCardCont);
  });

  console.log(
    "Static cards actually in DOM:",
    staticCardCont.querySelectorAll(".saved_card").length,
  );

  //Start animation
  if (savedCards.length >= 2) {
    startCarousel(savedCards);
  }
}

//Create saved card
function createSavedCard(card, container) {
  const element = document.createElement("div");

  element.className = "saved_card";

  element.innerHTML = `
     <p>${card.name}</p>
        <img src="${card.image}" alt="${card.name}">
       
        <button data-name="${card.name}" class="remove_btn">Remove</button>
        `;
  container.appendChild(element);
}

// Start carousel

function startCarousel(savedCards) {
  //Duplicate cards:
  savedCards.forEach((card) => {
    createSavedCard(card, savedCardCont);
  });

  const cards = savedCardCont.querySelectorAll(".saved_card");

  const firstCard = cards[0];
  const secondSetFirstCard = cards[savedCards.length];

  const distance = secondSetFirstCard.offsetLeft - firstCard.offsetLeft;

  console.log("Cards:", cards.length);
  console.log("Distance:", distance);

  savedCardCont.animate(
    [
      {
        transform: "translateX(0)",
      },
      {
        transform: `translateX(-${distance}px)`,
      },
    ],
    {
      duration: 50000,
      iterations: Infinity,
      easing: "linear",
    },
  );
}

//remove clicker
if (savedCardCont) {
  savedCardCont.addEventListener("click", (e) => {
    if (e.target.matches(".remove_btn")) removeCard(e.target.dataset.name);
    displaySavedCards();
  });
}

displaySavedCards();
