# Informativa sul trattamento dei dati personali
### App MiPA Guest Companion — ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679 ("GDPR")

*Bozza — da far validare da un legale/DPO prima della pubblicazione. Vedi nota finale.*

---

## 1. Titolare del trattamento

**[Nome Titolare / Ragione Sociale]**
Sede: [indirizzo struttura, Milazzo (ME)]
Contatto privacy: [email/telefono dedicato]

Il Titolare tratta i dati personali degli ospiti nell'ambito della gestione
della struttura ricettiva e dell'adempimento degli obblighi di legge in
materia di pubblica sicurezza (comunicazione alloggiati).

## 2. Che dati raccogliamo

Attraverso l'app MiPA raccogliamo, per ciascun ospite, i dati presenti sul
documento d'identità e i dati di soggiorno:

- **Dati anagrafici e documento**: nome, cognome, data e luogo di nascita,
  cittadinanza, sesso, tipo/numero del documento, data e luogo di rilascio;
- **Dati di soggiorno**: date di arrivo/partenza, tipologia di alloggio;
- **Immagine del documento** (solo se si sceglie l'estrazione automatica
  OCR — vedi punto 4): la foto viene usata per leggere il testo e non
  viene conservata dall'app dopo l'elaborazione.

Non raccogliamo dati sanitari, biometrici in senso tecnico (non facciamo
riconoscimento facciale) né altre categorie particolari di dati.

## 3. Finalità e base giuridica del trattamento

| Finalità | Base giuridica (art. 6 GDPR) | Note |
|---|---|---|
| Comunicazione dei dati degli alloggiati all'Autorità di Pubblica Sicurezza (Questura), tramite portale "Alloggiati Web" | **Obbligo legale** (art. 6.1.c GDPR), in attuazione dell'art. 109 TULPS (R.D. 773/1931) e del D.M. 7 gennaio 2013 | Obbligatoria per legge: non richiede consenso e non può essere rifiutata dall'ospite |
| Gestione del soggiorno e degli adempimenti connessi al rapporto con l'ospite | **Esecuzione di un contratto** / misure precontrattuali (art. 6.1.b GDPR) | — |
| Estrazione automatica dei dati dal documento tramite servizio OCR di terze parti (Google Cloud Vision) | **Consenso specifico e facoltativo** (art. 6.1.a GDPR) | L'ospite può sempre rifiutare e inserire i dati manualmente: nessuna foto viene scattata o inviata in quel caso (vedi disclaimer in-app) |
| Trasmissione dei dati raccolti alla struttura, in automatico via email o scrittura su Google Sheet | **Obbligo legale** (per la finalità di comunicazione alloggiati) combinato con **legittimo interesse organizzativo** del Titolare a un flusso efficiente (art. 6.1.f GDPR) | In alternativa, l'operatore può scaricare il file e inviarlo manualmente (WhatsApp, email, ecc.), evitando il passaggio automatico — vedi punto 4 |

## 4. Le due modalità operative e cosa comportano

L'app è progettata per lasciare all'operatore/ospite la scelta del livello
di automazione, con effetti diversi sul trattamento dei dati:

**A) Modalità automatica (comodità, meno controllo diretto)**
- La foto del documento è inviata a **Google Cloud Vision** (Google Ireland
  Ltd. / Google LLC) per l'estrazione del testo (OCR). Google tratta
  l'immagine solo per restituire il risultato e, secondo la policy
  dichiarata dal fornitore, non la utilizza per addestrare i propri modelli.
- I dati raccolti possono essere inviati automaticamente:
  - via email, attraverso il servizio **Resend** (invio allegato), oppure
  - tramite scrittura diretta su un **foglio Google Sheets** via Google
    Sheets API.
- Questi passaggi comportano un trasferimento dei dati a fornitori terzi,
  con possibile transito su server situati **fuori dallo Spazio Economico
  Europeo** (Google e Resend hanno infrastrutture anche negli USA). Il
  trasferimento è comunque soggetto alle garanzie previste dal fornitore
  (es. Clausole Contrattuali Standard della Commissione UE) — vedi punto 6.

**B) Modalità manuale (nessun invio automatico a terzi)**
- I dati del documento vengono digitati a mano: **nessuna foto viene
  scattata né inviata a nessun servizio OCR**.
- Una volta raccolti i dati degli ospiti, invece dell'invio automatico si
  può **scaricare il file di esportazione sul dispositivo** e inviarlo
  manualmente con lo strumento preferito (WhatsApp, Telegram, email,
  altra app), mantenendo il controllo diretto su chi riceve il file e
  come.
