/**
 * MiPA Guest Data → Google Sheets — Netlify Function
 * ----------------------------------------------------
 * Riceve il JSON con i dati degli ospiti dal frontend e aggiunge una riga per
 * ciascuno nel Google Sheet condiviso, usando un account di servizio Google
 * (autenticazione JWT firmata a mano, nessuna libreria esterna necessaria).
 *
 * Raggiungibile su: https://tuosito.netlify.app/api/append-guest-sheet
 *
 * Colonne attese nel foglio (in quest'ordine, verificato contro il foglio reale in uso):
 * struttura_id | tipo_alloggiato | data_arrivo | data_partenza | cognome | nome | sesso |
 * data_nascita | luogo_nascita | cittadinanza | tipo_documento | numero_documento |
 * luogo_rilascio | data_scansione
 */
export default async (request) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-App-Token',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const expectedToken = process.env.APP_SHARED_TOKEN;
  if (expectedToken) {
    const token = request.headers.get('X-App-Token');
    if (token !== expectedToken) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  const exportData = body.exportData;
  if (!exportData || !Array.isArray(exportData.guests) || exportData.guests.length === 0) {
    return new Response('Missing or empty exportData', { status: 400, headers: corsHeaders });
  }

  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
  const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';
  const SA_EMAIL = process.env.GOOGLE_SA_EMAIL;
  const SA_PRIVATE_KEY = normalizePrivateKey(process.env.GOOGLE_SA_PRIVATE_KEY);

  if (!SPREADSHEET_ID || !SA_EMAIL || !SA_PRIVATE_KEY) {
    return new Response(JSON.stringify({ error: 'Google Sheets non configurato sul server (variabili mancanti)' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!SA_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
    return new Response(JSON.stringify({
      error: 'GOOGLE_SA_PRIVATE_KEY non è in formato PEM valido',
      detail: 'Manca l\'intestazione "-----BEGIN PRIVATE KEY-----": controlla di aver incollato il valore del campo private_key del file JSON per intero, comprese le righe BEGIN/END.',
    }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let accessToken;
  try {
    accessToken = await getGoogleAccessToken(SA_EMAIL, SA_PRIVATE_KEY);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Autenticazione Google fallita', detail: String((e && e.message) || e) }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const scanTimestamp = formatTimestamp(new Date());
  const rows = exportData.guests.map(g => ([
    (exportData.structure && exportData.structure.code) || '',
    (g.stay && g.stay.guestType) || '',
    (g.stay && g.stay.arrivalDate) || '',
    (g.stay && g.stay.departureDate) || '',
    (g.personal && g.personal.lastName) || '',
    (g.personal && g.personal.firstName) || '',
    (g.personal && g.personal.gender) || '',
    (g.personal && g.personal.birthDate) || '',
    joinBirthPlace(g.personal),
    (g.personal && g.personal.nationality) || '',
    (g.document && g.document.type) || '',
    (g.document && g.document.number) || '',
    (g.document && g.document.issuePlace) || '',
    scanTimestamp,
  ]));

  const range = encodeURIComponent(SHEET_NAME + '!A1');
  let sheetsRes;
  try {
    sheetsRes = await fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + range
        + ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS',
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows }),
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Google Sheets non raggiungibile' }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!sheetsRes.ok) {
    const detail = await sheetsRes.text();
    return new Response(JSON.stringify({ error: 'Scrittura su Google Sheets fallita', detail }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, rowsAdded: rows.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

// Il foglio ha una sola colonna "luogo_nascita": uniamo comune, provincia (se presente)
// e stato di nascita in un unico testo leggibile, es. "GELA (ME), ITALIA" oppure,
// per un nato all'estero senza comune/provincia, semplicemente "FRANCIA".
function joinBirthPlace(personal) {
  if (!personal) return '';
  const place = (personal.birthPlace || '').trim();
  const province = (personal.birthProvince || '').trim();
  const country = (personal.birthCountry || '').trim();
  const placeWithProvince = province ? place + ' (' + province + ')' : place;
  if (placeWithProvince && country) return placeWithProvince + ', ' + country;
  return placeWithProvince || country || '';
}

// La chiave privata, incollata in una variabile d'ambiente, può arrivare in formati
// leggermente diversi a seconda di come Netlify la conserva: a volte gli "a capo" restano
// come testo letterale "\n" (o perfino "\\n" doppio), a volte il valore include virgolette
// che lo avvolgono per intero. Qui normalizziamo tutti i casi noti prima di usarla.
function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  return key.trim();
}

function formatTimestamp(d) {
  const pad = n => String(n).padStart(2, '0');
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

// Autenticazione account di servizio Google: firma un JWT con la chiave privata (RS256)
// e lo scambia per un access token OAuth2. Nessuna libreria esterna: solo Node crypto/fetch.
async function getGoogleAccessToken(clientEmail, privateKey) {
  const crypto = await import('node:crypto');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const base64url = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = base64url(header) + '.' + base64url(claimSet);

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey).toString('base64url');
  const jwt = unsigned + '.' + signature;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!tokenRes.ok) throw new Error('Token exchange failed: ' + (await tokenRes.text()));
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export const config = { path: '/api/append-guest-sheet' };
