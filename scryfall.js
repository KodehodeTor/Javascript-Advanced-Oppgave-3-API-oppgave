import { displayData } from "./script.js";
import { toggleLoadMoreButton } from "./script.js";

export let nextUrl = null;

let allLoadedCards = [];

//Function for getting data, load next array. Includes loading spinner.
export async function getData(url, isNextPage = false) {
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
        if (data.object === "error") {
          console.log("scryfall error:", data.details);
          const counterElement = document.getElementById("card_counter");
          if (counterElement) counterElement.textContent = "No cards found";
          return;
        }
        if (!isNextPage) {
          allLoadedCards = [];
        }
        //Append new array of 175 to list
        allLoadedCards = allLoadedCards.concat(data.data);

        //Card counter:
        const counterElement = document.getElementById("card_counter");
        if (counterElement) {
          counterElement.textContent = `Showing ${allLoadedCards.length} of ${data.total_cards || 0} cards`;
        }

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
        const spinner = document.querySelector("#loading_spinner");
        if (spinner) spinner.style.display = "none";
      });
  }
}
