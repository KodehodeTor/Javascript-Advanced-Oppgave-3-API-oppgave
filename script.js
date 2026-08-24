import { getData } from "./scryfall.js";
import { createCard } from "./createCard.js";

// API source
const scryapi = "https://api.scryfall.com";
const cardCont = document.querySelector("#cards");
const search = document.querySelector("#search");

// Search function
search.addEventListener("submit", function (e) {
  //Stops the browser for executing default built in behaviour
  e.preventDefault();

  //HTML elements
  const color = document.querySelector("#color").value;
  const type = document.querySelector("#type").value;
  const set = document.querySelector("#set").value;
  const name = document.querySelector("#card_name").value;
  const commander = document.querySelector("#commander").value;

  let query = "";
  //Search logic

  if (color) {
    query += `color:${color} `;
  }
  if (type) {
    query += `type:${type} `;
  }
  if (set) {
    query += `set:${set} `;
  }
  if (name) {
    query += `name:${name} `;
  }
  if (commander) {
    query += `commander:${commander} `;
  }
  if (query === "") {
    alert("Please filter search");
  }
  console.log("Scryfall query:", query);
  //encodes a specific component of a URI by replacing special characters with UTF-8.
  getData(`${scryapi}/cards/search?q=${encodeURIComponent(query)}`);
});

let nextUrl = null;

//Runs when clicking "load more"
function loadNextPage() {
  if (nextUrl) {
    setTimeout(() => {
      //Scryfall needs 100ms delay for requests.
      getData(nextUrl, true);
    }, 100);
  }
}

//Eventlistner for load button
const loadBtn = document.querySelector("#load_btn");
if (loadBtn) {
  loadBtn.addEventListener("click", loadNextPage);
}

//Shows the load more button if more pages exists.
export function toggleLoadMoreButton() {
  const btn = document.querySelector("#load_btn");
  if (btn) {
    btn.style.display = nextUrl ? "block" : "none";
  }
}

//Displays data:
export function displayData(data) {
  //If there is any data, return "Current array of cards: array"
  if (!data) return;
  //Clear container to avoid duplicates
  cardCont.innerHTML = "";

  console.log("Current array of cards:", data);
  //For each data create a card
  data.forEach((e) => {
    createCard(e);
  });
}
