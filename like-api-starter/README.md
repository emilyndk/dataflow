# Hent produkter og gem favoritter

Sidste gang gjorde du favoritknappen tilgængelig. Nu skal de samme produktkort
bygges fra API-data, og favoritvalget skal kunne overleve en genindlæsning.

Start i `index.html`,
og arbejd derefter i `script.js` og `api.js`.
TODO-numrene følger trinene nedenfor.

## Det færdige resultat

- GET henter produkter fra jeres eget MockAPI-endpoint.
- En template bliver til ét kort pr. produkt.
- Produktets `favorite` bestemmer hjertets udseende og knappens `aria-pressed`.
- Knappens tilgængelige navn identificerer produktet, fx “Favorite: Nike Zoom Vomero 5”.
- PUT gemmer den nye værdi; UI opdateres ud fra API-svaret.

## Før du starter

1. Opret en gratis konto på [MockAPI](https://mockapi.io/), log ind, og opret et nyt projekt.
2. Opret en resource i dit eget MockAPI-projekt, fx `products`.
3. Opret felterne nedenfor. Tilføj to poster gennem MockAPIs Data-visning med JSON-data fra `sample-products.json` (copy/paste). Filen er kun til at fylde MockAPI med data; den skal ikke importeres i JavaScript. Lad MockAPI tildele id’er. Kontrollér via resource-URL’en, at begge produkter findes og `favorite` er en boolean.
4. Åbn projektet med en lokal webserver, fx Live Server.
5. Indsæt resource-URL'en i `endpoint` i `api.js`, uden afsluttende `/`.
6. Åbn DevTools → Network og Console.

| Felt           | Type               | Eksempel               |
| -------------- | ------------------ | ---------------------- |
| `id`           | MockAPIs id        | `"1"`                  |
| `name`         | String             | `"Nike Zoom Vomero 5"` |
| `kind`         | String             | `"Lifestyle"`          |
| `colorOptions` | Number             | `6`                    |
| `price`        | Number             | `1299`                 |
| `image`        | String, billed-URL | Se eksempeldata        |
| `favorite`     | Boolean            | `false`                |

## Del A — Hent og byg fra API

### 1. Fra statisk kort til template

Åbn siden. Du ser ét produkt direkte i HTML. Der er ingen API-kald endnu.
Find de dele, som skal følge data: navn, billede, kategori, farver, pris og favorit.

- Opret `<template id="product-card-template">` efter `main`.
- Flyt hele kortets `<li>…</li>` ind i templaten. Bevar den nu tomme `.product-list`.
- Bevar kortets a11y-markup. `createCard(product)` indeholder allerede kloningen.

**Stop og test:** Kortet er væk efter genindlæsning. En template vises ikke af sig selv. I de næste trin henter I API-data og bruger templaten til at vise dem.

### 2. Hent produkter med GET

Implementér `getProducts()` i `api.js`:

- Hent samlingen med `fetch(endpoint)`.
- Kontrollér `response.ok`. Kast en `Error`, hvis svaret ikke er OK.
- Returnér `response.json()`.
- Kald `await getProducts()` i `renderProducts()`, og log resultatet.
- Brug `try/catch`, og vis evt. en forståelig fejl i `loadStatus` med `textContent`.

**Stop og test:** Network viser GET til samlingen. Find arrayet, produktets id og `favorite` som boolean i svaret. Siden er stadig tom; det er næste trins opgave.

### 3. Render produkterne fra API-svaret

Arbejd i `createCard(product)` i `script.js`:

- Udfyld `.product-name`, `.kind` (kategori og antal farver) og `.price` med `textContent`.
- Brug `priceFormatter.format(product.price)` til prisen.
- Sæt billedets `src` fra `product.image` og `alt` fra `product.name`.
- Brug selectors på `card`, så du udfylder den aktuelle klon.

Arbejd derefter videre med det hentede array i `renderProducts()`:

- Brug `products.map(createCard)` til at skabe kortene.
- Indsæt dem med `productList.replaceChildren(...products.map(createCard));`. Spread (`...`) giver metoden kortene som separate argumenter.
- Opdatér `productCount` fra arrayets længde.

**Stop og test:** Begge API-produkter vises med deres egne oplysninger. Favoritknappens navn og state forbindes til data i næste trin.

## Del B — Toggle favorite

### 4. Forbind produkt, knap og tilstand

I `createCard(product)`:

- Giv knappen navnet `Favorite: ${product.name}` via `ariaLabel`.
- Sæt `ariaPressed` til strengversionen af `product.favorite`.
- Gem produktets id i `button.dataset.productId`.
- Bind `handleFavoriteClick` én gang på hver knap, her i funktionen.

I `handleFavoriteClick(event)`:

- Brug `event.currentTarget`, som peger på knappen.
- Læs id'et og sammenlign `button.ariaPressed` med `"true"`.
- Beregn den modsatte boolean med `!`, og log id og ønsket værdi.

**Stop og test:** De to startværdier giver et tomt og et fyldt hjerte. Test knapperne med mus, Enter og Mellemrum. Console skal vise det rigtige produkt-id. Find navn, button-rolle og pressed-state i browserens accessibility-visning.

### 5. Gem valget med PUT

Implementér `updateFavorite(id, favorite)` i `api.js`.

- Brug URL'en til én post: `${endpoint}/${id}`.
- Sæt metoden til `PUT` og headeren `Content-Type` til `application/json`.
- Send kun ændringen som JSON: `{ favorite: true }` eller `{ favorite: false }`. Brug parameterens boolean og `JSON.stringify()`.
- Kontrollér `response.ok`, og returnér det opdaterede produkt som JSON.
- I klik-handleren: afvent funktionen, og sæt `button.ariaPressed` ud fra **svarets** `favorite`. CSS reagerer allerede på attributten.

**Stop og test:** Network viser PUT til det valgte id og en boolean i payload. Når svaret er OK, skifter kun det valgte hjerte. Genindlæs siden: GET skal hente den gemte værdi. Prøv at slå favoritten både til og fra.

Knappens navn skifter ikke til “Liked” eller “Not liked”; det er pressed-state, som fortæller, om favoritten er valgt. Genrender ikke hele listen efter PUT: opdatér den eksisterende knap, så tastaturfokus bliver på samme element.

## Del C — Ventetid og fejl (optional)

### 6. Ventetid, fejl og et nyt forsøg

Ved GET:

- Vis antal produkter ved succes.
- Ved fejl: skriv “Kunne ikke hente produkterne.” i `loadStatus`.

Ved PUT:

- Ignorér aktiveringen, hvis knappens `ariaDisabled` allerede er `"true"`.
- Sæt `ariaDisabled` til `"true"` før `await`. Attributten kræver en guard i JS.
- Ryd kortets `feedback`, når et nyt forsøg starter.
- Ved succes: brug API-svarets `favorite` til `ariaPressed`, og vis “Favorit opdateret.”.
- Ved fejl: bevar den gamle state, og vis “Kunne ikke gemme favoritten.”.
- Gør knappen aktiv igen i `finally`. Bevar fokus og det stabile knapnavn.

Korte beskeder er nok; der skal ikke implementeres særskilte ventebeskeder.

## Filer

- `index.html`: ét statisk kort, som I flytter til en template; a11y og statusområder er givet.
- `styles.css`: udleveret design fra like-opgaven og styling af states.
- `api.js`: starter til GET og PUT med tydelige TODO-fejl, indtil de implementeres.
- `script.js`: funktioner og hooks til rendering og interaktion; TODO 1–6.
- `sample-products.json`: gyldig JSON til copy/paste i MockAPI, ikke en lokal datakilde.

## Kilder og API-afgrænsning

Vi bruger PUT i denne opgave. MockAPIs dokumentation viser et delvist objekt til opdatering med PUT og nævner også PATCH. Vi bygger derfor ikke undervisningen på en generel påstand om, at PATCH er umuligt. På andre API'er kan PUT kræve en hel repræsentation: følg altid det konkrete API's kontrakt. [MockAPI: Quick start](https://github.com/mockapi-io/docs/wiki/Quick-start-guide).

HTTP-fejl skal kontrolleres via `response.ok`; de afviser ikke automatisk fetch-promiset. [MDN: Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

En toggle button med `aria-pressed` beholder sit navn, når dens state ændres. [WAI: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
