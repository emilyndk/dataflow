// Indsæt dit eget MockAPI resource-endpoint uden afsluttende /.
const endpoint = "";

export async function getEntries() {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`GET fejlede: ${response.status}`);
  return response.json();
}

export async function addEntry(data) {
  // TODO 3: POST til endpoint. Send data som JSON med Content-Type-header.
  // Kontrollér response.ok, og returnér response.json().
}

export async function deleteEntry(id) {
  // TODO 4: DELETE til `${endpoint}/${id}`. Kontrollér response.ok.
  // UI behøver ikke svar-bodyen, så undlad response.json() her.
}
