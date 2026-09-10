# Fra formular til gemte tilmeldinger

Byg en lille workshop-tilmelding. Formularen opretter en tilmelding med POST. Listen hentes fra MockAPI med GET, og hver tilmelding kan slettes med DELETE. Du kan se, hvad der er gemt, direkte på siden, også efter genindlæsning.

Du skal arbejde med **forms og dataflow**. Der er bevidste TODO’er: synkronisering af fejltilstand samt POST/DELETE er ikke færdige endnu.

## Før du starter

1. Opret en resource `entries` i dit MockAPI-projekt.
2. Brug felterne `firstname`, `lastname` og `email`, alle med typen String. MockAPI tildeler `id`.
3. Indsæt resource-URL’en uden afsluttende `/` i `api.js`.
4. Copy/paste evt. data fra `sample-entries.json` til MockAPI. En tom samling er også fin.
5. Åbn `index.html` med Live Server eller en anden lokal webserver.

| Handling          | Metode og URL       | Resultat i UI            |
| ----------------- | ------------------- | ------------------------ |
| Hent tilmeldinger | GET /entries        | Vis listen               |
| Opret tilmelding  | POST /entries       | GET → render hele listen |
| Fjern tilmelding  | DELETE /entries/:id | GET → render hele listen |

## Det er allerede lavet

Formularens tre felter har labels koblet med `for`/`id`, `name`, korrekte inputtyper, `required` og `autocomplete`. E-mailinstruktionen er koblet med `aria-describedby`, og fejlteksterne er koblet med `aria-errormessage`.

Det har I øvet tidligere og skal ikke bygge igen. GET, template og rendering er også udleveret.

## Del A — Formularens fejltilstand

### 1. Hold fejltekst og aria-invalid i takt

- Udfyld `handleInvalid()`: sæt feltets `ariaInvalid` til `"true"`.
- Brug `event.preventDefault()` i invalid-handleren for at skjule browserens popup. Native validering stopper stadig indsendelsen. Find `form.querySelector(":invalid")`, og kald kun `.focus()`, hvis `event.target` er dette første felt. Så flyttes fokus én gang.
- Udfyld `syncAriaInvalid(input)`: undersøg `input.matches(":user-invalid")`. Sæt `ariaInvalid` til `"true"`, hvis feltet matcher; fjern ellers attributten.
- Den udleverede `focusout`-listener kalder funktionen, når et felt forlades. Det holder ARIA i takt med fejl, som browseren viser før et submitforsøg.
- Udfyld `handleInput()`: kald samme funktion for et felt, hvis `ariaInvalid` allerede er `"true"`. Så fjernes en eksisterende fejl under rettelse uden at vise fejl for tidligt.
- Tilføj en CSS-regel, der viser fejlteksten i en `.form-group`, når dens input matcher `:user-invalid` eller `[aria-invalid="true"]`. CSS sætter ikke selv ARIA-attributten.

**Stop og test:** Ingen fejl ved sidens start. Skriv en ugyldig e-mail og forlad feltet. Kontrollér både synlig fejltekst og ARIA. Forsøg derefter submit med tomme felter, og ret bagefter ét felt ad gangen. Fejltekst og `aria-invalid` skal følge rettelserne. Instruktionen må ikke forsvinde, når der kommer en fejl. Bevar synligt tastaturfokus.

## Del B — Fra feltværdier til POST

### 2. Saml formularens data

`handleSubmit()` og `event.preventDefault()` er givet.

- Opret `new FormData(form)`.
- Brug `.get()` til at aflæse de udleverede `name`-værdier: `firstname`, `lastname` og `email`.
- Saml dem i et objekt med API-felterne `firstname`, `lastname` og `email`.
- Log objektet. Send det ikke endnu, og nulstil ikke formularen.

### 3. Opret en tilmelding med POST

I `addEntry(data)` i `api.js`:

