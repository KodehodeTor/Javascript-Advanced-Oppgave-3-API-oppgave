//LocalStorage

const storage_key = "savedCards";

//Export for saving card
export function savedCard(card) {
  const savedCards = loadedSavedCards();

  //Checks if there are any duplicates.
  const existingIndex = savedCards.findIndex((e) => c.name === card.name);
  if (existingIndex !== -1) {
    savedCards[existingIndex] = card;
  } else {
    savedCards.push(card);
  }
  localStorage.setItem(storage_key, JSON.stringify(savedCards));
}

//Loads saved cards
export function loadedSavedCards() {
  const fresh = localStorage.getItem(storage_key);
  if (!fresh) return [];
  try {
    return JSON.parse(fresh);
  } catch (err) {
    console.log("localStorage data error, restarting:", err);
    localStorage.removeItem(storage_key);
    return [];
  }
}

//Removes saved card
export function removeCard(cardName) {
  const savedCards = loadedSavedCards().filter((c) => c.name !== cardName);
  localStorage.setItem(storage_key, JSON.stringify(savedCards));
}
