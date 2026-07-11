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

Nell'ordine, per ogni ospite (aggiornato secondo il tracciato ufficiale Alloggiati Web,
vedi manuale PDF del Servizio Alloggiati — sezione "File tracciato record"):

| Colonna | Origine dato |
|---|---|
| `id_documento` | identificativo interno generato dall'app per quell'ospite |
| `struttura_id` | `ME006995` (fisso, configurato in `app.js`) |
| `cognome` | dati anagrafici |
| `nome` | dati anagrafici |
| `sesso` | dati anagrafici |
| `data_nascita` | dati anagrafici |
| `comune_nascita` | comune di nascita (solo se nato in Italia) |
| `provincia_nascita` | sigla provincia di nascita — targhe automobilistiche, Roma = RM (solo se nato in Italia) |
| `stato_nascita` | stato di nascita (sempre valorizzato, anche per chi nasce in Italia) |
| `cittadinanza` | dalla tabella Stati |
| `tipo_documento` | dalla tabella Documenti |
| `numero_documento` | dal documento |
| `data_rilascio` | dal documento |
| `luogo_rilascio` | dal documento |
| `data_arrivo` | dal soggiorno |
| `data_partenza` | dal soggiorno |
| `tipo_alloggiato` | dal soggiorno |
| `data_scansione` | data e ora dell'invio (generata automaticamente al momento dell'invio) |

**Importante**: rispetto alla versione precedente di questa guida, la colonna
`luogo_nascita` (comune + stato uniti in un solo testo) è stata **sostituita da tre
colonne separate**: `comune_nascita`, `provincia_nascita`, `stato_nascita` — esattamente
come richiede il tracciato ufficiale, che li tratta come tre campi distinti (il comune
e la provincia sono obbligatori solo se lo stato di nascita è l'Italia). Se il tuo foglio
ha ancora la vecchia colonna unica `luogo_nascita`, va aggiornato aggiungendo le due
colonne mancanti (`provincia_nascita` e `stato_nascita`) e rinominando `luogo_nascita`
in `comune_nascita`, mantenendo questo esatto ordine.

## Verifica

Dopo il deploy, prova ad aggiungere un ospite di prova nell'app e premi "Invia
automaticamente (Google Sheet)": dovresti vedere comparire una nuova riga nel foglio
in pochi secondi. Se qualcosa non va, il pulsante "Dettagli tecnici" nella schermata
mostra l'errore esatto restituito da Google.
