//LocalStorage

const storage_key = "savedCards";

//Export for saving card
export function savedCard(card) {
  const savedCards = loadedSavedCards();
  //Checks if there are any duplicates.
  const existingIndex = savedCards.findIndex((c) => c.name === card.name);

  //Time stamp tracking for the 24 hour price refresh.
  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    const existing = savedCards[existingIndex];
    if (existing.price !== card.price) {
      savedCards[existingIndex] = {
        ...card,
        previousPrice: existing.price,
        priceDate: now,
      };
    } else {
      savedCards[existingIndex] = {
        ...existing,
        ...card,
        previousPrice: exisiting.previousPrice,
        priceDate: exisiting.priceDate,
      };
    }
  } else {
    savedCards.push({
      ...card,
      previousPrice: null,
      priceDate: now,
    });
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

// Updates price on existing saved card, tracking previousPrice for trend. Time gets stamped (PriceDate) so we can refresh if 24 hours have passed.
