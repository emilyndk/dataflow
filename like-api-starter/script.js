import { getProducts, updateFavorite } from "./api.js";

const productList = document.querySelector(".product-list");
const productCount = document.querySelector("#product-count");
const loadStatus = document.querySelector("#load-status");

const priceFormatter = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  maximumFractionDigits: 0,
});

function createCard(product) {
  // TODO 1: Opret denne template i HTML ved at flytte det statiske kort.
  const template = document.querySelector("#product-card-template");
  const card = template.content.cloneNode(true);
  const button = card.querySelector(".favourite");

  // TODO 3: Udfyld billedets src/alt, .product-name, .kind og .price.
  // .kind skal vise både product.kind og product.colorOptions.
  // Brug textContent til tekst og priceFormatter.format(product.price).

  // TODO 4: Sæt navn, aria-pressed og data-product-id ud fra produktet.
  // Tilføj handleFavoriteClick som klikfunktion på hver knap.

  return card;
}

async function renderProducts() {
  // TODO 2: Afvent getProducts(), og log API-svaret.
  // Brug try/catch, og vis en forståelig fejl i loadStatus.
  // TODO 3: Render API-arrayet med map og replaceChildren(...).
  // Opdatér antal.
  // TODO 6: Brug korte beskeder, og ryd gamle beskeder før et nyt forsøg.
  // Det statiske kort står i HTML, indtil du begynder på trin 1.
}

async function handleFavoriteClick(event) {
  const button = event.currentTarget;
  const feedback = button
    .closest(".product-card")
    .querySelector(".card-feedback");

  // TODO 4: Læs id og ariaPressed. Beregn den modsatte boolean, og log den.
  // TODO 5: Afvent updateFavorite(id, nextFavorite), og brug svarets favorite.
  // TODO 6: Blokér gentagne aktiveringer. Vis kort succes eller fejl i feedback.
  // Bevar knappen og fokus; ændr ikke pressed-state, hvis requesten fejler.
}

renderProducts();