- Questa modalità riduce al minimo il coinvolgimento di fornitori terzi
  automatizzati nel trattamento, pur restando comunque necessario, a valle,
  adempiere all'obbligo di comunicazione alloggiati alla Questura.

L'app segnala questa scelta all'utente prima di procedere (vedi il
disclaimer già presente nell'interfaccia, sezione OCR/invio dati), così
che la decisione su quale modalità usare sia sempre esplicita e
consapevole.

## 5. Destinatari e responsabili del trattamento

I dati possono essere comunicati, per le finalità sopra descritte, a:

- **Questura/Autorità di Pubblica Sicurezza** competente (obbligo di legge);
- **Google** (Google Cloud Vision per l'OCR facoltativo; Google Sheets/
  Workspace se usato come registro) — in qualità di responsabile del
  trattamento o titolare autonomo per i propri servizi, a seconda del
  servizio Google utilizzato;
- **Resend** (invio email transazionali) — responsabile del trattamento;
- **Netlify** (hosting del sito e delle funzioni serverless che
  processano temporaneamente i dati in transito) — responsabile del
  trattamento;
- eventuale personale autorizzato del Titolare (reception, gestione).

Non vendiamo né cediamo dati a terzi per finalità di marketing.

## 6. Trasferimento dati extra-UE

Alcuni fornitori (Google, Resend, Netlify) possono trattare dati su
server situati negli Stati Uniti o comunque fuori dallo SEE. In tal caso
il trasferimento avviene sulla base delle garanzie previste dal Capo V
del GDPR (es. Clausole Contrattuali Standard, framework di adeguatezza
laddove applicabili). *(Punto da verificare/aggiornare con un legale in
base ai DPA effettivamente sottoscritti con i singoli fornitori.)*

## 7. Periodo di conservazione

I dati raccolti tramite l'app sono conservati sul dispositivo/registro
della struttura per il tempo necessario ad adempiere agli obblighi di
comunicazione alloggiati e agli obblighi fiscali/amministrativi connessi
al soggiorno, e comunque nei termini previsti dalla normativa applicabile
in materia di pubblica sicurezza e conservazione documentale. *(Termine
esatto da definire col Titolare — tipicamente si fa riferimento ai
termini previsti dalla normativa di pubblica sicurezza e a quella fiscale
generale.)*

## 8. Diritti dell'interessato

In qualità di interessato, l'ospite può in qualsiasi momento esercitare i
diritti previsti dagli artt. 15-22 GDPR: accesso ai dati, rettifica,
cancellazione (ove applicabile, compatibilmente con gli obblighi di
legge), limitazione del trattamento, portabilità, opposizione, nonché
proporre reclamo al **Garante per la protezione dei dati personali**
(www.garanteprivacy.it).

Per esercitare questi diritti: [contatto email/telefono del Titolare].

## 9. Facoltatività del conferimento

Il conferimento dei dati necessari alla comunicazione alloggiati è
**obbligatorio per legge**: il rifiuto non consente di ospitare la
persona presso la struttura. È invece **facoltativo** l'utilizzo della
funzione OCR e dell'invio automatico dei dati: l'ospite/operatore può
sempre scegliere la modalità manuale descritta al punto 4.B senza alcuna
conseguenza sulla fruizione del soggiorno.

---

### Nota per chi implementa questo documento

Non sono un avvocato e questo non è un parere legale: è un **modello di
partenza** pensato per riflettere accuratamente cosa fa davvero l'app
(basandomi sul codice: OCR via Google Vision, invio via Resend, scrittura
su Google Sheets, download manuale come alternativa). Prima di
pubblicarla, consiglio di far verificare da un legale o consulente
privacy, in particolare:

- i **termini di conservazione dati** esatti (che per gli obblighi TULPS
  hanno regole specifiche e vanno confermati);
- se serve un **registro dei trattamenti** e una valutazione d'impatto
  (DPIA), dato che si trattano dati da documento d'identità in modo
  sistematico;
- la verifica dei **Data Processing Agreement (DPA)** effettivamente
  firmati con Google, Resend e Netlify, per completare correttamente la
  sezione sul trasferimento extra-UE;
- se il Titolare debba nominare un **DPO** (di norma non obbligatorio per
  una singola struttura ricettiva di piccole dimensioni, ma va valutato
  caso per caso).
