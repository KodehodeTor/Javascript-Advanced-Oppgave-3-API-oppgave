//Creates card, removes double face card name (//)

const cardCont = document.querySelector("#cards");

export function createCard(cardInfo) {
  const div = document.createElement("div");
  div.className = "card";

  const p = document.createElement("p");

  //Cleaning up card name to avoid double sided card names
  let cardName = cardInfo.name;
  if (cardName.includes("//")) {
    cardName = cardName.split("//")[0].trim();
  }
  //centers the title after double face name is removed
  p.style.textAlign = "center";
  //Creates the title
  let textP = document.createTextNode(cardName);
  //Creates img card
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
