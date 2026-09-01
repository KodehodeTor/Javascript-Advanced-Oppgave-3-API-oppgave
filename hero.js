import {
  loadedSavedCards,
  removeCard,
  updateCardPrice,
} from "./localStorage.js";
import { fetchCardPrice } from "./scryfall.js";

const heroCard = document.querySelector("#hero_card");
const savedCardCont = document.querySelector("#saved_cards");
const staticCardCont = document.querySelector("#saved_cards_static");
console.log("Animated container:", savedCardCont);
console.log("Static container:", staticCardCont);

const oneDayRefresh = 24 * 60 * 60 * 1000;

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
  if (savedCards.length >= 6) {
    startCarousel(savedCards);
  }
}

//Create saved card
function createSavedCard(card, container) {
  const element = document.createElement("div");
  element.className = "saved_card";

  const priceClass = card.price ? "has" : "hasnt";
  const priceText = card.price ? `€${card.price}` : "Price unavailable";

  let trend = "";
  if (card.price && card.previousPrice && card.price !== card.previousPrice) {
    const difference = parseFloat(card.price) - parseFloat(card.previousPrice);
    trend =
      difference > 0
        ? `<span class="price_up">▲ €${Math.abs(diff).toFixed(2)}</span>`
        : `<span class="price_down">▼ €${Math.abs(diff).toFixed(2)}</span>`;
  }

  element.innerHTML = `
     <p>${card.name}</p>
        <img src="${card.image}" alt="${card.name}">
    <p class="card_price ${priceClass}">${priceText}</p>
        <button data-name="${card.name}" class="remove_btn">Remove</button>
        `;
  container.appendChild(element);
}

async function refreshSavedCardPrices() {
  const savedCards = loadedSavedCards();
  const now = Date.now();

  const oldCards = savedCards.filter((c) => {
    const lastChecked = new Date(card.priceDate).getTime();
    return now - lastChecked >= oneDayRefresh;
  });

  if (oldCards.length === 0) {
    console.log("All saved cards are up to date");
    return;
  }

  console.log(`Refreshing prices for ${oldCards.length} old cards...`);

  for (const card of oldCards) {
    const newPrice = await fetchCardPrice(card.name);
    if (newPrice !== null) {
      updateCardPrice(card.name, newPrice);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  displaySavedCards;
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

  console.log("Cards:", cards.length);

  let animation = null;

  function carouselMQ() {
    if (animation) {
      animation.cancel();
    }
    const distance = secondSetFirstCard.offsetLeft - firstCard.offsetLeft;
    // console.log("Calculating distance:", distance);

    // Animation stored
    animation = savedCardCont.animate(
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

  //Handles resizing, small delay to avoid lag.
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(carouselMQ, 150);
  });

  carouselMQ();

  //Pause animation on hover
  savedCardCont.addEventListener("mouseover", (c) => {
    const card = c.target.closest(".saved_card");
    if (!card) return;

    animation.pause();
    card.style.transform = "scale(1.2)";
    card.style.zIndex = "99";
  });

  //If mouse leaves a card:
  savedCardCont.addEventListener("mouseout", (c) => {
    const card = c.target.closest(".saved_card");
    if (!card) return;

    card.style.transform = "scale(1)";
    card.style.zIndex = "1";

    if (!savedCardCont.contains(c.relatedTarget)) {
      animation.play();
    }
  });

  savedCardCont.addEventListener("mouseleave", () => {
    animation.play();
    cards.forEach((card) => {
      card.style.transform = "scale(1)";
      card.style.zIndex = "1";
    });
  });
}

//remove clicker for animated cards
if (savedCardCont) {
  savedCardCont.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove_btn");

    if (!removeBtn) return;

    removeCard(removeBtn.dataset.name);
    displaySavedCards();
  });
}
//remove clicker for static cards
if (staticCardCont) {
  staticCardCont.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove_btn");

    if (!removeBtn) return;

    removeCard(removeBtn.dataset.name);
    displaySavedCards();
  });
}

displaySavedCards();
refreshSavedCardPrices();
