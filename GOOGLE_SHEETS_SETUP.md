# Attivare la scrittura automatica su Google Sheets — tutto da browser

Il progetto include una Netlify Function (`netlify/functions/append-guest-sheet.mjs`)
che scrive automaticamente una riga per ogni ospite nel tuo Google Sheet, usando
l'account di servizio che hai già creato. Nessun invio manuale, nessun allegato.

## 1. Condividi il foglio con l'account di servizio (se non l'hai già fatto)

Apri il tuo Google Sheet, tasto **Condividi**, e aggiungi come **Editor** questo indirizzo:

```
alloggiati-sheets-writer@portale-alloggiati-sheets.iam.gserviceaccount.com
```

Senza questo passaggio la scrittura fallirà con un errore di permessi, anche se le
credenziali sono corrette.

## 2. Imposta le variabili su Netlify

Pannello Netlify → il tuo sito → **Site configuration → Environment variables**,
aggiungi:

- `GOOGLE_SHEET_ID` → `1oEk6HSN6N4fSN2qNZ9qT_WGE1kmlUVgT1Sth_z2VfAY`
  (l'ID è già estratto dal link che mi hai mandato)
- `GOOGLE_SHEET_NAME` → `Sheet1`
- `GOOGLE_SA_EMAIL` → `alloggiati-sheets-writer@portale-alloggiati-sheets.iam.gserviceaccount.com`
- `GOOGLE_SA_PRIVATE_KEY` → il valore del campo `private_key` dal file JSON che hai
  scaricato da Google Cloud (quello che inizia con `-----BEGIN PRIVATE KEY-----`).
  **Incollalo così com'è**, comprese le sequenze `\n`: la funzione le converte da sola
  in vere andate a capo. Non serve nessuna modifica manuale al testo.
- `APP_SHARED_TOKEN` → deve già esistere da quando hai configurato l'OCR; questa
  function la riusa per lo stesso motivo (evitare che qualcun altro scriva sul tuo foglio)

Dopo averle salvate, rifai un deploy del sito (le variabili si applicano dal deploy
successivo).

## Colonne scritte nel foglio

Nell'ordine reale del tuo foglio, per ogni ospite:

| Colonna | Origine dato |
|---|---|
| `struttura_id` | `ME006995` (fisso, configurato in `app.js`) |
| `tipo_alloggiato` | dal soggiorno |
| `data_arrivo` | dal soggiorno |
| `data_partenza` | dal soggiorno |
| `cognome` | dati anagrafici |
| `nome` | dati anagrafici |
| `sesso` | dati anagrafici |
| `data_nascita` | dati anagrafici |
| `luogo_nascita` | comune **+** provincia **+** stato di nascita uniti in un solo testo, es. `GELA (ME), ITALIA` |
| `cittadinanza` | dalla tabella Stati |
| `tipo_documento` | dalla tabella Documenti |
| `numero_documento` | dal documento |
| `luogo_rilascio` | dal documento |
| `data_scansione` | data e ora dell'invio (generata automaticamente al momento dell'invio) |

**Nota**: l'app raccoglie internamente comune, provincia e stato di nascita come tre dati
distinti (per rispettare il tracciato ufficiale Alloggiati Web), ma per scriverli nel tuo
foglio — che ha un'unica colonna `luogo_nascita` — vengono uniti in un solo testo. Anche
`data_rilascio` (data di rilascio del documento) e `id_documento` non vengono scritti,
perché il tuo foglio non ha queste colonne. Se in futuro vuoi recuperare questi dati
separatamente, basta aggiungere le colonne corrispondenti e dirmelo: aggiorno la function
di conseguenza.

## Verifica

Dopo il deploy, prova ad aggiungere un ospite di prova nell'app e premi "Invia
automaticamente (Google Sheet)": dovresti vedere comparire una nuova riga nel foglio
in pochi secondi. Se qualcosa non va, il pulsante "Dettagli tecnici" nella schermata
mostra l'errore esatto restituito da Google.