- Brug `fetch(endpoint, …)` med `method: "POST"`.
- Sæt `Content-Type: application/json`, og brug `JSON.stringify(data)` som body.
- Kontrollér `response.ok`. Kast en fejl ved et mislykket HTTP-svar.
- Returnér `response.json()` — svaret indeholder den nye post med serverens id.

I `handleSubmit()`:

- Afvent `addEntry(data)` inde i `try/catch`.
- Efter vellykket POST: `form.reset()`, fjern `aria-invalid`, og vis fx “[NAVN] er tilmeldt.” i `formStatus`.
- Kald derefter `await renderEntries()`. Den udleverede funktion henter listen med GET og renderer alle kort med en view transition.
- Ved POST-fejl: bevar indtastninger, og vis fx “Kunne ikke gemme tilmeldingen.” i `formStatus`.
- Fjern starterens “Submit virker”-besked.

## Del C — DELETE og tastaturfokus

### 4. Slet en gemt tilmelding

Knapperne har allerede en klik-handler, et produktuafhængigt `data-id` og et navn, der identificerer den konkrete tilmelding.

- Implementér `deleteEntry(id)` med DELETE til `${endpoint}/${id}`.
- Kontrollér `response.ok`. Du behøver ikke læse bodyen: et tomt 204-svar kan ikke JSON-parses.
- Afvent funktionen i `handleDelete()` inde i `try/catch`.
- Kald derefter `await renderEntries()` — GET-svaret bestemmer hele listens indhold.
- Kald `list.focus()` efter rendering. Listen har `tabindex="-1"` og et tilgængeligt navn via `aria-labelledby`, og kan også modtage fokus uden poster.
- Ved DELETE-fejl: vis fx “Kunne ikke slette tilmeldingen.” i kortets `feedback`.
- Fjern starterens “Forbind denne knap”-besked.

**Stop og test:** Slet første, sidste og eneste kort med tastaturet. Hvor lander fokus? Genindlæs: kortet skal også være væk i GET-svaret. Et mislykket DELETE må ikke fjerne det.

### 5. Gør klar til et nyt forsøg

- I `handleSubmit()`: sæt `formSubmitBtn.disabled = true` før POST og
  `formSubmitBtn.disabled = false` i `finally`, efter den efterfølgende GET.
- I `handleDelete()`: brug samme mønster med `button.disabled` på den valgte sletteknap.
- `finally` gør knappen brugbar igen efter både succes og fejl.
- Ryd gamle beskeder, når brugeren prøver igen. Brug samme `formStatus` til kort succes eller fejl ved POST.
- Bevar feltværdier ved POST-fejl. Ved DELETE-fejl genrenderes listen ikke.

**Stop og test:** Brug langsomt netværk (DevTools) og gentagne klik. En handling giver ét POST eller DELETE efterfulgt af ét GET. Test offline og et nyt forsøg online.

## Hvis I er foran

Vælg én udvidelse, når grundforløbet virker:

- Tilføj en workshop-select med label, name og required. Udvid API-schema, POST og kort.
- Tilføj et frivilligt spørgsmål i en textarea med maxlength. Render det som tekst.
- Stil kortene i et responsivt grid, eller forbedr afstande og feedback. Bevar læserækkefølge og fokus.
- Forklar forskellen på feltfejl og en request-fejl — skal en netværksfejl gøre e-mailfeltet ugyldigt?

Filer: `index.html` (form og template), `styles.css` (basis + én feedback-TODO),
`script.js` (færdig GET/rendering + TODO 1–5), `api.js` (GET + TODO POST/DELETE),
`sample-entries.json` (valgfri MockAPI-seed).

## Udleveret detalje: view transitions

`transition.js` giver listen en kort krydsfade ligesom i CodePen-eksemplet. `renderEntries()` bruger den allerede. POST og DELETE kalder blot denne funktion igen.
API-kaldet afsluttes før view transition; kun DOM-opdateringen animeres. Efter DELETE afventer du rendering og kalder `list.focus()`.

[MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using).
