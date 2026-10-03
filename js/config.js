/*
 * Donne Gowdru Biriyani Mane — site configuration
 * ------------------------------------------------------------------
 * Single source of truth for business details, imagery and integrations.
 * Edit this file to update the site; no layout changes are needed.
 *
 * DEMO STATE: address, phone, hours and payment details have not been
 * supplied yet. Placeholders are shown and the Call / Directions buttons
 * show a "to be confirmed" notice until real values are entered below.
 */
window.SITE = {
  /* Shows small "demo" annotations (sample prices, representative imagery,
     proposed copy). Set to false for the final client-facing launch. */
  demoMode: true,

  name: "Donne Gowdru Biriyani Mane",
  nameKannada: "ದೊನ್ನೆ ಗೌಡ್ರು ಬಿರಿಯಾನಿ ಮನೆ",
  /* Optional logo image (SVG/PNG). When null, the typographic wordmark is used. */
  logo: null,

  address: {
    display: "Address to be confirmed",
    city: "Bengaluru",
  },

  /* Fill these in to activate Call, WhatsApp booking and the phone links:
     phone: { display: "+91 98765 43210", tel: "+919876543210", whatsapp: "919876543210" } */
  phone: {
    display: "Phone to be confirmed",
    tel: null,
    whatsapp: null,
  },

  hours: {
    display: "Hours to be confirmed",
  },

  payments: "Payment options to be confirmed",

  links: {
    /* Google Maps directions link, e.g.
       "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("<full address>") */
    directions: null,
    /* Google Maps embed URL, e.g.
       "https://www.google.com/maps?q=" + encodeURIComponent("<full address>") + "&z=16&output=embed" */
    mapEmbed: null,
    /* Link to the full menu (PDF or page). null shows a notice. */
    fullMenu: null,
    /* Online ordering link (own system or delivery partner). */
    order: null,
  },

  booking: {
    /* "whatsapp" — opens WhatsApp with a pre-filled enquiry (needs phone.whatsapp)
       "endpoint" — POSTs JSON to booking.endpoint (Formspree, webhook, etc.)
       "demo"     — validates only; nothing is sent                          */
    mode: "demo",
    endpoint: null,
    firstSlot: "12:00",
    lastSlot: "22:30",
    slotMinutes: 30,
    maxGuests: 30,
  },

  credit: {
    show: true,
    label: "Infinity Web & Apps",
    url: null,
  },

  /* Representative imagery (Unsplash photo IDs) for the demo.
     Replace with real photographs: a local path ("assets/img/biryani.jpg") or a full URL. */
  images: {
    hero: { src: "photo-1563379091339-03b21ab4a4f8", alt: "Plate of chicken biryani with whole spices" },
    experience: { src: "photo-1589302168068-964664d93dc0", alt: "Biryani being served from a large pot" },
    experienceDetail: { src: "photo-1610057099443-fde8c4d50f91", alt: "Fried chicken kabab pieces" },
    booking: { src: "photo-1585937421612-70a008356fbe", alt: "A spread of Indian non-vegetarian dishes on a table" },
  },

  gallery: [
    { src: "photo-1589302168068-964664d93dc0", alt: "Biryani in a large serving pot", caption: "From the handi", shape: "tall" },
    { src: "photo-1610057099443-fde8c4d50f91", alt: "Crisp fried chicken pieces", caption: "Chicken kabab", shape: "square" },
    { src: "photo-1563379091339-03b21ab4a4f8", alt: "Chicken biryani on a plate", caption: "Donne biryani", shape: "wide" },
    { src: "photo-1603894584373-5ac82b2ae398", alt: "Rich chicken curry in a bowl", caption: "Chicken ghee roast", shape: "square" },
    { src: "photo-1565557623262-b51c2513a641", alt: "Bowls of Indian curries", caption: "Saaru & curries", shape: "square" },
    { src: "photo-1596797038530-2c107229654b", alt: "Spiced mutton dish", caption: "Mutton pepper fry", shape: "square" },
    { src: "photo-1585937421612-70a008356fbe", alt: "Table set with several non-vegetarian dishes", caption: "The full spread", shape: "wide" },
    { src: "photo-1599043513900-ed6fe01d3833", alt: "Grilled chicken pieces with onion", caption: "Fresh off the fire", shape: "wide" },
  ],
};
