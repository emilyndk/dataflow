// Indsæt dit eget resource-endpoint, fx https://DIT-PROJEKT.mockapi.io/products
const endpoint = "https://6aa29282ccb3db9689a6a8f1.mockapi.io/api/v1/users";

export async function getProducts() {

 const response = await fetch(endpoint, {
  method: "get",
  headers: {
    "Content-Type": "application/json"
  }
 })


  if (!response.ok) {
    throw new Error(`HTTP-fejl: ${response.status}`);
  }

  // TODO 2: GET endpoint, kontrollér response.ok, og returnér response.json().
  // Erstat fejlen nedenfor, når du implementerer funktionen.
  return response.json()
}

export async function updateFavorite(id, favorite) {

   const response = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      favorite: favorite,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP-fejl: ${response.status}`);
  }

  return response.json();
  
  // TODO 5: PUT til endpoint/id med { favorite } som JSON.
  // Kontrollér response.ok, og returnér det opdaterede produkt fra svaret.
  // Erstat fejlen nedenfor, når du implementerer funktionen.
  throw new Error("PUT mangler: Implementér trin 5 i api.js.");
}
