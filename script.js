// ASSIGNMENT REQUIREMENTS & DOCUMENTATION

// 1. Multiple Endpoints: Utilizes Scryfall's search endpoint with dynamic queries.
// 2. URL Parameters: Appends advanced search parameters (?q=...) to filter data directly on the server.
// 3. API Data Loops: Uses a time-delayed loop to fetch data, and an array loop to generate UI elements.

// SCRYFALL API RULES IMPLEMENTED:
// - HTTPS Protocol & TLS: Forced via secure 'https://' base URL structure.
// - Required Headers: Mandatory 'Accept' header injected manually; browser 'User-Agent' kept intact.
// - UTF-8 Compliance: Uses 'document.createTextNode()' to safely render special non-ASCII characters.
// - Rate-Limiting Protection: Staggers consecutive fetch commands using a 100ms timeout buffer.

// API USED:
// Scryfall - https://api.scryfall.com

const scryapi = "https://api.scryfall.com";

const cardCont = document.querySelector("#cards");

const search = document.querySelector("#search");
//DE-SELECTING UNDER SECTION FOR A BETTER SOLUTION:
// An array of different search parameters that runs through a loop.
// const searchQueries = [
//   "type:creature+color:red",
//   "type:planeswalker",
//   "set:neo",
// ];

// Loop that goes through our query parameter. Instead of triggering all request at the same time we space them out by 100ms blocks to comply with Scryfall's server limit.
// searchQueries.forEach((query, index) => {
//   setTimeout(() => {
//     getData(`${scryapi}/cards/search?q=${query}`);
//   }, index * 100);
// });

//NEW FUNCTION INC:

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
    query += `color: ${color} `;
  }
  if (type) {
    query += `type: ${type} `;
  }
  if (set) {
    query += `set: ${set} `;
  }
  if (name) {
    query += `name: ${name} `;
  }
  if (commander) {
    query += `commander: ${commander} `;
  }

  console.log("Scryfall query:", query);
  //encodes a specific component of a URI by replacing special characters with UTF-8.
  getData(`${scryapi}/cards/search?q=${encodeURIComponent(query)}`);
});

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
  img.src = cardInfo.image_uris.normal;
  img.alt = cardInfo.name;

  //Apend to html
  p.append(textP);
  div.appendChild(p);
  div.appendChild(img);
  cardCont.appendChild(div);
}

// NOW TO APPEND THE CARDS PROPERLY WITH THEIR RESPECTED IMAGE!!!

//GOAL : Make a filter towards legalities (like commander) and colors.
//As well as order list for price in cardmarket EU trend 30 days
//A top 10(adjustable?) list to check prices of your fav cards in the selected colors.
//Use localStorage to remember ?
//Custom small size for the card, display full card when hover / click?
//Add input field to search.

// BASIC RELEVANT ARRAY STRUCTURE:
//name: "Name-Name Here"
//color_identity: Array [W, B]
//colors: Array [B, G, W, P, S, C]
//legalities: commander: "legal" / "not_legal"
//prices: eur

//image_uris
//large:
//normal:
//small:
//thumb:

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
