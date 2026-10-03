/*
 * Kerbside Bistro — site configuration
 * ------------------------------------------------------------------
 * Single source of truth for business facts, imagery and integrations.
 * Edit this file to update the site; no layout changes are needed.
 *
 * Every fact below was supplied by the client brief. Do not add awards,
 * reviews, history or prices here unless the business provides them.
 */
window.SITE = {
  /* Shows small "demo" annotations (sample menu, representative imagery,
     proposed copy). Set to false for the final client-facing launch. */
  demoMode: true,

  name: "Kerbside Bistro",
  /* Optional logo image (SVG/PNG). When null, the typographic wordmark is used. */
  logo: null,

  address: {
    line1: "601, Armane Nagar",
    line2: "3rd Main Road",
    locality: "Sadashiv Nagar",
    city: "Bangalore",
    region: "Karnataka",
    country: "IN",
  },

  phone: {
    display: "+91 99860 10077",
    tel: "+919986010077",
    whatsapp: "919986010077",
  },

  hours: {
    display: "9:00 AM – 9:15 PM",
    open: "09:00",
    close: "21:15",
  },

  costForTwo: "₹900",
  rating: "4.5",

  cuisines: ["Cafe", "Continental", "Italian", "American", "Fast Food", "Desserts", "Beverages"],
  highlights: ["Fresh Food", "Good Quality", "Ambience", "Service"],
  payments: "Cash, cards & digital payments accepted",

  links: {
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent("Kerbside Bistro, 601, Armane Nagar, 3rd Main Road, Sadashiv Nagar, Bangalore"),
    mapEmbed:
      "https://www.google.com/maps?q=" +
      encodeURIComponent("Kerbside Bistro, Armane Nagar, Sadashiv Nagar, Bangalore") +
      "&z=16&output=embed",
    /* Link to the full menu (PDF or page). null shows a "coming soon" notice. */
    fullMenu: null,
    /* Online ordering link (own system or delivery partner). null hides the button. */
    order: null,
    instagram: null,
  },

  booking: {
    /* "whatsapp" — opens WhatsApp with a pre-filled enquiry (no backend needed)
       "endpoint" — POSTs JSON to booking.endpoint (Formspree, webhook, etc.)
       "demo"     — validates only; nothing is sent                          */
    mode: "whatsapp",
    endpoint: null,
    firstSlot: "09:00",
    lastSlot: "21:00",
    slotMinutes: 15,
    maxGuests: 20,
  },

  credit: {
    show: true,
    label: "Infinity Web & Apps",
    url: null,
  },

  /* Unsplash photo IDs used as representative imagery for the demo.
     Replace with real photographs: either swap the ID for a local path
     (e.g. "assets/img/interior.jpg") or a full URL. */
  images: {
    hero: { src: "photo-1554118811-1e0d58224f24", alt: "Warmly lit café interior with wooden tables" },
    experience: { src: "photo-1501339847302-ac426a4a7cbb", alt: "Guests relaxing at tables in a sunlit café" },
    experienceDetail: { src: "photo-1495474472287-4d71bcdd2085", alt: "A cup of coffee on a café table" },
    visit: { src: "photo-1445116572660-236099ec97a0", alt: "Café interior with warm pendant lighting" },
    booking: { src: "photo-1559339352-11d035aa65de", alt: "Set tables in a softly lit dining room" },
  },

  gallery: [
    { src: "photo-1517248135467-4c7edcad34c4", alt: "Dining room with warm lighting and set tables", caption: "The dining room", shape: "tall" },
    { src: "photo-1509042239860-f550ce710b93", alt: "Close-up of coffee in a ceramic cup", caption: "Coffee, slowly", shape: "square" },
    { src: "photo-1565299624946-b28f40a0ae38", alt: "Pizza with fresh toppings on a wooden board", caption: "Italian plates", shape: "wide" },
    { src: "photo-1551024601-bf5c4b8c2c5b", alt: "Plated dessert", caption: "Desserts", shape: "square" },
    { src: "photo-1504674900247-0877df9cc836", alt: "Plated main course on a dark table", caption: "Continental", shape: "square" },
    { src: "photo-1461023058943-07fcbe16d735", alt: "Iced coffee in a tall glass", caption: "Beverages", shape: "square" },
    { src: "photo-1414235077428-338989a2e8c0", alt: "Elegantly plated dish", caption: "On the plate", shape: "wide" },
    { src: "photo-1521017432531-fbd92d768814", alt: "Café counter with coffee equipment", caption: "Behind the counter", shape: "wide" },
  ],
};
