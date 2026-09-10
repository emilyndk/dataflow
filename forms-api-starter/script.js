import { getEntries, addEntry, deleteEntry } from "./api.js";
import { transition } from "./transition.js";

const form = document.querySelector("form");
const formSubmitBtn = form.querySelector('[type="submit"]');
const formStatus = document.querySelector("#form-status");
const list = document.querySelector(".entries");
const listStatus = document.querySelector("#list-status");
const template = document.querySelector("#entry-template");

// Givet: GET og rendering fra favoritopgaven.
function createEntry(entry) {
  const clone = template.content.cloneNode(true);
  const name = `${entry.firstname} ${entry.lastname}`;
  clone.querySelector(".entry-name").textContent = name;
  clone.querySelector(".entry-email").textContent = entry.email;
  const button = clone.querySelector(".delete-entry");
  button.dataset.id = entry.id;
  button.ariaLabel = `Slet tilmelding: ${name}`;
  button.addEventListener("click", handleDelete);
  return clone;
}

// Givet: samme rendering bruges ved start og efter POST/DELETE.
async function renderEntries() {
  try {
    const entries = await getEntries();
    await transition(() => list.replaceChildren(...entries.map(createEntry)));
    listStatus.textContent = `${entries.length} tilmeldinger i listen.`;
  } catch (error) {
    listStatus.textContent = "Kunne ikke hente listen.";
    console.error(error);
  }
}

function handleInvalid(event) {
  // TODO 1: Sæt event.target.ariaInvalid til "true".
  // Undertryk popup med preventDefault, og fokusér formens første :invalid-felt.
  // Flyt kun fokus, hvis event.target er dette første felt.
}

function syncAriaInvalid(input) {
  // TODO 1: Hvis input.matches(":user-invalid"), sæt ariaInvalid til "true".
  // Ellers: fjern aria-invalid. CSS og ARIA skal følge samme tilstand.
  //
  // if (input.matches(":user-invalid")) {
  //
  // } else {
  //
  // }
}

function handleFocusOut(event) {
  if (event.target.matches("input, textarea, select")) {
    syncAriaInvalid(event.target);
  }
}

function handleInput(event) {
  const input = event.target;
  if (
    input.matches("input, textarea, select") &&
    input.ariaInvalid === "true"
  ) {
    syncAriaInvalid(input);
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  // TODO 2: Opret FormData, og saml firstname, lastname og email i et objekt.
  // TODO 3: Afvent addEntry(data). Nulstil form og aria-invalid efter succes.
  // Vis en kort succesbesked i formStatus, og kald await renderEntries().
  // Ved POST-fejl: bevar input, og vis en kort fejl i formStatus.
  // TODO 5: formSubmitBtn.disabled = true før request; false i finally.
}

async function handleDelete(event) {
  const button = event.currentTarget;
  const feedback = button.closest(".entry").querySelector(".entry-feedback");
  // TODO 4: Afvent deleteEntry(button.dataset.id), derefter await renderEntries().
  // Flyt fokus med list.focus() efter rendering. Listen bliver i DOM, også uden poster.
  // Ved DELETE-fejl: vis en kort fejl i feedback.
  // TODO 5: button.disabled = true før request; false i finally.
}

form.addEventListener("invalid", handleInvalid, true);
form.addEventListener("input", handleInput);
form.addEventListener("focusout", handleFocusOut);
form.addEventListener("submit", handleSubmit);

renderEntries();
