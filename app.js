/* ═══════════════════════════════════════════
   MiPA Guest Companion — Vanilla JS
   No external dependencies
═══════════════════════════════════════════ */

// ── State ──────────────────────────────────
const state = {
  page: 'home',
  section: 'info',
  lang: localStorage.getItem('mipa_lang') || 'en',
  isOnline: navigator.onLine,
  images: JSON.parse(localStorage.getItem('mipa_images') || '[]'),
  docsSent: JSON.parse(localStorage.getItem('mipa_docssent') || 'false'),
  showPast: false,
  installPrompt: null,
  installDismissed: false,
  showIOSHint: false,
};

// ── Translations ────────────────────────────
const allT = {
  en: {
    back: 'Back', openMaps: 'Open in Maps', bookWa: 'Book via WhatsApp',
    offline: 'You are offline — some content may not load.',
    install: { title: 'Install MiPA App', sub: 'Add to your home screen for quick access', btn: 'Install', dismiss: 'Dismiss', iosStep1: '1. Tap the Share button in Safari (□↑)', iosStep2: '2. Scroll down and tap "Add to Home Screen"' },
    tabs: { info:'Structure Info', philosophy:'Our Philosophy', contacts:'Contacts', directions:'Getting Around', map:'Interactive Map', breakfast:'Daily Itinerary', bookServices:'Book Services', events:'City Events', museums:'Museums & Monuments', beach:'Take Me to the Beach', roomGuide:'Back to My Room', checkout:'Check Out' },
    home: { greeting:'Welcome to MiPA 🌿', sub:'Your digital concierge in Milazzo', checkinNew:'I need to check in', checkinNewDesc:'Upload your ID documents', checkinDone:'I already checked in', checkinDoneDesc:'Go directly to the app' },
    dash: { welcome:'MiPA Companion', sub:'What can we help you with?' },
    upload: { title:'Upload your ID documents', dropText:'Tap to add photos', dropSub:'Passport, ID card or driving licence', remove:'Remove', sendWa:'Send via WhatsApp', continue:'Continue to property info', sent:'Documents sent ✓' },
    info: { general:'General Info', contacts:'Contacts', address:'Address', phone:'Phone', whatsapp:'Chat on WhatsApp', checkin:'3:00 PM – 10:00 PM', checkout:'By 10:30 AM', wifiConnect:'Connect to WiFi' },
    itinerary: { desc:'Discover the best of the city with this carefully planned itinerary. Explore must-see attractions and enjoy local experiences.', btn:'Explore Milazzo' },
    map: { title:'Milazzo Interactive Map', desc:'Highlights, landmarks and hidden gems.', openMaps:'Open in Google Maps' },
    beach: { desc:'Navigate directly to the nearest beach — crystal-clear Tyrrhenian waters await.', btnTitle:'Take me to the beach', btnSub:'Opens Google Maps · Navigation' },
    room: { desc:'Let us guide you back to MiPA.', btnTitle:'Navigate to MiPA', btnSub:'Opens Google Maps · Turn-by-turn' },
    co: { desc1:'Thank you for staying with us! Before you leave, please:', steps:['Leave all keys inside the room.','Gather all personal belongings, including chargers and electronics.','Check the room for any items left behind.','Settle any outstanding payments including the city tax.'], note:'If you forget anything, we offer a mail-back service (charges apply).', desc2:'Once ready, tap the button below to notify us. Thank you!', btn:'Complete Check-Out' },
    events: { desc:'Events in Milazzo and surroundings — updated regularly.', showPast:'Show past events', hidePast:'Hide past events', noUpcoming:'No upcoming events. Check back soon!' },
    philosophy: ['To welcome without leaving a trace: that is where everything begins. In the heart of Milazzo, where the rhythm of the city meets the sea, we imagined a space capable of blending naturally and discreetly into the urban fabric, offering a comfortable and authentic stay.','All our rooms — junior suites — are crafted down to the last detail: natural light, soundproofing, efficient systems that minimise waste. Generous, balanced spaces designed for genuine, deep well-being, built on quality and harmony.','Sustainability is a concrete choice, lived every day with real commitment. We have eliminated single-use plastic and disposable paper, provide free drinking water and use only energy from renewable sources. In this way, we contribute to a truly responsible hospitality.','Being in the centre means discovering the city authentically. We are working to promote soft mobility such as cycling, with dedicated itineraries and maps to help you navigate easily and reduce your environmental footprint.','We believe in a hospitality where responsibility and comfort merge without compromise. We have already thought of everything: guests do not need to do anything differently or adopt any particular eco-conscious behaviour. They can simply relax and enjoy their holiday, while we act discreetly to minimise our impact. What remains is the memory of a light, authentic and mindful journey — with a minimal footprint on the environment and a positive mark within oneself.'],
    dir: {
      arriving: 'Arriving', leaving: 'Leaving Milazzo',
      arrivalModes: [
        { icon:'directions_car', color:'#4f7d65', title:'By Car', desc:'Exit the motorway at the Milazzo toll booth and follow Viale Sicilia (main road) to the last available exit. Park at Piazza XXV Aprile (near the property) or nearby blue-line spaces — pay with the EasyPark app.' },
        { icon:'train', color:'#0284c7', title:'By Train', desc:'Get off at Milazzo station and take bus lines 4 or 5 to the port stop, the closest stop to the property.' },
        { icon:'directions_bus', color:'#d97706', title:'By Bus', desc:'From Catania airport or other locations, get off at the port stop — the closest to MiPA.' }
      ],
      departureModes: [
        { icon:'directions_car', color:'#4f7d65', title:'By Car', desc:'Follow Viale Sicilia to the end, then take the Milazzo junction to enter the A20 motorway toward Messina (Catania) or Palermo.' },
        { icon:'directions_bus', color:'#d97706', title:'By Bus to Messina', desc:'Check schedules for GiuntaBus and AST (Azienda Siciliana Trasporti) for daily connections to Messina.' },
        { icon:'train', color:'#0284c7', title:'By Train', desc:'Take bus lines 4 or 5 from the port stop to Milazzo train station.' },
        { icon:'flight', color:'#7c3aed', title:'To Catania Airport', desc:'Direct bus connections from Milazzo to Catania airport — check schedules at the port stop.' }
      ]
    },
    monuments: [
      { emoji:'🏰', title:'Castello di Milazzo', dist:'10 min walk', desc:'A UNESCO-candidate fortress offering panoramic views over the Tyrrhenian Sea and the Aeolian Islands. The castle dates back to the Norman era.', link:'https://maps.app.goo.gl/castle' },
      { emoji:'⛪', title:'Duomo Antico', dist:'8 min walk', desc:'The ancient Cathedral of Milazzo, a Baroque masterpiece in the heart of the historic centre. Free entry.', link:'https://maps.app.goo.gl/duomo' },
      { emoji:'🏛️', title:'Borgo Antico', dist:'10 min walk', desc:'The historic old town of Milazzo, a labyrinth of narrow streets, viewpoints and traditional architecture.', link:'https://maps.app.goo.gl/borgo' },
      { emoji:'🌊', title:'Riserva Naturale Capo Milazzo', dist:'20 min bike', desc:'A stunning nature reserve at the tip of the Milazzo promontory. Swimming, snorkelling and dramatic sea views.', link:'https://maps.app.goo.gl/capo' }
    ],
    services: [
      { emoji:'🚲', title:'Bike Rental', price:'From €10 / day', note:'Explore Milazzo on two wheels — city bikes and e-bikes available.', waText:'Hello, I would like to book a bike rental.' },
      { emoji:'🤿', title:'Scuba Diving', price:'From €60 / person', note:'Book 24h in advance. Crystal-clear waters of the Tyrrhenian await.', waText:'Hello, I would like to book a scuba diving experience.' },
      { emoji:'⛵', title:'Aeolian Islands Tour (2-3 islands)', price:'From €40 / person', note:'Book with Navisal or Tarnav. Day trips to Lipari, Stromboli, Vulcano and more.', waText:'Hello, I would like information about the Aeolian Islands tour.' },
      { emoji:'🛥️', title:'Private Aeolian Islands Tour', price:'From €100 / person', note:'Exclusive private boat tour. Customisable itinerary.', waText:'Hello, I would like to book a private Aeolian Islands tour.' }
    ]
  },
  it: {
    back: 'Indietro', openMaps: 'Apri in Maps', bookWa: 'Prenota via WhatsApp',
    offline: 'Sei offline — alcuni contenuti potrebbero non caricarsi.',
    install: { title: 'Installa app MiPA', sub: 'Aggiungila alla schermata home', btn: 'Installa', dismiss: 'Ignora', iosStep1: '1. Tocca il pulsante Condividi in Safari (□↑)', iosStep2: '2. Scorri e tocca "Aggiungi alla schermata Home"' },
    tabs: { info:'Info Struttura', philosophy:'La Nostra Filosofia', contacts:'Contatti', directions:'Raggiungere/Lasciare Milazzo', map:'Mappa Interattiva', breakfast:'Itinerario Giornaliero', bookServices:'Prenota Servizi', events:'Eventi in Città', museums:'Musei e Monumenti', beach:'Portami alla Spiaggia', roomGuide:'Riportami alla Camera', checkout:'Check-Out' },
    home: { greeting:'Benvenuto a MiPA 🌿', sub:'Il tuo concierge digitale a Milazzo', checkinNew:'Devo fare il check-in', checkinNewDesc:"Carica i tuoi documenti d'identità", checkinDone:'Ho già fatto il check-in', checkinDoneDesc:"Vai direttamente all'app" },
    dash: { welcome:'MiPA Companion', sub:'Come possiamo aiutarti?' },
    upload: { title:"Carica i tuoi documenti d'identità", dropText:'Tocca per aggiungere foto', dropSub:"Passaporto, carta d'identità o patente", remove:'Rimuovi', sendWa:'Invia via WhatsApp', continue:'Continua alle info sulla struttura', sent:'Documenti inviati ✓' },
    info: { general:'Informazioni Generali', contacts:'Contatti', address:'Indirizzo', phone:'Telefono', whatsapp:'Chatta su WhatsApp', checkin:'15:00 – 22:00', checkout:'Entro le 10:30', wifiConnect:'Connetti al WiFi' },
    itinerary: { desc:'Scopri il meglio della città con questo itinerario giornaliero ben pianificato.', btn:'Esplora Milazzo' },
    map: { title:'Mappa Interattiva di Milazzo', desc:'Attrazioni, monumenti e gemme nascoste.', openMaps:'Apri in Google Maps' },
    beach: { desc:'Naviga direttamente alla spiaggia più vicina — acque cristalline del Tirreno ti aspettano.', btnTitle:'Portami alla spiaggia', btnSub:'Apre Google Maps · Navigazione' },
    room: { desc:'Lasciati guidare verso MiPA.', btnTitle:'Naviga verso MiPA', btnSub:'Apre Google Maps · Indicazioni' },
    co: { desc1:'Grazie per aver soggiornato da noi! Prima di partire, ti preghiamo di:', steps:['Lascia tutte le chiavi nella camera.','Raccogli tutti i tuoi oggetti personali, compresi caricabatterie ed elettroniche.','Controlla accuratamente la camera per eventuali oggetti dimenticati.','Regola tutti i pagamenti in sospeso, inclusa la tassa di soggiorno.'], note:'Se dimentichi qualcosa, offriamo un servizio di rispedizione (con costi aggiuntivi).', desc2:'Una volta pronto, tocca il pulsante qui sotto per avvisarci. Grazie!', btn:'Completa Check-Out' },
    events: { desc:'Prossimi eventi a Milazzo e dintorni — aggiornati regolarmente.', showPast:'Mostra eventi precedenti', hidePast:'Nascondi eventi precedenti', noUpcoming:'Nessun evento in programma. Ricontrolla presto!' },
    philosophy: ["Accogliere senza lasciare traccia: da qui nasce tutto. Nel cuore di Milazzo, dove il ritmo della città incontra il mare, abbiamo immaginato uno spazio capace di integrarsi in modo naturale e discreto nel contesto urbano, offrendo un'esperienza di soggiorno confortevole e autentica.",'Tutte le nostre camere, junior suite, sono curate nei minimi dettagli: luce naturale, insonorizzazione, impianti efficienti che riducono gli sprechi. Spazi ampi ed equilibrati, pensati per un benessere autentico e profondo, fatto di qualità e armonia.',"La sostenibilità è una scelta concreta, vissuta ogni giorno con impegno reale. Abbiamo eliminato plastica monouso e carta usa e getta, offriamo acqua potabile gratuita e usiamo solo energia da fonti rinnovabili. Così, contribuiamo a un'ospitalità veramente responsabile.","Essere in centro significa scoprire la città in modo autentico. Stiamo lavorando per promuovere la mobilità dolce come la bicicletta, con itinerari e mappe dedicate per orientarsi facilmente e ridurre l'impatto ambientale.","Crediamo in un'ospitalità dove responsabilità e comfort si fondono senza compromessi. Abbiamo già pensato a tutto: l'ospite non deve fare nulla di diverso, né adottare atteggiamenti responsabili. Può semplicemente rilassarsi e godersi la vacanza, mentre noi agiamo in modo discreto per minimizzare l'impatto. Quello che resta è il ricordo di un viaggio leggero, autentico e consapevole — con un'impronta minima sull'ambiente e un segno positivo dentro di sé."],
    dir: {
      arriving: 'Arrivare', leaving: 'Lasciare Milazzo',
      arrivalModes: [
        { icon:'directions_car', color:'#4f7d65', title:'In Auto', desc:"Esci dall'autostrada al casello di Milazzo e segui il Viale Sicilia fino all'ultima uscita. Parcheggia in Piazza XXV Aprile o nelle vicinanze (strisce blu — usa l'app EasyPark)." },
        { icon:'train', color:'#0284c7', title:'In Treno', desc:'Scendi alla stazione di Milazzo e prendi le linee 4 o 5 fino alla fermata del porto, la più vicina alla struttura.' },
        { icon:'directions_bus', color:'#d97706', title:'In Autobus', desc:"Dall'aeroporto di Catania o altre località, scendi alla fermata del porto — la più vicina a MiPA." }
      ],
      departureModes: [
        { icon:'directions_car', color:'#4f7d65', title:'In Auto', desc:"Segui il Viale Sicilia fino alla fine, poi prendi lo svincolo di Milazzo per l'A20 direzione Messina (Catania) o Palermo." },
        { icon:'directions_bus', color:'#d97706', title:'In Autobus (verso Messina)', desc:'Consulta gli orari di GiuntaBus e AST (Azienda Siciliana Trasporti) per le corse giornaliere verso Messina.' },
        { icon:'train', color:'#0284c7', title:'In Treno', desc:'Prendi le linee 4 o 5 dalla fermata del porto fino alla stazione ferroviaria di Milazzo.' },
        { icon:'flight', color:'#7c3aed', title:'Aeroporto di Catania', desc:"Collegamento diretto da Milazzo all'aeroporto di Catania — controlla gli orari alla fermata del porto." }
      ]
    },
    monuments: [
      { emoji:'🏰', title:'Castello di Milazzo', dist:'10 min a piedi', desc:"Fortezza candidata all'UNESCO con vista panoramica sul Tirreno e sulle Isole Eolie. Risale all'epoca normanna.", link:'https://maps.app.goo.gl/castle' },
      { emoji:'⛪', title:'Duomo Antico', dist:'8 min a piedi', desc:"L'antico Duomo di Milazzo, capolavoro barocco nel cuore del centro storico. Ingresso libero.", link:'https://maps.app.goo.gl/duomo' },
      { emoji:'🏛️', title:'Borgo Antico', dist:'10 min a piedi', desc:'Il centro storico di Milazzo, un labirinto di vicoli, belvedere e architettura tradizionale.', link:'https://maps.app.goo.gl/borgo' },
      { emoji:'🌊', title:'Riserva Naturale Capo Milazzo', dist:'20 min in bici', desc:'Una splendida riserva naturale alla punta del promontorio di Milazzo. Nuoto, snorkeling e viste mozzafiato.', link:'https://maps.app.goo.gl/capo' }
    ],
    services: [
      { emoji:'🚲', title:'Noleggio Biciclette', price:'Da €10 / giorno', note:'Esplora Milazzo in bici — city bike ed e-bike disponibili.', waText:'Ciao, vorrei noleggiare una bicicletta.' },
      { emoji:'🤿', title:'Immersioni Subacquee', price:'Da €60 / persona', note:"Prenota 24h in anticipo. Le acque cristalline del Tirreno ti aspettano.", waText:"Ciao, vorrei prenotare un'immersione." },
      { emoji:'⛵', title:'Tour Isole Eolie (2-3 isole)', price:'Da €40 / persona', note:'Prenota con Navisal o Tarnav. Gite a Lipari, Stromboli, Vulcano e altro.', waText:'Ciao, vorrei informazioni sul tour delle Isole Eolie.' },
      { emoji:'🛥️', title:'Tour Privato Isole Eolie', price:'Da €100 / persona', note:'Tour in barca privata. Itinerario personalizzabile.', waText:'Ciao, vorrei prenotare un tour privato alle Isole Eolie.' }
    ]
  },
  fr: {
    back:'Retour', openMaps:'Ouvrir dans Maps', bookWa:'Réserver via WhatsApp',
    offline:"Vous êtes hors ligne — certains contenus peuvent ne pas se charger.",
    install:{ title:"Installer l'app MiPA", sub:"Ajoutez-la à votre écran d'accueil", btn:'Installer', dismiss:'Ignorer', iosStep1:"1. Appuyez sur le bouton Partager dans Safari (□↑)", iosStep2:"2. Faites défiler et appuyez sur \"Sur l'écran d'accueil\"" },
    tabs:{ info:'Infos Structure', philosophy:'Notre Philosophie', contacts:'Contacts', directions:'Arriver/Quitter Milazzo', map:'Carte Interactive', breakfast:'Itinéraire du Jour', bookServices:'Réserver Services', events:'Événements en Ville', museums:'Musées et Monuments', beach:'Emmène-moi à la Plage', roomGuide:'Retour à ma Chambre', checkout:'Check-Out' },
    home:{ greeting:'Bienvenue à MiPA 🌿', sub:'Votre concierge digital à Milazzo', checkinNew:"Je dois m'enregistrer", checkinNewDesc:"Téléchargez vos pièces d'identité", checkinDone:'Je suis déjà enregistré', checkinDoneDesc:"Accéder directement à l'app" },
    dash:{ welcome:'MiPA Companion', sub:'Comment pouvons-nous vous aider ?' },
    upload:{ title:"Téléchargez vos pièces d'identité", dropText:'Appuyez pour ajouter des photos', dropSub:"Passeport, carte d'identité ou permis de conduire", remove:'Supprimer', sendWa:'Envoyer via WhatsApp', continue:'Continuer vers les infos hébergement', sent:'Documents envoyés ✓' },
    info:{ general:'Informations Générales', contacts:'Contacts', address:'Adresse', phone:'Téléphone', whatsapp:'Chat sur WhatsApp', checkin:'15h00 – 22h00', checkout:'Avant 10h30', wifiConnect:'Se connecter au WiFi' },
    itinerary:{ desc:'Découvrez le meilleur de la ville grâce à cet itinéraire soigneusement planifié.', btn:'Explorer Milazzo' },
    map:{ title:'Carte Interactive de Milazzo', desc:'Attractions, monuments et joyaux cachés.', openMaps:'Ouvrir dans Google Maps' },
    beach:{ desc:'Naviguez directement vers la plage la plus proche — des eaux cristallines vous attendent.', btnTitle:'Emmène-moi à la plage', btnSub:'Ouvre Google Maps · Navigation' },
    room:{ desc:"Laissez-nous vous guider jusqu'à MiPA.", btnTitle:'Naviguer vers MiPA', btnSub:'Ouvre Google Maps · Itinéraire' },
    co:{ desc1:'Merci pour votre séjour ! Avant de partir, veuillez :', steps:["Laissez toutes les clés dans la chambre.","Rassemblez toutes vos affaires personnelles, y compris chargeurs et électroniques.","Vérifiez soigneusement la chambre pour tout objet oublié.","Réglez tous les paiements en attente, y compris la taxe de séjour."], note:'Si vous oubliez quelque chose, nous proposons un service de renvoi (frais applicables).', desc2:'Une fois prêt, appuyez sur le bouton ci-dessous pour nous prévenir. Merci !', btn:'Finaliser le Check-Out' },
    events:{ desc:'Événements à Milazzo et environs — mis à jour régulièrement.', showPast:'Afficher les événements passés', hidePast:'Masquer les événements passés', noUpcoming:'Aucun événement à venir. Revenez bientôt !' },
    philosophy:["Accueillir sans laisser de trace : c'est là que tout commence. Au cœur de Milazzo, où le rythme de la ville rencontre la mer, nous avons imaginé un espace capable de s'intégrer naturellement et discrètement dans le tissu urbain, offrant un séjour confortable et authentique.","Toutes nos chambres — junior suites — sont soignées dans les moindres détails : lumière naturelle, isolation phonique, systèmes efficaces qui minimisent le gaspillage. Des espaces généreux et équilibrés conçus pour un vrai bien-être profond, fondé sur la qualité et l'harmonie.","La durabilité est un choix concret, vécu chaque jour avec un engagement réel. Nous avons éliminé le plastique à usage unique et le papier jetable, proposons de l'eau potable gratuite et utilisons uniquement de l'énergie issue de sources renouvelables. Ainsi, nous contribuons à une hospitalité véritablement responsable.","Être au centre, c'est découvrir la ville authentiquement. Nous travaillons à promouvoir la mobilité douce comme le vélo, avec des itinéraires et des cartes dédiés pour se repérer facilement et réduire son empreinte environnementale.","Nous croyons en une hospitalité où responsabilité et confort fusionnent sans compromis. Nous avons déjà tout prévu : les hôtes n'ont rien à faire différemment ni à adopter de comportements éco-responsables particuliers. Ils peuvent simplement se détendre et profiter de leurs vacances, tandis que nous agissons discrètement pour minimiser notre impact. Ce qui reste, c'est le souvenir d'un voyage léger, authentique et conscient — avec une empreinte minimale sur l'environnement et une marque positive en soi."],
    dir:{ arriving:'Arrivée', leaving:'Quitter Milazzo', arrivalModes:[{icon:'directions_car',color:'#4f7d65',title:'En Voiture',desc:"Quittez l'autoroute au péage de Milazzo et suivez le Viale Sicilia jusqu'à la dernière sortie. Garez-vous sur la Piazza XXV Aprile (lignes bleues — app EasyPark)."},{icon:'train',color:'#0284c7',title:'En Train',desc:"Descendez à la gare de Milazzo et prenez les lignes 4 ou 5 jusqu'à l'arrêt du port, le plus proche de l'hébergement."},{icon:'directions_bus',color:'#d97706',title:'En Bus',desc:"Depuis l'aéroport de Catane ou d'autres localités, descendez à l'arrêt du port — le plus proche de MiPA."}], departureModes:[{icon:'directions_car',color:'#4f7d65',title:'En Voiture',desc:"Suivez le Viale Sicilia jusqu'au bout, puis prenez le raccordement Milazzo pour entrer sur l'A20 en direction de Messine (Catane) ou Palerme."},{icon:'directions_bus',color:'#d97706',title:'En Bus (vers Messine)',desc:'Vérifiez les horaires de GiuntaBus et AST pour les liaisons journalières vers Messine.'},{icon:'train',color:'#0284c7',title:'En Train',desc:"Prenez les lignes 4 ou 5 depuis l'arrêt du port jusqu'à la gare de Milazzo."},{icon:'flight',color:'#7c3aed',title:"Aéroport de Catane",desc:"Liaison directe de Milazzo à l'aéroport de Catane — horaires à l'arrêt du port."}] },
    monuments:[{emoji:'🏰',title:'Château de Milazzo',dist:'10 min à pied',desc:"Une forteresse candidate à l'UNESCO avec une vue panoramique sur la mer Tyrrhénienne et les îles Éoliennes.",link:'https://maps.app.goo.gl/castle'},{emoji:'⛪',title:'Duomo Antico',dist:'8 min à pied',desc:"L'ancienne cathédrale de Milazzo, chef-d'œuvre baroque au cœur du centre historique. Entrée gratuite.",link:'https://maps.app.goo.gl/duomo'},{emoji:'🏛️',title:'Borgo Antico',dist:'10 min à pied',desc:"Le vieux centre historique de Milazzo, un labyrinthe de ruelles, belvédères et architecture traditionnelle.",link:'https://maps.app.goo.gl/borgo'},{emoji:'🌊',title:'Réserve naturelle Capo Milazzo',dist:'20 min à vélo',desc:'Une superbe réserve naturelle à la pointe du promontoire de Milazzo. Baignade, snorkeling et vues époustouflantes.',link:'https://maps.app.goo.gl/capo'}],
    services:[{emoji:'🚲',title:'Location de vélos',price:'À partir de €10 / jour',note:'Explorez Milazzo à vélo — vélos urbains et électriques disponibles.',waText:'Bonjour, je voudrais louer un vélo.'},{emoji:'🤿',title:'Plongée sous-marine',price:'À partir de €60 / pers.',note:'Réservez 24h à l\'avance. Des eaux cristallines vous attendent.',waText:'Bonjour, je voudrais réserver une plongée.'},{emoji:'⛵',title:'Tour îles Éoliennes (2-3 îles)',price:'À partir de €40 / pers.',note:'Réservez via Navisal ou Tarnav. Excursions à Lipari, Stromboli, Vulcano.',waText:'Bonjour, je voudrais des infos sur le tour des îles Éoliennes.'},{emoji:'🛥️',title:'Tour privé îles Éoliennes',price:'À partir de €100 / pers.',note:'Croisière privée. Itinéraire personnalisable.',waText:'Bonjour, je voudrais réserver un tour privé aux îles Éoliennes.'}]
  },
  es: {
    back:'Volver', openMaps:'Abrir en Maps', bookWa:'Reservar por WhatsApp',
    offline:'Estás sin conexión — algunos contenidos pueden no cargarse.',
    install:{ title:'Instalar app MiPA', sub:'Añadir a tu pantalla de inicio', btn:'Instalar', dismiss:'Ignorar', iosStep1:'1. Toca el botón Compartir en Safari (□↑)', iosStep2:'2. Desplázate y toca "Añadir a la pantalla de inicio"' },
    tabs:{ info:'Info del Alojamiento', philosophy:'Nuestra Filosofía', contacts:'Contactos', directions:'Llegar/Salir de Milazzo', map:'Mapa Interactivo', breakfast:'Itinerario Diario', bookServices:'Reservar Servicios', events:'Eventos en la Ciudad', museums:'Museos y Monumentos', beach:'Llévame a la Playa', roomGuide:'Volver a Mi Habitación', checkout:'Check-Out' },
    home:{ greeting:'Bienvenido a MiPA 🌿', sub:'Tu conserje digital en Milazzo', checkinNew:'Necesito hacer el check-in', checkinNewDesc:'Sube tus documentos de identidad', checkinDone:'Ya hice el check-in', checkinDoneDesc:'Ir directamente a la app' },
    dash:{ welcome:'MiPA Companion', sub:'¿En qué podemos ayudarte?' },
    upload:{ title:'Sube tus documentos de identidad', dropText:'Toca para añadir fotos', dropSub:'Pasaporte, DNI o carnet de conducir', remove:'Eliminar', sendWa:'Enviar por WhatsApp', continue:'Continuar a info del alojamiento', sent:'Documentos enviados ✓' },
    info:{ general:'Información General', contacts:'Contactos', address:'Dirección', phone:'Teléfono', whatsapp:'Chat en WhatsApp', checkin:'15:00 – 22:00', checkout:'Antes de las 10:30', wifiConnect:'Conectar al WiFi' },
    itinerary:{ desc:'Descubre lo mejor de la ciudad con este itinerario cuidadosamente planificado.', btn:'Explorar Milazzo' },
    map:{ title:'Mapa Interactivo de Milazzo', desc:'Atracciones, monumentos y joyas ocultas.', openMaps:'Abrir en Google Maps' },
    beach:{ desc:'Navega directamente a la playa más cercana — aguas cristalinas del Tirreno te esperan.', btnTitle:'Llévame a la playa', btnSub:'Abre Google Maps · Navegación' },
    room:{ desc:'Déjanos guiarte de vuelta a MiPA.', btnTitle:'Navegar a MiPA', btnSub:'Abre Google Maps · Ruta' },
    co:{ desc1:'¡Gracias por tu estancia! Antes de salir, por favor:', steps:['Deja todas las llaves dentro de la habitación.','Recoge todos tus objetos personales, incluyendo cargadores y electrónicos.','Revisa la habitación por si olvidaste algo.','Liquida cualquier pago pendiente, incluyendo la tasa turística.'], note:'Si olvidas algo, ofrecemos servicio de reenvío por correo (con cargo).', desc2:'Cuando estés listo, pulsa el botón para avisarnos. ¡Gracias!', btn:'Completar Check-Out' },
    events:{ desc:'Eventos en Milazzo y alrededores — actualizados regularmente.', showPast:'Mostrar eventos pasados', hidePast:'Ocultar eventos pasados', noUpcoming:'No hay eventos próximos. ¡Vuelve pronto!' },
    philosophy:['Acoger sin dejar huella: ahí empieza todo. En el corazón de Milazzo, donde el ritmo de la ciudad se encuentra con el mar, imaginamos un espacio capaz de integrarse de forma natural y discreta en el tejido urbano, ofreciendo una estancia cómoda y auténtica.','Todas nuestras habitaciones —junior suites— están cuidadas hasta el último detalle: luz natural, insonorización, sistemas eficientes que minimizan el desperdicio. Espacios generosos y equilibrados diseñados para un bienestar genuino y profundo, basado en la calidad y la armonía.','La sostenibilidad es una elección concreta, vivida cada día con verdadero compromiso. Hemos eliminado el plástico de un solo uso y el papel desechable, ofrecemos agua potable gratuita y utilizamos únicamente energía de fuentes renovables. Así contribuimos a una hospitalidad verdaderamente responsable.','Estar en el centro significa descubrir la ciudad de forma auténtica. Trabajamos para promover la movilidad suave como el ciclismo, con itinerarios y mapas dedicados para navegar fácilmente y reducir la huella ambiental.','Creemos en una hospitalidad donde responsabilidad y comodidad se fusionan sin compromisos. Ya hemos pensado en todo: los huéspedes no necesitan hacer nada diferente ni adoptar ningún comportamiento especial. Pueden simplemente relajarse y disfrutar de sus vacaciones, mientras actuamos discretamente para minimizar nuestro impacto. Lo que queda es el recuerdo de un viaje ligero, auténtico y consciente — con una huella mínima en el entorno y una marca positiva en uno mismo.'],
    dir:{ arriving:'Llegada', leaving:'Salir de Milazzo', arrivalModes:[{icon:'directions_car',color:'#4f7d65',title:'En Coche',desc:'Sal de la autopista en el peaje de Milazzo y sigue el Viale Sicilia hasta la última salida. Aparca en la Piazza XXV Aprile (líneas azules — app EasyPark).'},{icon:'train',color:'#0284c7',title:'En Tren',desc:'Baja en la estación de Milazzo y toma las líneas 4 o 5 hasta la parada del puerto, la más cercana al alojamiento.'},{icon:'directions_bus',color:'#d97706',title:'En Autobús',desc:'Desde el aeropuerto de Catania u otros lugares, baja en la parada del puerto — la más cercana a MiPA.'}], departureModes:[{icon:'directions_car',color:'#4f7d65',title:'En Coche',desc:'Sigue el Viale Sicilia hasta el final, luego toma el enlace de Milazzo para entrar en la A20 hacia Mesina (Catania) o Palermo.'},{icon:'directions_bus',color:'#d97706',title:'En Autobús (a Mesina)',desc:'Consulta los horarios de GiuntaBus y AST para las conexiones diarias a Mesina.'},{icon:'train',color:'#0284c7',title:'En Tren',desc:'Toma las líneas 4 o 5 desde la parada del puerto hasta la estación de tren de Milazzo.'},{icon:'flight',color:'#7c3aed',title:'Aeropuerto de Catania',desc:'Conexión directa de Milazzo al aeropuerto de Catania — consulta los horarios en la parada del puerto.'}] },
    monuments:[{emoji:'🏰',title:'Castillo de Milazzo',dist:'10 min a pie',desc:'Una fortaleza candidata a la UNESCO con vistas panorámicas al mar Tirreno y las islas Eolias.',link:'https://maps.app.goo.gl/castle'},{emoji:'⛪',title:'Duomo Antico',dist:'8 min a pie',desc:'La antigua catedral de Milazzo, obra maestra barroca en el corazón del centro histórico. Entrada gratuita.',link:'https://maps.app.goo.gl/duomo'},{emoji:'🏛️',title:'Borgo Antico',dist:'10 min a pie',desc:'El casco histórico de Milazzo, un laberinto de callejuelas, miradores y arquitectura tradicional.',link:'https://maps.app.goo.gl/borgo'},{emoji:'🌊',title:'Reserva Natural Capo Milazzo',dist:'20 min en bici',desc:'Una impresionante reserva natural en la punta del promontorio de Milazzo. Natación, snorkel y vistas dramáticas.',link:'https://maps.app.goo.gl/capo'}],
    services:[{emoji:'🚲',title:'Alquiler de Bicicletas',price:'Desde €10 / día',note:'Explora Milazzo en bicicleta — bicis urbanas y eléctricas disponibles.',waText:'Hola, me gustaría alquilar una bicicleta.'},{emoji:'🤿',title:'Buceo',price:'Desde €60 / persona',note:'Reserva con 24h de antelación. Aguas cristalinas te esperan.',waText:'Hola, me gustaría reservar una experiencia de buceo.'},{emoji:'⛵',title:'Tour islas Eolias (2-3 islas)',price:'Desde €40 / persona',note:'Reserva con Navisal o Tarnav. Excursiones a Lipari, Stromboli, Vulcano.',waText:'Hola, me gustaría información sobre el tour de las islas Eolias.'},{emoji:'🛥️',title:'Tour privado islas Eolias',price:'Desde €100 / persona',note:'Barco privado exclusivo. Itinerario personalizable.',waText:'Hola, me gustaría reservar un tour privado a las islas Eolias.'}]
  },
  de: {
    back:'Zurück', openMaps:'In Maps öffnen', bookWa:'Per WhatsApp buchen',
    offline:'Sie sind offline — einige Inhalte werden möglicherweise nicht geladen.',
    install:{ title:'MiPA App installieren', sub:'Zum Home-Bildschirm hinzufügen', btn:'Installieren', dismiss:'Schließen', iosStep1:'1. Tippen Sie auf die Teilen-Schaltfläche in Safari (□↑)', iosStep2:'2. Scrollen Sie und tippen Sie auf "Zum Home-Bildschirm"' },
    tabs:{ info:'Unterkunftsinfos', philosophy:'Unsere Philosophie', contacts:'Kontakte', directions:'An- und Abreise', map:'Interaktive Karte', breakfast:'Tagesausflug', bookServices:'Services buchen', events:'Stadtveranstaltungen', museums:'Museen & Denkmäler', beach:'Bring mich zum Strand', roomGuide:'Zurück zu meinem Zimmer', checkout:'Check-Out' },
    home:{ greeting:'Willkommen bei MiPA 🌿', sub:'Ihr digitaler Concierge in Milazzo', checkinNew:'Ich muss einchecken', checkinNewDesc:'Laden Sie Ihre Ausweisdokumente hoch', checkinDone:'Ich habe bereits eingecheckt', checkinDoneDesc:'Direkt zur App' },
    dash:{ welcome:'MiPA Companion', sub:'Wie können wir Ihnen helfen?' },
    upload:{ title:'Laden Sie Ihre Ausweisdokumente hoch', dropText:'Tippen zum Hinzufügen von Fotos', dropSub:'Reisepass, Personalausweis oder Führerschein', remove:'Entfernen', sendWa:'Per WhatsApp senden', continue:'Weiter zu den Unterkunftsinformationen', sent:'Dokumente gesendet ✓' },
    info:{ general:'Allgemeine Informationen', contacts:'Kontakte', address:'Adresse', phone:'Telefon', whatsapp:'WhatsApp Chat', checkin:'15:00 – 22:00 Uhr', checkout:'Bis 10:30 Uhr', wifiConnect:'Mit WLAN verbinden' },
    itinerary:{ desc:'Entdecken Sie das Beste der Stadt mit diesem sorgfältig geplanten Reiseverlauf.', btn:'Milazzo erkunden' },
    map:{ title:'Interaktive Karte von Milazzo', desc:'Sehenswürdigkeiten, Wahrzeichen und versteckte Schätze.', openMaps:'In Google Maps öffnen' },
    beach:{ desc:'Navigieren Sie direkt zum nächsten Strand — kristallklares Tyrrhenisches Meer wartet.', btnTitle:'Bring mich zum Strand', btnSub:'Öffnet Google Maps · Navigation' },
    room:{ desc:'Lassen Sie uns Sie zurück zu MiPA führen.', btnTitle:'Zu MiPA navigieren', btnSub:'Öffnet Google Maps · Wegbeschreibung' },
    co:{ desc1:'Vielen Dank für Ihren Aufenthalt! Bevor Sie abreisen, beachten Sie bitte:', steps:['Lassen Sie alle Zimmerschlüssel im Zimmer.','Sammeln Sie alle persönlichen Gegenstände, einschließlich Ladegeräte.','Überprüfen Sie das Zimmer sorgfältig auf vergessene Gegenstände.','Begleichen Sie alle offenen Zahlungen, einschließlich der Kurtaxe.'], note:'Sollten Sie etwas vergessen haben, bieten wir einen Rücksendeservice an (Gebühren fallen an).', desc2:'Wenn Sie bereit sind, tippen Sie auf die Schaltfläche unten. Danke!', btn:'Check-Out abschließen' },
    events:{ desc:'Veranstaltungen in Milazzo und Umgebung — regelmäßig aktualisiert.', showPast:'Vergangene Events anzeigen', hidePast:'Vergangene Events ausblenden', noUpcoming:'Derzeit keine bevorstehenden Veranstaltungen. Schauen Sie bald wieder vorbei!' },
    philosophy:['Willkommen heißen, ohne Spuren zu hinterlassen: das ist der Ausgangspunkt von allem. Im Herzen von Milazzo, wo der Stadtrhythmus auf das Meer trifft, haben wir uns einen Raum vorgestellt, der sich auf natürliche und diskrete Weise in das städtische Gefüge einfügt und einen komfortablen, authentischen Aufenthalt bietet.','Alle unsere Zimmer — Junior-Suiten — sind bis ins kleinste Detail gepflegt: natürliches Licht, Schalldämmung, effiziente Anlagen, die Verschwendung reduzieren. Großzügige, ausgewogene Räume, die auf echtes und tiefes Wohlbefinden ausgerichtet sind, das aus Qualität und Harmonie besteht.','Nachhaltigkeit ist eine konkrete Wahl, die jeden Tag mit echtem Engagement gelebt wird. Wir haben Einwegplastik und Einwegpapier eliminiert, bieten kostenloses Trinkwasser an und nutzen ausschließlich Energie aus erneuerbaren Quellen. So leisten wir einen Beitrag zu einer wirklich verantwortungsvollen Gastfreundschaft.','Im Stadtzentrum zu sein bedeutet, die Stadt auf authentische Weise zu entdecken. Wir arbeiten daran, sanfte Mobilität wie das Fahrrad zu fördern, mit eigenen Routen und Karten, um sich leicht zu orientieren und die Umweltbelastung zu reduzieren.','Wir glauben an eine Gastfreundschaft, bei der Verantwortung und Komfort ohne Kompromisse verschmelzen. Wir haben bereits an alles gedacht: Der Gast muss nichts anderes tun oder besondere umweltbewusste Verhaltensweisen annehmen. Er kann sich einfach entspannen und seinen Urlaub genießen, während wir diskret handeln, um unseren Einfluss zu minimieren. Was bleibt, ist die Erinnerung an eine leichte, authentische und bewusste Reise — mit einem minimalen Fußabdruck auf der Umwelt und einem positiven Zeichen in sich selbst.'],
    dir:{ arriving:'Anreise', leaving:'Abreise aus Milazzo', arrivalModes:[{icon:'directions_car',color:'#4f7d65',title:'Mit dem Auto',desc:'Verlassen Sie die Autobahn an der Mautstelle Milazzo und folgen Sie dem Viale Sicilia bis zur letzten Ausfahrt. Parken auf der Piazza XXV Aprile (blaue Linien — EasyPark-App).'},{icon:'train',color:'#0284c7',title:'Mit dem Zug',desc:'Steigen Sie am Bahnhof Milazzo aus und nehmen Sie die Linien 4 oder 5 bis zur Hafenhaltestelle.'},{icon:'directions_bus',color:'#d97706',title:'Mit dem Bus',desc:'Vom Flughafen Catania oder anderen Orten steigen Sie an der Hafenhaltestelle aus — die nächstgelegene zu MiPA.'}], departureModes:[{icon:'directions_car',color:'#4f7d65',title:'Mit dem Auto',desc:'Folgen Sie dem Viale Sicilia bis zum Ende, dann nehmen Sie die Ausfahrt Milazzo auf die A20 Richtung Messina oder Palermo.'},{icon:'directions_bus',color:'#d97706',title:'Mit dem Bus (nach Messina)',desc:'Prüfen Sie die Fahrpläne von GiuntaBus und AST für tägliche Verbindungen nach Messina.'},{icon:'train',color:'#0284c7',title:'Mit dem Zug',desc:'Nehmen Sie die Linien 4 oder 5 von der Hafenhaltestelle zum Bahnhof Milazzo.'},{icon:'flight',color:'#7c3aed',title:'Flughafen Catania',desc:'Direktverbindung von Milazzo zum Flughafen Catania — Fahrpläne an der Hafenhaltestelle.'}] },
    monuments:[{emoji:'🏰',title:'Burg Milazzo',dist:'10 Min. zu Fuß',desc:'UNESCO-Kandidaten-Festung mit Panoramablick auf das Tyrrhenische Meer.',link:'https://maps.app.goo.gl/castle'},{emoji:'⛪',title:'Duomo Antico',dist:'8 Min. zu Fuß',desc:'Die alte Kathedrale von Milazzo, ein Barockmeisterwerk im historischen Zentrum. Eintritt frei.',link:'https://maps.app.goo.gl/duomo'},{emoji:'🏛️',title:'Borgo Antico',dist:'10 Min. zu Fuß',desc:'Das historische Altstadtviertel mit engen Gassen und Aussichtspunkten.',link:'https://maps.app.goo.gl/borgo'},{emoji:'🌊',title:'Naturreservat Capo Milazzo',dist:'20 Min. mit dem Rad',desc:'Atemberaubendes Naturreservat mit Schwimmen, Schnorcheln und Meeresblicken.',link:'https://maps.app.goo.gl/capo'}],
    services:[{emoji:'🚲',title:'Fahrradverleih',price:'Ab €10 / Tag',note:'Erkunden Sie Milazzo per Rad — Stadtfahrräder und E-Bikes verfügbar.',waText:'Hallo, ich möchte ein Fahrrad mieten.'},{emoji:'🤿',title:'Tauchen',price:'Ab €60 / Person',note:'24h im Voraus buchen. Kristallklares Wasser wartet.',waText:'Hallo, ich möchte einen Tauchgang buchen.'},{emoji:'⛵',title:'Äolische Inseln Tour (2-3 Inseln)',price:'Ab €40 / Person',note:'Bei Navisal oder Tarnav buchen.',waText:'Hallo, ich möchte Infos zur Äolischen Inseln Tour.'},{emoji:'🛥️',title:'Private Äolische Inseln Tour',price:'Ab €100 / Person',note:'Privat-Bootstour mit anpassbarem Reiseprogramm.',waText:'Hallo, ich möchte eine private Tour zu den Äolischen Inseln buchen.'}]
  },
  zh: {
    back:'返回', openMaps:'在地图中打开', bookWa:'通过WhatsApp预订',
    offline:'您处于离线状态 — 部分内容可能无法加载。',
    install:{ title:'安装MiPA应用', sub:'添加到主屏幕以便快速访问', btn:'安装', dismiss:'忽略', iosStep1:'1. 在Safari中点击分享按钮 (□↑)', iosStep2:'2. 滚动并点击"添加到主屏幕"' },
    tabs:{ info:'结构信息', philosophy:'我们的理念', contacts:'联系方式', directions:'到达/离开米拉佐', map:'互动地图', breakfast:'每日行程', bookServices:'预订服务', events:'城市活动', museums:'博物馆与古迹', beach:'带我去海滩', roomGuide:'回到我的房间', checkout:'退房' },
    home:{ greeting:'欢迎来到MiPA 🌿', sub:'您在米拉佐的数字礼宾', checkinNew:'我需要办理入住', checkinNewDesc:'上传您的身份证件', checkinDone:'我已经办理了入住', checkinDoneDesc:'直接进入应用' },
    dash:{ welcome:'MiPA Companion', sub:'我们能为您做什么？' },
    upload:{ title:'上传您的身份证件', dropText:'点击添加照片', dropSub:'护照、身份证或驾照', remove:'删除', sendWa:'通过WhatsApp发送', continue:'继续查看住宿信息', sent:'文件已发送 ✓' },
    info:{ general:'一般信息', contacts:'联系方式', address:'地址', phone:'电话', whatsapp:'WhatsApp聊天', checkin:'下午3:00 – 晚上10:00', checkout:'上午10:30前', wifiConnect:'连接WiFi' },
    itinerary:{ desc:'通过这个精心规划的行程，发现城市的最佳景点。', btn:'探索米拉佐' },
    map:{ title:'米拉佐互动地图', desc:'景点、地标和隐藏宝藏。', openMaps:'在谷歌地图中打开' },
    beach:{ desc:'直接导航到最近的海滩 — 清澈的第勒尼安海水等待着您。', btnTitle:'带我去海滩', btnSub:'打开谷歌地图 · 导航' },
    room:{ desc:'让我们引导您回到MiPA。', btnTitle:'导航到MiPA', btnSub:'打开谷歌地图 · 路线' },
    co:{ desc1:'感谢您选择入住！离开前，请注意：', steps:['将所有钥匙留在房间内。','收拾所有个人物品，包括充电器和电子设备。','仔细检查房间，确保没有遗漏任何物品。','结清所有未付款项，包括城市税。'], note:'如果遗忘了物品，我们提供邮寄返回服务（需额外付费）。', desc2:'准备好后，点击下方按钮通知我们。谢谢！', btn:'完成退房' },
    events:{ desc:'米拉佐及周边活动 — 定期更新。', showPast:'显示过去的活动', hidePast:'隐藏过去的活动', noUpcoming:'目前没有即将举行的活动。请稍后再查看！' },
    philosophy:['接待客人，不留痕迹：一切由此而生。在米拉佐的心脏地带，城市的节奏与大海相遇，我们构想了一个能够自然、低调地融入城市肌理的空间，为宾客提供舒适而真实的住宿体验。','我们所有的房间——精品套房——都精心打磨每一处细节：自然采光、隔音设计、高效节能系统。宽敞、平衡的空间，旨在提供由品质与和谐构成的真实而深层的舒适感。','可持续发展是一种具体的选择，每天以真正的承诺去践行。我们已消除一次性塑料和一次性纸制品，提供免费饮用水，并仅使用可再生能源。由此，我们为真正负责任的待客之道作出贡献。','身处市中心意味着真实地探索这座城市。我们正致力于推广骑自行车等温和出行方式，配有专属路线和地图，方便导航并减少环境影响。','我们相信一种责任与舒适无妥协融合的待客之道。我们已经为您考虑好了一切：宾客无需做任何不同的事，也无需采取任何特别的环保行为。只需放松身心，享受假期，而我们则悄然行动，将影响降至最低。留下的是一段轻盈、真实而有意识的旅行记忆。'],
    dir:{ arriving:'到达', leaving:'离开米拉佐', arrivalModes:[{icon:'directions_car',color:'#4f7d65',title:'驾车',desc:'在米拉佐收费站下高速公路，沿西西里大道行驶至最后出口。在XXV Aprile广场停车（蓝线停车位 — 使用EasyPark应用）。'},{icon:'train',color:'#0284c7',title:'乘火车',desc:'在米拉佐站下车，乘坐4或5路公交至港口站，即最近的站点。'},{icon:'directions_bus',color:'#d97706',title:'乘巴士',desc:'从卡塔尼亚机场或其他地点，在港口站下车 — 距MiPA最近。'}], departureModes:[{icon:'directions_car',color:'#4f7d65',title:'驾车',desc:'沿西西里大道行驶至尽头，然后取道米拉佐交叉口进入A20高速公路，朝墨西拿或巴勒莫方向。'},{icon:'directions_bus',color:'#d97706',title:'乘巴士（前往墨西拿）',desc:'查看GiuntaBus和AST的时刻表，了解前往墨西拿的每日班次。'},{icon:'train',color:'#0284c7',title:'乘火车',desc:'从港口站乘坐4或5路公交至米拉佐火车站。'},{icon:'flight',color:'#7c3aed',title:'卡塔尼亚机场',desc:'从米拉佐直达卡塔尼亚机场 — 在港口站查看时刻表。'}] },
    monuments:[{emoji:'🏰',title:'米拉佐城堡',dist:'步行10分钟',desc:'UNESCO候选堡垒，可俯瞰第勒尼安海和埃奥利安群岛的全景。',link:'https://maps.app.goo.gl/castle'},{emoji:'⛪',title:'古大教堂',dist:'步行8分钟',desc:'米拉佐古大教堂，历史中心心脏的巴洛克杰作。免费入场。',link:'https://maps.app.goo.gl/duomo'},{emoji:'🏛️',title:'古城区',dist:'步行10分钟',desc:'米拉佐历史中心，狭窄街道、观景台和传统建筑的迷宫。',link:'https://maps.app.goo.gl/borgo'},{emoji:'🌊',title:'卡波米拉佐自然保护区',dist:'骑车20分钟',desc:'米拉佐海角的壮观自然保护区。游泳、浮潜和绝美海景。',link:'https://maps.app.goo.gl/capo'}],
    services:[{emoji:'🚲',title:'自行车租赁',price:'每天起价€10',note:'骑车探索米拉佐 — 提供城市自行车和电动车。',waText:'您好，我想租一辆自行车。'},{emoji:'🤿',title:'水肺潜水',price:'每人起价€60',note:'提前24小时预订。清澈的海水等待着您。',waText:'您好，我想预订一次潜水体验。'},{emoji:'⛵',title:'埃奥利安群岛之旅（2-3个岛）',price:'每人起价€40',note:'通过Navisal或Tarnav预订。',waText:'您好，我想了解埃奥利安群岛之旅的信息。'},{emoji:'🛥️',title:'埃奥利安群岛私人游',price:'每人起价€100',note:'私人游船之旅，可定制行程。',waText:'您好，我想预订埃奥利安群岛私人游。'}]
  },
  ru: {
    back:'Назад', openMaps:'Открыть в Maps', bookWa:'Забронировать через WhatsApp',
    offline:'Вы не в сети — некоторые материалы могут не загрузиться.',
    install:{ title:'Установить приложение MiPA', sub:'Добавьте на главный экран', btn:'Установить', dismiss:'Закрыть', iosStep1:'1. Нажмите кнопку «Поделиться» в Safari (□↑)', iosStep2:'2. Прокрутите вниз и нажмите «На экран "Домой"»' },
    tabs:{ info:'Информация об объекте', philosophy:'Наша Философия', contacts:'Контакты', directions:'Приехать/Уехать из Милаццо', map:'Интерактивная карта', breakfast:'Дневной маршрут', bookServices:'Забронировать услуги', events:'Городские мероприятия', museums:'Музеи и памятники', beach:'Отвези меня на пляж', roomGuide:'Обратно в мой номер', checkout:'Выезд' },
    home:{ greeting:'Добро пожаловать в MiPA 🌿', sub:'Ваш цифровой консьерж в Милаццо', checkinNew:'Мне нужно зарегистрироваться', checkinNewDesc:'Загрузите ваши документы', checkinDone:'Я уже зарегистрирован', checkinDoneDesc:'Перейти прямо в приложение' },
    dash:{ welcome:'MiPA Companion', sub:'Чем мы можем вам помочь?' },
    upload:{ title:'Загрузите ваши документы', dropText:'Нажмите, чтобы добавить фото', dropSub:'Паспорт, удостоверение личности или водительские права', remove:'Удалить', sendWa:'Отправить через WhatsApp', continue:'Перейти к информации о размещении', sent:'Документы отправлены ✓' },
    info:{ general:'Общая информация', contacts:'Контакты', address:'Адрес', phone:'Телефон', whatsapp:'Чат в WhatsApp', checkin:'15:00 – 22:00', checkout:'До 10:30', wifiConnect:'Подключиться к WiFi' },
    itinerary:{ desc:'Откройте для себя лучшее в городе с этим тщательно спланированным маршрутом.', btn:'Исследовать Милаццо' },
    map:{ title:'Интерактивная карта Милаццо', desc:'Достопримечательности, памятники и скрытые жемчужины.', openMaps:'Открыть в Google Maps' },
    beach:{ desc:'Навигация прямо до ближайшего пляжа — кристально чистые воды Тирренского моря ждут вас.', btnTitle:'Отвези меня на пляж', btnSub:'Открывает Google Maps · Навигация' },
    room:{ desc:'Позвольте нам проводить вас обратно в MiPA.', btnTitle:'Навигация к MiPA', btnSub:'Открывает Google Maps · Маршрут' },
    co:{ desc1:'Спасибо, что выбрали нас! Перед отъездом, пожалуйста:', steps:['Оставьте все ключи в номере.','Соберите все личные вещи, включая зарядные устройства и электронику.','Тщательно проверьте номер на наличие забытых вещей.','Урегулируйте все незакрытые платежи, включая туристический налог.'], note:'Если вы что-то забыли, мы предлагаем услугу возврата по почте (взимается дополнительная плата).', desc2:'Когда будете готовы, нажмите кнопку ниже. Спасибо!', btn:'Завершить выезд' },
    events:{ desc:'Мероприятия в Милаццо и окрестностях — регулярно обновляется.', showPast:'Показать прошедшие события', hidePast:'Скрыть прошедшие события', noUpcoming:'На данный момент предстоящих мероприятий нет. Заглядывайте позже!' },
    philosophy:['Принимать гостей, не оставляя следов: с этого начинается всё. В самом сердце Милаццо, где ритм города встречается с морем, мы представили пространство, способное естественно и ненавязчиво вписаться в городскую ткань, предлагая комфортный и аутентичный отдых.','Все наши номера — категории «junior suite» — продуманы до мельчайших деталей: естественный свет, звукоизоляция, эффективные системы, сокращающие расход ресурсов. Просторные, сбалансированные пространства, созданные для подлинного и глубокого комфорта.','Устойчивое развитие — это конкретный выбор, который мы реализуем каждый день с реальной ответственностью. Мы полностью отказались от одноразового пластика и одноразовой бумаги, предлагаем бесплатную питьевую воду и используем исключительно энергию из возобновляемых источников.','Находиться в центре города — значит открывать его аутентично. Мы работаем над тем, чтобы продвигать мягкие виды передвижения, такие как велосипед.','Мы верим в гостеприимство, где ответственность и комфорт сливаются без компромиссов. Мы уже всё продумали: гостю не нужно ничего делать иначе. Он может просто расслабиться и наслаждаться отдыхом, пока мы ненавязчиво действуем, чтобы свести к минимуму наше воздействие.'],
    dir:{ arriving:'Прибытие', leaving:'Отъезд из Милаццо', arrivalModes:[{icon:'directions_car',color:'#4f7d65',title:'На автомобиле',desc:'Съезжайте с автострады на пункте оплаты Милаццо и следуйте по проспекту Сицилия до последнего выезда. Паркуйтесь на площади XXV Aprile (синие линии — приложение EasyPark).'},{icon:'train',color:'#0284c7',title:'На поезде',desc:'Выйдите на станции Милаццо и сядьте на линии 4 или 5 до остановки у порта.'},{icon:'directions_bus',color:'#d97706',title:'На автобусе',desc:'Из аэропорта Катании или других мест выйдите на остановке у порта — ближайшей к MiPA.'}], departureModes:[{icon:'directions_car',color:'#4f7d65',title:'На автомобиле',desc:'Следуйте по проспекту Сицилия до конца, затем возьмите развязку Милаццо на автостраду A20 в направлении Мессины или Палермо.'},{icon:'directions_bus',color:'#d97706',title:'На автобусе (в Мессину)',desc:'Проверьте расписание GiuntaBus и AST для ежедневных рейсов в Мессину.'},{icon:'train',color:'#0284c7',title:'На поезде',desc:'Возьмите линии 4 или 5 от остановки у порта до железнодорожного вокзала Милаццо.'},{icon:'flight',color:'#7c3aed',title:'Аэропорт Катании',desc:'Прямое сообщение из Милаццо в аэропорт Катании — расписание на остановке у порта.'}] },
    monuments:[{emoji:'🏰',title:'Замок Милаццо',dist:'10 мин пешком',desc:'Крепость-кандидат ЮНЕСКО с панорамным видом на Тирренское море и Эолийские острова.',link:'https://maps.app.goo.gl/castle'},{emoji:'⛪',title:'Duomo Antico',dist:'8 мин пешком',desc:'Старинный собор Милаццо, барочный шедевр в сердце исторического центра. Вход свободный.',link:'https://maps.app.goo.gl/duomo'},{emoji:'🏛️',title:'Borgo Antico',dist:'10 мин пешком',desc:'Исторический центр Милаццо — лабиринт узких улочек и смотровых площадок.',link:'https://maps.app.goo.gl/borgo'},{emoji:'🌊',title:'Природный заповедник Капо-Милаццо',dist:'20 мин на велосипеде',desc:'Потрясающий природный заповедник на оконечности мыса Милаццо. Плавание, снорклинг и захватывающие морские виды.',link:'https://maps.app.goo.gl/capo'}],
    services:[{emoji:'🚲',title:'Прокат велосипедов',price:'От €10 / день',note:'Исследуйте Милаццо на велосипеде — городские велосипеды и электровелосипеды.',waText:'Здравствуйте, я хотел бы арендовать велосипед.'},{emoji:'🤿',title:'Дайвинг',price:'От €60 / человек',note:'Бронируйте за 24 часа. Кристально чистые воды ждут вас.',waText:'Здравствуйте, я хотел бы забронировать погружение.'},{emoji:'⛵',title:'Тур по Эолийским островам',price:'От €40 / человек',note:'Бронируйте через Navisal или Tarnav.',waText:'Здравствуйте, я хотел бы информацию о туре на Эолийские острова.'},{emoji:'🛥️',title:'Частный тур по Эолийским островам',price:'От €100 / человек',note:'Частная прогулка на лодке. Настраиваемый маршрут.',waText:'Здравствуйте, я хотел бы забронировать частный тур на Эолийские острова.'}]
  }
};

