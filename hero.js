import { loadedSavedCards, removeCard } from "./localStorage.js";

const heroCard = document.querySelector("#hero_card");
const savedCardCont = document.querySelector("#saved_cards");

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
  if (!savedCardCont) return;
  savedCardCont.innerHTML = "";
  const savedCards = loadedSavedCards();

  savedCards.forEach((card) => {
    const element = document.createElement("div");
    element.className = "saved_card";
    element.innerHTML = `
        <img src="${card.image}" alt="${card.name}">
        <p>${card.name}</p>
        <button data-name="${card.name}" class="remove_btn">Remove</button>
        `;
    savedCardCont.appendChild(element);
  });
}

//remove clicker

if (savedCardCont) {
  savedCardCont.addEventListener("click", (e) => {
    if (e.target.matches(".remove_btn")) removeCard(e.target.dataset.name);
    displaySavedCards();
  });
}

displaySavedCards();
