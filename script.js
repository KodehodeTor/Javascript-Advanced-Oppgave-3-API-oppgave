// ASSIGNMENT REQUIREMENTS & DOCUMENTATION
//
// 1. Multiple Endpoints: Utilizes Scryfall's search endpoint with dynamic queries.
// 2. URL Parameters: Appends advanced search parameters (?q=...) to filter data directly on the server.
// 3. API Data Loops: Uses a time-delayed loop to fetch data, and an array loop to generate UI elements.
//
// SCRYFALL API RULES IMPLEMENTED:
// - HTTPS Protocol & TLS: Forced via secure 'https://' base URL structure.
// - Required Headers: Mandatory 'Accept' header injected manually; browser 'User-Agent' kept intact.
// - UTF-8 Compliance: Uses 'document.createTextNode()' to safely render special non-ASCII characters.
// - Rate-Limiting Protection: Staggers consecutive fetch commands using a 100ms timeout buffer.

// API USED:
// Scryfall - https://api.scryfall.com

const scryapi = "https://api.scryfall.com";
const cardCont = document.querySelector("#cards");

//An array of different search parameters that runs through a loop.
const searchQueries = [
  "type:creature+color:red",
  "type:planeswalker",
  "set:neo",
];

//Loop that goes through our query parameter. Instead of triggering all request at the same time we space them out by 100ms blocks to comply with Scryfall's server limit.
searchQueries.forEach((query, index) => {
  setTimeout(() => {
    getData(`${scryapi}/cards/search?q=${query}`);
  }, index * 100);
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
  //Bruke / endre CSS for denne ?? v
  //   div.style.borderColor = cardInfo.borderColor || "black";

  const p = document.createElement("p");
  let textP = document.createTextNode(cardInfo.name);

  //Apend to html
  p.append(textP);
  div.appendChild(p);
  cardCont.appendChild(div);
}

// NOW TO APPEND THE CARDS PROPERLY WITH THEIR RESPECTED IMAGE!!!