// ── Events data ─────────────────────────────
const EVENTS = [
  { year:2025, month:3,  day:22, emoji:'🌸', titles:{en:'Spring Farmers Market',it:'Mercato dei Produttori di Primavera'}, descs:{en:'Piazza Roma · 9:00–14:00 · Local produce & crafts',it:'Piazza Roma · 9:00–14:00 · Prodotti locali e artigianato'} },
  { year:2025, month:4,  day:13, emoji:'🎨', titles:{en:'Street Art Festival',it:'Festival di Street Art'}, descs:{en:'Centro storico · Free entry · Live murals',it:'Centro storico · Ingresso libero · Murales dal vivo'} },
  { year:2025, month:5,  day:3,  emoji:'🚲', titles:{en:'Milazzo Cycling Day',it:'Giornata della Bicicletta'}, descs:{en:'Lungomare · 9:00 start · Group ride',it:'Lungomare · Partenza 9:00 · Pedalata di gruppo'} },
  { year:2025, month:5,  day:31, emoji:'🎭', titles:{en:'Open Theatre Night',it:'Notte del Teatro Aperto'}, descs:{en:'Teatro Trifiletti · 21:00 · Admission €8',it:'Teatro Trifiletti · 21:00 · Ingresso €8'} },
  { year:2025, month:6,  day:21, emoji:'🎶', titles:{en:'Music Feast of San Giovanni',it:'Festa della Musica di San Giovanni'}, descs:{en:'Piazza Duomo · All evening · Free',it:'Piazza Duomo · Tutta la sera · Ingresso libero'} },
  { year:2025, month:7,  day:19, emoji:'🌊', titles:{en:'Marine Night',it:'Notte Marina'}, descs:{en:'Porto di Milazzo · From 21:00 · Free',it:'Porto di Milazzo · Dalle 21:00 · Ingresso libero'} },
  { year:2025, month:7,  day:26, emoji:'🎆', titles:{en:"Patronal Feast of Sant'Antonio",it:"Festa Patronale di Sant'Antonio"}, descs:{en:'Centro storico · Procession 19:00 · Fireworks midnight',it:'Centro storico · Processione 19:00 · Fuochi mezzanotte'} },
  { year:2025, month:8,  day:15, emoji:'🎉', titles:{en:'Ferragosto · Boat Parade',it:'Ferragosto · Processione in Barca'}, descs:{en:'Porto di Milazzo · From 10:00 · All day',it:'Porto di Milazzo · Dalle 10:00 · Tutto il giorno'} },
  { year:2025, month:9,  day:14, emoji:'🍇', titles:{en:'Harvest Festival',it:'Festa della Vendemmia'}, descs:{en:'Piazza Caio Duilio · 17:00–23:00 · Wine, food & music',it:'Piazza Caio Duilio · 17:00–23:00 · Vino, cibo e musica'} },
  { year:2025, month:10, day:11, emoji:'🐟', titles:{en:'Fish & Sea Festival',it:'Sagra del Pesce e del Mare'}, descs:{en:'Lungomare · 12:00–22:00 · Tastings & live music',it:'Lungomare · 12:00–22:00 · Degustazioni e musica dal vivo'} },
];

