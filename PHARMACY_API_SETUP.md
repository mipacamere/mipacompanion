# Attivare il widget "Farmacie di turno" — tutto da browser

La sezione **Farmacie di turno** ora mostra un elenco live (nome, indirizzo,
telefono, stato "aperta"/"di turno") caricato ogni volta che l'ospite apre la
pagina, tramite una **Netlify Function** (`netlify/functions/pharmacy-proxy.mjs`)
che fa da intermediario verso `api.farmaciediturno.org`. La API key resta sul
server di Netlify, non è mai visibile nel codice del sito — stesso identico
schema già usato per l'OCR (vedi `NETLIFY_OCR_SETUP.md`).

Finché non completi questo setup, la sezione mostra un messaggio di errore
gentile e il pulsante "Vedi farmacie di turno" (che apre il sito in una nuova
scheda) resta comunque disponibile come alternativa.

## 1. Richiedere la API key (una tantum, gratuita)

`api.farmaciediturno.org` richiede una key nominale, non è self-service:

1. Scrivi una email a **info@farmaciediturno.org**.
2. Indica: il tuo nome/ragione sociale, e l'uso che ne farai (es. "widget
   informativo per gli ospiti di un B&B a Milazzo, sola consultazione, nessuna
   rivendita dei dati").
3. Ti risponderanno con una key personale. Tempistiche non garantite dal
   servizio (è gratuito), ma in genere rispondono in pochi giorni lavorativi.

## 2. Pubblicare la funzione su Netlify

Nessun comando da terminale: la funzione è già dentro il progetto
(`netlify/functions/pharmacy-proxy.mjs`). Basta un nuovo deploy del sito,
con lo stesso metodo che usi già per aggiornare MiPA.

## 3. Impostare le variabili segrete (da browser)

1. Vai su https://app.netlify.com, apri il tuo sito.
2. **Site configuration → Environment variables → Add a variable**.
3. Aggiungi:
   - `FARMACIEDITURNO_API_KEY` → la key ricevuta via email al punto 1
   - `APP_SHARED_TOKEN` → **la stessa identica stringa** già usata per l'OCR
     (se non l'hai già impostata per l'OCR, va bene qualsiasi stringa a caso,
     es. `mipa2026xk93` — ma deve combaciare con `OCR_APP_TOKEN` in `app.js`,
     riusato anche per questa chiamata)
   - `ALLOWED_ORIGIN` → l'URL del tuo sito (se non già impostata)
4. Salva, poi fai un nuovo deploy (le variabili si applicano dal deploy
   successivo).

## 4. Il comune è già impostato

La funzione interroga il comune di Milazzo (codice ISTAT `083049`) — non
serve configurare nulla lato frontend. Se in futuro vorrai cambiare comune,
modifica il parametro `cod=83049` in `netlify/functions/pharmacy-proxy.mjs`.

## Verifica

Dopo il deploy, apri `https://tuosito.netlify.app/api/pharmacy-proxy` da
browser: se hai impostato `APP_SHARED_TOKEN`, vedrai "Unauthorized" (è
normale, la richiesta dal browser non include il token) — significa che la
funzione è stata pubblicata correttamente. La verifica vera è aprire la
sezione "Farmacie di turno" nell'app e controllare che compaia l'elenco.

## Se il widget non si carica: checklist di diagnosi

1. **Estensione del file**: deve chiamarsi `pharmacy-proxy.mjs` (non `.js`),
   per lo stesso motivo spiegato in `NETLIFY_OCR_SETUP.md`.
2. **Pannello Netlify → Functions**: dovresti vedere `pharmacy-proxy`
   nell'elenco insieme a `ocr-proxy`.
3. **Logs della function**: pannello Netlify → Functions → pharmacy-proxy →
   scheda **Logs**. Qui trovi l'errore esatto (key mancante, key non valida,
   servizio a monte irraggiungibile).
4. **Variabili d'ambiente**: deve esserci `FARMACIEDITURNO_API_KEY` con scope
   "Functions", impostata DOPO l'ultimo deploy fatto (altrimenti non si applica).
5. **Formato risposta**: se l'elenco appare vuoto ma la function risponde
   200 OK, l'API a monte potrebbe restituire i campi con nomi leggermente
   diversi da quelli previsti — apri i Logs e confronta con la mappatura in
   `pharmacy-proxy.mjs` (funzione che normalizza `nome/name/ragionesociale`
   ecc.: aggiungi lì il nome campo mancante).
6. **Nell'app**, se il fetch fallisce, la sezione mostra comunque un messaggio
   di errore invece di restare bloccata sul caricamento — ma il pulsante
   "Vedi farmacie di turno" funziona sempre, indipendentemente da questo setup.
