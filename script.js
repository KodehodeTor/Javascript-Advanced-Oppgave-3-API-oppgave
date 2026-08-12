// API source
const scryapi = "https://api.scryfall.com";

const cardCont = document.querySelector("#cards");
const search = document.querySelector("#search");

// Search function
search.addEventListener("submit", function (e) {
  //Stops the browser for executing default built in behaviour
  e.preventDefault();

  const color = document.querySelector("#color").value;
  const type = document.querySelector("#type").value;
  const set = document.querySelector("#set").value;
  const name = document.querySelector("#name").value;
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

//ISSUE: We only get one 175 array! We need to check if another array exisist and add a next page into getData function.

async function getData(url) {
  if (url.startsWith("https://api.scryfall.com")) {
    fetch(url, {
      method: "GET",
      headers: {
        //Required header, requests JSON formatting preferance:
        Accept: "application/json;q=0.9,*/*;q=0.8",
      },
    })
      .then((res) => res.json())
      .then((data) => displayData(data.data))
      .catch((err) => console.log("Fetch Error: ", err));
  }
}

//Displays data:
function displayData(data) {
  //If there is any data, return "Current array of cards: array"
  if (!data) return;
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
  let textP = document.createTextNode(cardInfo.name);

  const img = document.createElement("img");
  if (cardInfo.image_uris) {
    //If uri is normal, display normal card.(cardInfo->uris->normal) If not; the structure is different. (cardInfo->card_faces->[0]->image_uris->normal)
    img.src = cardInfo.image_uris.normal;
  } else if (cardInfo.card_faces) {
    img.src = cardInfo.card_faces[0].image_uris.normal;
  }
  img.alt = cardInfo.name;

  //Apend to html
  p.append(textP);
  div.appendChild(p);
  div.appendChild(img);
  cardCont.appendChild(div);
}

//EXTRA ARRAY STRUCTURE?
//artist: "Name Here"
//finishes: ['nonfoil]/['foil'] foil:false/true
//game_changer: false/true
//set: "name"
//set_name "Name: Name Here"
//power: "1"
//toughness: "2"
//mana_cost: "{R}" "{R}" "{G}" (red red green)
// cardmarket_id: 468339

// Content Security Policy (CSP)
// For CSP, you can grantlist *.scryfall.com to use our API and our assets. You do not need to grantlist the apex domain.

// If you would like an exhaustive list instead, a spec is provided below to merge with your existing CSP header:

// connect-src
//   api.scryfall.com
//   embed.scryfall.com;
// img-src
//   *.scryfall.io
// style-src
//   embed.scryfall.com;
// script-src
//   embed.scryfall.com;
// font-src
//   embed.scryfall.com;

//More info: https://scryfall.com/advanced
//More info: https://scryfall.com/docs/syntax
//OBS CHANGES DONE 1 JULY 2026: https://scryfall.com/blog/two-new-ways-to-sync-scryfall-data-236
//API Practice: Always fetch URIs dynamically via the Scryfall API rather than hardcoding static subdomain paths, as asset hostnames can update.

// The Scryfall Magic search endpoint returns a maximum of 175 cards per page/array. If your query has more results, you must check the has_more boolean and loop through subsequent pages using the &page=2, &page=3 parameters. (Pagination Issue)

//