const MONTHS_LONG = {
  en:['January','February','March','April','May','June','July','August','September','October','November','December'],
  it:['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  fr:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  es:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  de:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  zh:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  ru:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
};
const MONTHS_SHORT = {
  en:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
  it:['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'],
  fr:['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'],
  es:['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'],
  de:['JAN','FEB','MÄR','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ'],
  zh:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  ru:['ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'],
};

// ── Helpers ─────────────────────────────────
function t() { return allT[state.lang] || allT.en; }

function waLink() {
  const msg = t().upload ? t().upload.sendWa : 'Documenti check-in';
  return 'https://wa.me/393339201524?text=' + encodeURIComponent(msg);
}

function menuItems() {
  const tabs = t().tabs;
  return [
    { id:'info',         icon:'home',         color:'#4f7d65', label:tabs.info,        sub: t().info ? t().info.general : '' },
    { id:'philosophy',   icon:'eco',          color:'#3d8c5e', label:tabs.philosophy,  sub:'Eco-friendly & sustainable' },
    { id:'directions',   icon:'navigation',   color:'#0284c7', label:tabs.directions,  sub:'How to arrive & depart' },
    { id:'map',          icon:'map',          color:'#7c3aed', label:tabs.map,         sub:'Interactive map of Milazzo' },
    { id:'breakfast',    icon:'explore',      color:'#d97706', label:tabs.breakfast,   sub:'Discover the best of Milazzo' },
    { id:'bookServices', icon:'sailing',      color:'#0891b2', label:tabs.bookServices,sub:'Bikes, dives, tours & more' },
    { id:'events',       icon:'celebration',  color:'#db2777', label:tabs.events,      sub:'Concerts, festivals & markets' },
    { id:'museums',      icon:'museum',       color:'#b45309', label:tabs.museums,     sub:'Culture & history of Milazzo' },
    { id:'beach',        icon:'beach_access', color:'#0369a1', label:tabs.beach,       sub:'Crystal clear waters await' },
    { id:'roomGuide',    icon:'king_bed',     color:'#9333ea', label:tabs.roomGuide,   sub:'Navigate back to MiPA' },
    { id:'checkout',     icon:'logout',       color:'#dc2626', label:tabs.checkout,    sub:'Instructions for departure' },
  ];
}

function mapEvent(e) {
  const l = state.lang;
  const fallback = (obj) => obj[l] || obj.it || obj.en || '';
  return { ...e, title: fallback(e.titles), desc: fallback(e.descs), monShort: (MONTHS_SHORT[l] || MONTHS_SHORT.en)[e.month - 1] };
}

function groupEvents(list, asc) {
  const groups = {};
  list.forEach(e => {
    const key = e.year + '-' + (e.month < 10 ? '0' + e.month : '' + e.month);
    if (!groups[key]) groups[key] = [];
    groups[key].push(mapEvent(e));
  });
  const keys = Object.keys(groups).sort((a,b) => asc ? a.localeCompare(b) : b.localeCompare(a));
  return keys.map(key => {
    const parts = key.split('-');
    const mo = parseInt(parts[1], 10);
    const yr = parseInt(parts[0], 10);
    const ml = MONTHS_LONG[state.lang] || MONTHS_LONG.en;
    return { key, monthName: ml[mo-1] + ' ' + yr, events: groups[key] };
  });
}

function todayLabel() {
  const l = state.lang;
  const today = new Date(); today.setHours(0,0,0,0);
  const locales = {en:'en-GB',it:'it-IT',fr:'fr-FR',es:'es-ES',de:'de-DE',zh:'zh-CN',ru:'ru-RU'};
  const labels = {en:'Today is',it:'Oggi è',fr:"Aujourd'hui c'est le",es:'Hoy es',de:'Heute ist',zh:'今天是',ru:'Сегодня'};
  return (labels[l]||labels.en) + ' ' + today.toLocaleDateString(locales[l]||'en-GB', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
}

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return el;
}

function ms(icon, outline) {
  return h('span', { className: 'ms' + (outline ? ' ms-outline' : '') }, icon);
}

function langSelect() {
  const sel = h('select', { className: 'lang-select' },
    h('option', { value:'en' }, '🇬🇧 English'),
    h('option', { value:'it' }, '🇮🇹 Italiano'),
    h('option', { value:'fr' }, '🇫🇷 Français'),
    h('option', { value:'es' }, '🇪🇸 Español'),
    h('option', { value:'de' }, '🇩🇪 Deutsch'),
    h('option', { value:'zh' }, '🇨🇳 中文'),
    h('option', { value:'ru' }, '🇷🇺 Русский'),
  );
  sel.value = state.lang;
  sel.addEventListener('change', e => { state.lang = e.target.value; localStorage.setItem('mipa_lang', state.lang); render(); });
  return sel;
}

// ── Navigation ───────────────────────────────
function navigate(page, section) {
  state.page = page;
  if (section) state.section = section;
  localStorage.setItem('mipa_page', page);
  window.scrollTo(0, 0);
  render();
}

// ── Actions ──────────────────────────────────
function connectWifi() {
  const ssid = 'MiPA_guests', pwd = 'viaS.Giovanni/42';
  window.location.href = 'wifi:S:' + ssid + ';T:WPA;P:' + pwd + ';;';
  if (navigator.clipboard) navigator.clipboard.writeText('SSID: ' + ssid + '\nPassword: ' + pwd);
}

function doCheckout() {
  localStorage.clear();
  state.images = [];
  state.docsSent = false;
  navigate('home');
  alert(t().co ? t().co.btn : 'Thank you!');
}

function installApp() {
  if (state.installPrompt) {
    state.installPrompt.prompt();
    state.installPrompt.userChoice.then(() => { state.installPrompt = null; render(); });
  }
}

// ── File upload ──────────────────────────────
function onFiles(files) {
  Array.from(files).forEach(f => {
    const reader = new FileReader();
    reader.onload = ev => {
      state.images.push(ev.target.result);
      localStorage.setItem('mipa_images', JSON.stringify(state.images));
      render();
    };
    reader.readAsDataURL(f);
  });
}

function removeImage(i) {
  state.images.splice(i, 1);
  localStorage.setItem('mipa_images', JSON.stringify(state.images));
  render();
}

// ── Render helpers ───────────────────────────
function renderOfflineBar() {
  if (state.isOnline) return null;
  return h('div', { className: 'offline-bar' }, ms('wifi_off', false), ' ', (t().offline || 'You are offline.'));
}

function renderInstallBanner() {
  if (!state.installPrompt || state.installDismissed) return null;
  const banner = h('div', { className: 'install-banner' },
    h('div', { className: 'install-banner-icon' }, ms('install_mobile')),
    h('div', { className: 'install-banner-text' },
      h('div', { className: 'install-banner-title' }, t().install.title),
      h('div', { className: 'install-banner-sub' }, t().install.sub),
    ),
    h('button', { className: 'install-banner-btn', onClick: installApp }, t().install.btn),
    h('button', { className: 'install-banner-close', onClick: () => { state.installDismissed = true; render(); } }, ms('close', true)),
  );
  return banner;
}

function renderSidebar() {
  if (state.page !== 'dashboard' && state.page !== 'section') return null;
  const items = menuItems();
  return h('aside', { className: 'sidebar' },
    h('div', { className: 'sidebar-header' },
      h('div', { className: 'sidebar-logo' }, 'MiPA'),
      h('div', { className: 'sidebar-sub' }, 'Guest Companion · Milazzo'),
      h('div', { className: 'sidebar-lang' }, langSelect()),
    ),
    h('nav', { className: 'sidebar-nav' },
      ...items.map(item => {
        const btn = h('button', {
          className: 'sidebar-item' + (state.page === 'section' && state.section === item.id ? ' active' : ''),
          onClick: () => navigate('section', item.id)
        },
          h('div', { className: 'sidebar-item-icon', style: { background: item.color } }, ms(item.icon)),
          h('span', { className: 'sidebar-item-label' }, item.label),
        );
        return btn;
      })
    ),
    h('div', { className: 'sidebar-footer' }, 'MiPA · Via San Giovanni 42, Milazzo'),
  );
}

// ── Page renders ─────────────────────────────
function renderHome() {
  const tr = t();
  const wrap = h('div', { className: 'page' },
    h('div', { className: 'toolbar toolbar-home' },
      h('div', { className: 'toolbar-row' },
        h('div', {},
          h('div', { className: 'toolbar-title' }, 'MiPA'),
          h('div', { className: 'toolbar-subtitle' }, 'Guest Companion · Milazzo'),
        ),
        langSelect(),
      )
    ),
    h('div', { className: 'home-content' },
      h('div', { className: 'home-greeting' }, tr.home.greeting),
      h('div', { className: 'home-sub' }, tr.home.sub),
      h('div', { className: 'checkin-card' },
        h('button', { className: 'checkin-option', onClick: () => navigate('upload') },
          h('div', { className: 'checkin-icon', style: { background: '#4f7d65' } }, ms('upload_file')),
          h('div', { className: 'checkin-text' },
            h('div', { className: 'checkin-title' }, tr.home.checkinNew),
            h('div', { className: 'checkin-desc' }, tr.home.checkinNewDesc),
          ),
          ms('chevron_right', true),
        ),
        h('button', { className: 'checkin-option', onClick: () => navigate('dashboard') },
          h('div', { className: 'checkin-icon', style: { background: '#0284c7' } }, ms('login')),
          h('div', { className: 'checkin-text' },
            h('div', { className: 'checkin-title' }, tr.home.checkinDone),
            h('div', { className: 'checkin-desc' }, tr.home.checkinDoneDesc),
          ),
          ms('chevron_right', true),
        ),
      ),
      state.showIOSHint ? h('div', { style: 'margin-top:16px;background:var(--surface);border-radius:var(--r-md);padding:16px;box-shadow:var(--shadow-xs)' },
        h('div', { style: 'font-size:14px;font-weight:700;color:var(--text-1);margin-bottom:10px;display:flex;align-items:center;gap:8px' },
          ms('install_mobile'), ' ', tr.install.title,
        ),
        h('div', { style: 'font-size:13px;color:var(--text-2);line-height:1.6' },
          tr.install.iosStep1, h('br', {}), tr.install.iosStep2,
        ),
        h('button', { onClick: () => { state.showIOSHint = false; render(); }, style: 'margin-top:12px;background:var(--bg);border:none;border-radius:var(--r-sm);padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;color:var(--text-2)' }, tr.install.dismiss),
      ) : null,
    ),
    renderInstallBanner(),
  );
  return wrap;
}

function renderUpload() {
  const tr = t();
  const fileInput = h('input', { type: 'file', accept: 'image/*', multiple: '' });
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', e => onFiles(e.target.files));

  const previews = state.images.length ? h('div', { className: 'preview-grid' },
    ...state.images.map((img, i) =>
      h('div', { className: 'preview-item' },
        h('img', { src: img, alt: 'doc ' + i }),
        h('div', { className: 'preview-item-footer' },
          h('button', { className: 'preview-remove', onClick: () => removeImage(i) }, tr.upload.remove),
        ),
      )
    )
  ) : null;

  const sentBadge = state.docsSent ? h('div', { className: 'sent-badge' },
    ms('check_circle'), ' ', tr.upload.sent,
  ) : null;

  const waBtn = state.images.length ? h('a', {
    className: 'btn-wa', href: waLink(), target: '_blank',
    onClick: () => { state.docsSent = true; localStorage.setItem('mipa_docssent', 'true'); render(); }
  }, ms('chat'), ' ', tr.upload.sendWa) : null;

  return h('div', { className: 'page' },
    h('div', { className: 'toolbar toolbar-section' },
      h('button', { className: 'back-btn', onClick: () => navigate('home') }, ms('chevron_left', true), ' ', tr.back),
      langSelect(),
    ),
    h('div', { className: 'upload-page' },
      h('h2', { className: 'section-h2' }, tr.upload.title),
      h('div', { className: 'upload-drop', onClick: () => fileInput.click() },
        h('span', { className: 'upload-drop-icon' }, '📸'),
        h('div', { className: 'upload-drop-text' }, tr.upload.dropText),
        h('div', { className: 'upload-drop-sub' }, tr.upload.dropSub),
        fileInput,
      ),
      previews,
      sentBadge,
      waBtn,
      h('button', { className: 'btn-primary', onClick: () => navigate('dashboard') },
        ms('arrow_forward'), ' ', tr.upload.continue,
      ),
    ),
  );
}

function renderDashboard() {
  const tr = t();
  const items = menuItems();
  return h('div', { className: 'page' },
    h('div', { className: 'toolbar toolbar-home', style: 'padding:50px 18px 22px' },
      h('div', { className: 'toolbar-row' },
        h('div', {},
          h('div', { className: 'toolbar-title' }, tr.dash.welcome),
          h('div', { className: 'toolbar-subtitle' }, tr.dash.sub),
        ),
        langSelect(),
      )
    ),
    h('div', { className: 'dashboard' },
      h('div', { className: 'menu' },
        ...items.map((item, i) =>
          h('button', {
            className: 'card',
            style: { '--i': i },
            onClick: () => navigate('section', item.id),
          },
            h('div', { className: 'card-icon', style: { background: item.color } }, ms(item.icon)),
            h('div', { className: 'card-text' },
              h('div', { className: 'card-title' }, item.label),
              h('div', { className: 'card-sub' }, item.sub),
            ),
            h('div', { className: 'card-arrow' }, ms('chevron_right', true)),
          )
        )
      )
    ),
  );
}

function renderSectionContent() {
  const tr = t();
  const s = state.section;

  if (s === 'info') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.info),
      h('div', { className: 'wifi-card' },
        h('div', { className: 'wifi-kicker' }, 'WiFi'),
        h('div', { className: 'wifi-field' }, h('div', { className: 'wifi-field-label' }, 'Network'), h('div', { className: 'wifi-field-value' }, 'MiPA_guests')),
        h('div', { className: 'wifi-field' }, h('div', { className: 'wifi-field-label' }, 'Password'), h('div', { className: 'wifi-field-value' }, 'viaS.Giovanni/42')),
        h('button', { className: 'wifi-btn', onClick: connectWifi }, ms('wifi'), ' ', tr.info.wifiConnect),
      ),
      h('div', { className: 'section-group' },
        h('div', { className: 'section-group-label' }, tr.info.general),
        h('div', { className: 'section-row' },
          h('div', { className: 'row-icon', style: { background: '#4f7d65' } }, ms('schedule')),
          h('div', {}, h('div', { className: 'row-label' }, 'Check-in'), h('div', { className: 'row-value' }, tr.info.checkin)),
        ),
        h('div', { className: 'section-row' },
          h('div', { className: 'row-icon', style: { background: '#0284c7' } }, ms('logout')),
          h('div', {}, h('div', { className: 'row-label' }, 'Check-out'), h('div', { className: 'row-value' }, tr.info.checkout)),
        ),
        h('div', { className: 'section-row' },
          h('div', { className: 'row-icon', style: { background: '#7c3aed' } }, ms('location_on')),
          h('div', {}, h('div', { className: 'row-label' }, tr.info.address), h('div', { className: 'row-value' }, 'Via San Giovanni 42, Milazzo (ME)')),
        ),
      ),
      h('div', { className: 'section-label' }, tr.info.contacts),
      h('div', { className: 'contact-list' },
        h('a', { className: 'contact-btn', href: 'tel:+393339201524' },
          h('div', { className: 'contact-btn-icon', style: { background: '#16a34a' } }, ms('call')),
          h('div', {}, h('div', { className: 'contact-btn-label' }, tr.info.phone), h('div', { className: 'contact-btn-value' }, '+39 333 920 1524')),
          ms('chevron_right', true),
        ),
        h('a', { className: 'contact-btn', href: 'mailto:studiosmipa@gmail.com' },
          h('div', { className: 'contact-btn-icon', style: { background: '#0284c7' } }, ms('mail')),
          h('div', {}, h('div', { className: 'contact-btn-label' }, 'Email'), h('div', { className: 'contact-btn-value' }, 'studiosmipa@gmail.com')),
          ms('chevron_right', true),
        ),
        h('a', { className: 'contact-btn', href: 'https://wa.me/393339201524', target: '_blank' },
          h('div', { className: 'contact-btn-icon', style: { background: '#25d366' } }, ms('chat')),
          h('div', {}, h('div', { className: 'contact-btn-label' }, 'WhatsApp'), h('div', { className: 'contact-btn-value' }, tr.info.whatsapp)),
          ms('chevron_right', true),
        ),
      ),
    );
  }

  if (s === 'philosophy') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.philosophy),
      h('div', { className: 'prose' }, ...tr.philosophy.map(para => h('p', {}, para))),
    );
  }

  if (s === 'directions') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.directions),
      h('div', { className: 'section-label' }, tr.dir.arriving),
      ...tr.dir.arrivalModes.map(d =>
        h('div', { className: 'dir-card' },
          h('div', { className: 'dir-card-head' },
            h('div', { className: 'dir-card-icon', style: { background: d.color } }, ms(d.icon)),
            h('div', { className: 'dir-card-title' }, d.title),
          ),
          h('div', { className: 'dir-card-body' }, d.desc),
        )
      ),
      h('div', { className: 'section-label', style: 'margin-top:22px' }, tr.dir.leaving),
      ...tr.dir.departureModes.map(d =>
        h('div', { className: 'dir-card' },
          h('div', { className: 'dir-card-head' },
            h('div', { className: 'dir-card-icon', style: { background: d.color } }, ms(d.icon)),
            h('div', { className: 'dir-card-title' }, d.title),
          ),
          h('div', { className: 'dir-card-body' }, d.desc),
        )
      ),
    );
  }

  if (s === 'map') {
    return h('div', { className: 'section-body', style: 'padding:18px 15px 0' },
      h('h2', { className: 'section-h2' }, tr.tabs.map),
      h('div', { className: 'map-card' },
        h('div', { className: 'map-card-head' },
          h('div', { className: 'map-card-title' }, tr.map.title),
          h('div', { className: 'map-card-desc' }, tr.map.desc),
        ),
        h('iframe', { className: 'map-iframe', src: 'https://www.google.com/maps/d/embed?mid=15vrvCbCRnWxkxZrUN1FkFf96XWx7sUyc&hl=it&ehbc=2E312F', allowfullscreen: '', loading: 'lazy' }),
        h('div', { className: 'map-card-foot' },
          h('a', { className: 'map-btn', href: 'https://www.google.com/maps/place/Via+San+Giovanni,+42+Milazzo', target: '_blank', style: 'background:var(--toolbar)' },
            ms('open_in_new'), ' ', tr.map.openMaps,
          ),
        ),
      ),
    );
  }

  if (s === 'breakfast') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.breakfast),
      h('p', { style: 'font-size:14px;color:var(--text-3);margin-bottom:20px;line-height:1.6' }, tr.itinerary.desc),
      h('a', { className: 'itinerary-cta', href: 'https://esploramilazzo.netlify.app/', target: '_blank' },
        ms('explore'), ' ', tr.itinerary.btn,
      ),
    );
  }

  if (s === 'bookServices') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.bookServices),
      ...tr.services.map(svc =>
        h('div', { className: 'service-card' },
          h('div', { className: 'service-card-top' },
            h('div', { className: 'service-emoji' }, svc.emoji),
            h('div', {},
              h('div', { className: 'service-title' }, svc.title),
              h('div', { className: 'service-price' }, svc.price),
              h('div', { className: 'service-note' }, svc.note),
            ),
          ),
          h('a', {
            className: 'service-wa',
            href: 'https://wa.me/393339201524?text=' + encodeURIComponent(svc.waText),
            target: '_blank',
          }, ms('chat'), ' ', tr.bookWa),
        )
      ),
    );
  }

  if (s === 'events') {
    const today = new Date(); today.setHours(0,0,0,0);
    const pastEvs = EVENTS.filter(e => new Date(e.year, e.month-1, e.day) < today);
    const upcomingEvs = EVENTS.filter(e => new Date(e.year, e.month-1, e.day) >= today);
    const gPast = groupEvents(pastEvs, false);
    const gUpcoming = groupEvents(upcomingEvs, true);

    const pastToggle = pastEvs.length ? h('button', { className: 'past-toggle', onClick: () => { state.showPast = !state.showPast; render(); } },
      h('span', { style: 'font-size:16px' }, state.showPast ? '🙈' : '📅'),
      ' ',
      state.showPast ? tr.events.hidePast : (tr.events.showPast + ' (' + pastEvs.length + ')')
    ) : null;

    const pastSection = (state.showPast && pastEvs.length) ? [
      ...gPast.map(g =>
        h('div', { className: 'month-group' },
          h('div', { className: 'month-label' }, g.monthName),
          ...g.events.map(e =>
            h('div', { className: 'event-card', style: 'opacity:.55' },
              h('div', { className: 'event-date' }, h('div', { className: 'event-day' }, e.day), h('div', { className: 'event-mon' }, e.monShort)),
              h('div', { className: 'event-info' }, h('div', { className: 'event-title' }, e.emoji + ' ' + e.title), h('div', { className: 'event-desc' }, e.desc)),
            )
          )
        )
      ),
      h('hr', { className: 'past-divider' }),
    ] : [];

    const upcomingSection = upcomingEvs.length
      ? gUpcoming.map(g =>
          h('div', { className: 'month-group' },
            h('div', { className: 'month-label' }, g.monthName),
            ...g.events.map(e =>
              h('div', { className: 'event-card' },
                h('div', { className: 'event-date' }, h('div', { className: 'event-day' }, e.day), h('div', { className: 'event-mon' }, e.monShort)),
                h('div', { className: 'event-info' }, h('div', { className: 'event-title' }, e.emoji + ' ' + e.title), h('div', { className: 'event-desc' }, e.desc)),
              )
            )
          )
        )
      : [h('p', { style: 'font-size:15px;color:var(--text-3);text-align:center;margin-top:32px' }, tr.events.noUpcoming)];

    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.events),
      h('p', { style: 'font-size:13px;color:var(--text-3);font-style:italic;margin-bottom:4px' }, todayLabel()),
      h('p', { style: 'font-size:14px;color:var(--text-3);margin-bottom:16px;line-height:1.6' }, tr.events.desc),
      pastToggle,
      ...pastSection,
      ...upcomingSection,
    );
  }

  if (s === 'museums') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.museums),
      ...tr.monuments.map(m =>
        h('div', { className: 'monument-card' },
          h('div', { className: 'monument-head' },
            h('div', { className: 'monument-emoji' }, m.emoji),
            h('div', {},
              h('div', { className: 'monument-title' }, m.title),
              h('div', { className: 'monument-dist' }, m.dist),
            ),
          ),
          h('div', { className: 'monument-desc' }, m.desc),
          h('a', { className: 'monument-cta', href: m.link, target: '_blank' }, ms('map'), ' ', tr.openMaps),
        )
      ),
    );
  }

  if (s === 'beach') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.beach),
      h('p', { style: 'font-size:14px;color:var(--text-3);margin-bottom:20px;line-height:1.6' }, tr.beach.desc),
      h('a', { className: 'nav-btn', href: 'https://maps.app.goo.gl/G46mBB57DWUAXYkQ6', target: '_blank', style: 'background:linear-gradient(135deg,#0891b2,#0e7490);box-shadow:0 4px 18px rgba(8,145,178,.28)' },
        h('span', { className: 'nav-btn-icon' }, '🏖️'),
        h('div', {}, h('div', { className: 'nav-btn-title' }, tr.beach.btnTitle), h('div', { className: 'nav-btn-sub' }, tr.beach.btnSub)),
        ms('chevron_right', true),
      ),
    );
  }

  if (s === 'roomGuide') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.roomGuide),
      h('p', { style: 'font-size:14px;color:var(--text-3);margin-bottom:20px;line-height:1.6' }, tr.room.desc),
      h('a', { className: 'nav-btn', href: 'https://maps.app.goo.gl/Xqsaxxd7Bf8bK8hcA', target: '_blank', style: 'background:var(--toolbar);box-shadow:0 4px 18px rgba(53,79,65,.28)' },
        h('span', { className: 'nav-btn-icon' }, '🏠'),
        h('div', {}, h('div', { className: 'nav-btn-title' }, tr.room.btnTitle), h('div', { className: 'nav-btn-sub' }, tr.room.btnSub)),
        ms('chevron_right', true),
      ),
    );
  }

  if (s === 'checkout') {
    return h('div', { className: 'section-body' },
      h('h2', { className: 'section-h2' }, tr.tabs.checkout),
      h('p', { style: 'font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:4px' }, tr.co.desc1),
      h('div', { className: 'checkout-steps' },
        ...tr.co.steps.map((step, i) =>
          h('div', { className: 'checkout-step' },
            h('div', { className: 'step-num' }, String(i + 1)),
            h('div', { className: 'step-text' }, step),
          )
        )
      ),
      h('div', { className: 'checkout-note' }, tr.co.note),
      h('p', { style: 'font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:16px' }, tr.co.desc2),
      h('button', { className: 'btn-danger', onClick: doCheckout }, ms('logout'), ' ', tr.co.btn),
    );
  }

  return h('div', { className: 'section-body' }, 'Section not found');
}

