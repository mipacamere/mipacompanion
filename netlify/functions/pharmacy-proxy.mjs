/*
 * Copyright (c) 2026 [Nome Titolare / Ragione Sociale]. Tutti i diritti riservati.
 * Codice sorgente proprietario — vedi il file LICENSE nella root del progetto.
 */

/**
 * MiPA Pharmacy Proxy — Netlify Function
 * -----------------------------------
 * Interroga api.farmaciediturno.org per le farmacie aperte/di turno a Milazzo
 * in questo momento, tenendo la API key SOLO lato server, e restituisce
 * un JSON già pulito e pronto per il widget in home.
 *
 * Setup richiesto: vedi PHARMACY_API_SETUP.md nella root del progetto.
 * Raggiungibile su: https://tuosito.netlify.app/api/pharmacy-proxy
 */
export default async (request) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-App-Token',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const expectedToken = process.env.APP_SHARED_TOKEN;
  if (expectedToken) {
    const token = request.headers.get('X-App-Token');
    if (token !== expectedToken) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
  }

  const apiKey = process.env.FARMACIEDITURNO_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'FARMACIEDITURNO_API_KEY non configurata su Netlify' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // cod=83049 è il codice ISTAT del comune di Milazzo (ME).
  const url = 'https://api.farmaciediturno.org/aperteturno.asp'
    + '?key=' + encodeURIComponent(apiKey)
    + '&cod=83049'
    + '&output=json';

  let apiRes;
  try {
    apiRes = await fetch(url);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Servizio farmacie non raggiungibile' }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!apiRes.ok) {
    const detail = await apiRes.text();
    return new Response(JSON.stringify({ error: 'Errore dal servizio farmacie', detail }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let raw;
  try {
    raw = await apiRes.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Risposta non valida dal servizio farmacie' }), {
      status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Normalizziamo la risposta in una forma stabile e minimale per il frontend,
  // così se il formato dell'API a monte cambia leggermente dobbiamo toccare
  // solo questa funzione, non l'app.
  const list = Array.isArray(raw) ? raw : (raw.farmacie || raw.result || []);
  const pharmacies = list.slice(0, 8).map(p => ({
    name: p.nome || p.name || p.ragionesociale || '',
    address: p.indirizzo || p.address || '',
    phone: p.telefono || p.phone || '',
    status: p.stato || p.status || (p.aperta ? 'APERTA' : 'TURNO'),
    hours: p.orario || p.orari || p.hours || '',
    distanceKm: p.distanza != null ? Number(p.distanza) : (p.distance != null ? Number(p.distance) : null),
  }));

  return new Response(JSON.stringify({
    pharmacies,
    updatedAt: new Date().toISOString(),
    disclaimer: 'Orari e turni sono soggetti a variazioni: verificare la bacheca esposta fuori dalla farmacia. Dati forniti da farmaciediturno.org.',
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/pharmacy-proxy' };
