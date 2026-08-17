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

  console.log("Scryfall query:", query);
  //encodes a specific component of a URI by replacing special characters with UTF-8.
  getData(`${scryapi}/cards/search?q=${encodeURIComponent(query)}`);
});

let nextUrl = null;
let allLoadedCards = [];

//Function for getting data, load next array. Includes loading spinner.
async function getData(url, isNextPage = false) {
  if (url.startsWith("https://api.scryfall.com")) {
    const spinner = document.querySelector("#loading_spinner");
    if (spinner) {
      spinner.style.display = "block";
    }

    fetch(url, {
      method: "GET",
      headers: {
        //Required header, requests JSON formatting preferance:
        Accept: "application/json;q=0.9,*/*;q=0.8",
      },
    })
      .then((res) => res.json())
      //If its a new search, clear old array.
      .then((data) => {
        if (!isNextPage) {
          allLoadedCards = [];
        }
        //Append new array of 175 to list
        allLoadedCards = allLoadedCards.concat(data.data);
        //Save next page URL
        nextUrl = data.has_more ? data.next_page : null;
        //Display updated array
        displayData(allLoadedCards);
        //Load more button
        toggleLoadMoreButton();
      }) //Catches errors
      .catch((err) => console.log("Fetch Error: ", err))
      // Stops the loading spinner from spinning after loading
      .finally((e) => {
        document.querySelector("#loading_spinner").style.display = "none";
      });
  }
}

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
function toggleLoadMoreButton() {
  const btn = document.querySelector("#load_btn");
  if (btn) {
    btn.style.display = nextUrl ? "block" : "none";
  }
}

//Displays data:
function displayData(data) {
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

function createCard(cardInfo) {
  const div = document.createElement("div");
  div.className = "card";

  const p = document.createElement("p");

  //Cleaning up card name to avoid double sided card names
  let cardName = cardInfo.name;
  if (cardName.includes("//")) {
    cardName = cardName.split("//")[0].trim();
  }
  let textP = document.createTextNode(cardName);

  const img = document.createElement("img");
  if (cardInfo.image_uris) {
    //If uri is normal, display normal card.(cardInfo->uris->normal) If not; the structure is different. (cardInfo->card_faces->[0]->image_uris->normal)
    img.src = cardInfo.image_uris.normal;
  } else if (cardInfo.card_faces) {
    img.src = cardInfo.card_faces[0].image_uris.normal;
  }
  img.alt = cardName;

  //Apend to html
  p.append(textP);
  div.appendChild(p);
  div.appendChild(img);
  cardCont.appendChild(div);
}

//NOTES & FUTURE PLANS
// Card saver (localStorage)
// When click cards, have save option, go to Cardmarket option and select option (for mass additions of cards)

// Need a box on the top where you can save your cards and follow pricing trends in cardmarket etc.
// Delete individual cards from the save_box