function renderSection() {
  const tr = t();
  const items = menuItems();
  const currentItem = items.find(m => m.id === state.section);
  const label = currentItem ? currentItem.label : '';

  return h('div', { className: 'page' },
    h('div', { className: 'toolbar toolbar-section' },
      h('button', { className: 'back-btn', onClick: () => navigate('dashboard') }, ms('chevron_left', true), ' ', tr.back),
      langSelect(),
    ),
    h('div', { className: 'tablet-topbar', style: 'display:none' },
      h('div', { className: 'tablet-topbar-title' }, label),
    ),
    renderSectionContent(),
  );
}

// ── Main render ──────────────────────────────
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const offlineBar = renderOfflineBar();
  if (offlineBar) app.appendChild(offlineBar);

  const sidebar = renderSidebar();
  if (sidebar) app.appendChild(sidebar);

  const mainWrapper = (state.page === 'dashboard' || state.page === 'section')
    ? h('div', { className: 'main-content' })
    : h('div', {});

  let pageContent;
  if (state.page === 'home') pageContent = renderHome();
  else if (state.page === 'upload') pageContent = renderUpload();
  else if (state.page === 'dashboard') pageContent = renderDashboard();
  else if (state.page === 'section') pageContent = renderSection();

  if (pageContent) mainWrapper.appendChild(pageContent);
  app.appendChild(mainWrapper);
}

// ── Bootstrap ────────────────────────────────
window.addEventListener('online',  () => { state.isOnline = true; render(); });
window.addEventListener('offline', () => { state.isOnline = false; render(); });
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  state.installPrompt = e;
  render();
});

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
if (isIOS && !isStandalone && !localStorage.getItem('mipa_ios_hint_shown')) {
  state.showIOSHint = true;
  localStorage.setItem('mipa_ios_hint_shown', '1');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(() => {});
}

render();
