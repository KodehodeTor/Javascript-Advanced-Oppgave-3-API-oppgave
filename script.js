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

//Async getData function

async function getData(url) {
  if (url === "https://api.scryfall.com") {
    fetch(url)
      .then((res) => res.json())
      .then((data) => displayData(data))
      .catch((err) => console.log(err));
  } else {
    fetch(url)
      .then((res) => res.json())
      .then((data) => displayData(data.data.cards))
      .catch((err) => console.log(err));
  }
}
