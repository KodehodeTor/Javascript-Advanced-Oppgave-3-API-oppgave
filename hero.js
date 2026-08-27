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
  if (savedCards.length >= 6) {
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

  // NOTE: Unsure which to use.
  // // Screen changes trigger recalculations.
  // const mediaQueries = [
  //   window.matchMedia("(min-width: 48rem)"), //tablet 768px
  //   window.matchMedia("(min-width: 64rem)"), //desktop 1024px
  // ];

  // mediaQueries.forEach((mq) => {
  //   mq.addEventListener("change", carouselMQ);
  // });

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
