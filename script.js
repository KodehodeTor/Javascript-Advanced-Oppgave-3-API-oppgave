// Krav til oppgaven
// For å sikre at du utfordrer deg selv, må prosjektet ditt inkludere en viss grad av kompleksitet, for eksempel:

// Et API med flere ulike endepunkter som du bruker i prosjektet ditt.
// Et API med et endepunkt som aksepterer parametere i URL-en.
// API-data som må kjøres gjennom en løkke for å hente/generere innhold.

// API'S USED:
// Scryfall - https://api.scryfall.com
// MTGJSON - https://mtgjson.com/api/v5/

const mtgapi = "https://mtgjson.com/api/v5/";
const scryapi = "https://api.scryfall.com";

const cardCont = document.querySelector("#cards");

//Loop that goes through mtgapi
for (let i = 0; i < mtgapi.length; i++) {
  getData(mtgapi + `V${i}.json`);
}

//Vi kan fjerne V17.json fra mtgapi i topp og bruke den annerledes ved å skrive url i fetch og sette opp denne loopen for å smelte sammen flere apis:

//Async getData function

async function getData(url) {
  if (url === "https://api.scryfall.com") {
    fetch(url)
      .then((res) => res.json())
      .then((data) => displayData(data))
      //Dersom vi bruker console.log istedenfor error så er det den informasjonen vi sender. (i konsoll)
      .catch((err) => console.log(err));
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((data) => displayData(data.data.cards))
      .catch((err) => console.log(err));
  }
}

//Displays data:

//Vi bruker then(data => log(data.data.card)) for å browse i datasettet og finne kun korta. (Vi tok vekk console.log for displayData for funksjonen under)
function displayData(data) {
  console.log(data);
  data.forEach((e) => {
    // console.log(e);
    createCard(e);
    // createCard(e);
    // console.log(e.name, e.manaValue);
  });
}

function createCard(cardInfo) {
  const div = document.createElement("div");
  div.className = "card";
  div.style.borderColor = cardInfo.borderColor;

  const p = document.createElement("p");
  let textP = document.createTextNode(cardInfo.name || cardInfo.title);
  p.append(textP);

  div.appendChild(p);

  cardCont.appendChild(div);
}
