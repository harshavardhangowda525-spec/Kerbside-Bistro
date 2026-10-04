/*
 * Kerbside Bistro — site configuration
 * ------------------------------------------------------------------
 * One place for business facts, images, links and integrations.
 * Everything on the page that comes from here updates automatically.
 *
 * Facts below come from the client brief. Menu items, offers and
 * reviews are placeholders until the café supplies real content.
 */
window.SITE = {
  /* Shows small "placeholder" labels on demo content. Set to false at launch. */
  demoMode: true,

  name: "Kerbside Bistro",
  address: {
    line1: "601, Armane Nagar",
    line2: "3rd Main Road",
    locality: "Sadashiv Nagar",
    city: "Bangalore",
    full: "601, Armane Nagar, 3rd Main Road, Sadashiv Nagar, Bangalore",
  },
  geo: { lat: 13.0078134922, lng: 77.5779666804 },
  phone: { display: "+91 99860 10077", tel: "+919986010077", whatsapp: "919986010077" },
  hours: { display: "9:00 AM – 9:15 PM", short: "9 AM – 9:15 PM" },
  costForTwo: 900,
  rating: { value: 4.5, count: 46 },
  payments: "Cash, cards and digital payments accepted",

  links: {
    directions: "https://www.google.com/maps/dir/?api=1&destination=13.0078134922,77.5779666804",
    mapEmbed: "https://www.google.com/maps?q=13.0078134922,77.5779666804&z=17&output=embed",
    fullMenu: null, // link to a PDF or menu page
    reviews: null, // e.g. the café's Google or Zomato reviews page
    gallery: null, // e.g. Instagram profile
  },

  booking: {
    /* "whatsapp" opens WhatsApp with the request filled in.
       "endpoint" POSTs JSON to booking.endpoint (Formspree, webhook…). */
    mode: "whatsapp",
    endpoint: null,
    firstSlot: "09:00",
    lastSlot: "20:45",
    slotMinutes: 15,
    maxGuests: 20,
  },

  credit: { show: true, label: "Infinity Web & Apps", url: null },

  /* ---------------------------------------------------------------
     Images: Unsplash photo IDs ("photo-…") are representative stock
     photography for the demo. Replace with the café's own photos by
     using a local path ("assets/img/latte.jpg") or a full URL.
     --------------------------------------------------------------- */
  images: {
    hero: { src: "photo-1554118811-1e0d58224f24", alt: "Warmly lit café interior with wooden tables" },
    heroCup: { src: "photo-1495474472287-4d71bcdd2085", alt: "Cup of coffee on a café table" },
    about: { src: "photo-1501339847302-ac426a4a7cbb", alt: "Guests relaxing in a sunlit café" },
    aboutSmall: { src: "photo-1509042239860-f550ce710b93", alt: "Close-up of coffee in a ceramic cup" },
    menu: { src: "photo-1414235077428-338989a2e8c0", alt: "Plated dish on a restaurant table" },
    experience: { src: "photo-1517248135467-4c7edcad34c4", alt: "Café dining room with warm lighting" },
    booking: { src: "photo-1559339352-11d035aa65de", alt: "Set tables in a softly lit dining room" },
    final: { src: "photo-1445116572660-236099ec97a0", alt: "Café interior with pendant lights" },
  },

  /* Cuisine showcase (horizontal scroll). `menu` links to a menu tab. */
  cuisines: [
    { name: "Cafe", text: "Coffee, café favourites and relaxing moments.", src: "photo-1495474472287-4d71bcdd2085", menu: "cafe" },
    { name: "Continental", text: "Comforting Continental-inspired dishes.", src: "photo-1504674900247-0877df9cc836", menu: "continental" },
    { name: "Italian", text: "Italian favourites in a modern bistro setting.", src: "photo-1565299624946-b28f40a0ae38", menu: "italian" },
    { name: "American", text: "Popular American-style comfort food.", src: "photo-1568901346375-23c9450c58cd", menu: "american" },
    { name: "Fast Food", text: "Quick, satisfying favourites.", src: "photo-1573080496219-bb080dd4f877", menu: "fast-food" },
    { name: "Desserts", text: "Sweet treats for the perfect finish.", src: "photo-1578985545062-69928b1d9587", menu: "desserts" },
    { name: "Beverages", text: "Refreshing and comforting drinks.", src: "photo-1461023058943-07fcbe16d735", menu: "beverages" },
  ],

  /* Featured food strip. `dish` is a placeholder for a real dish name. */
  featured: [
    { name: "Coffee", text: "From your first cup of the morning to an afternoon pick-me-up.", dish: null, src: "photo-1509042239860-f550ce710b93", menu: "cafe" },
    { name: "Pasta", text: "Comforting bowls made for slow lunches.", dish: null, src: "photo-1473093295043-cdd812d0e601", menu: "italian" },
    { name: "Burgers", text: "Stacked, juicy and built for sharing — or not.", dish: null, src: "photo-1550547660-d9450f859349", menu: "american" },
    { name: "Pizza", text: "Italian favourites, straight to the table.", dish: null, src: "photo-1513104890138-7c749659a591", menu: "italian" },
    { name: "Fast Food", text: "Quick bites when you're short on time.", dish: null, src: "photo-1573080496219-bb080dd4f877", menu: "fast-food" },
    { name: "Desserts", text: "Something sweet to end on.", dish: null, src: "photo-1551024601-bf5c4b8c2c5b", menu: "desserts" },
    { name: "Beverages", text: "Cool, warm, sweet or strong.", dish: null, src: "photo-1544145945-f90425340c7e", menu: "beverages" },
  ],

  /* Offers: placeholders. Replace with real offers and their terms. */
  offers: [
    { label: "Special Offer", title: "Your offer title", text: "A short description of the offer and when it applies.", cta: "Claim Offer", placeholder: true },
    { label: "Weekday Special", title: "Your offer title", text: "A short description of the offer and when it applies.", cta: "Claim Offer", placeholder: true },
    { label: "For Groups", title: "Your offer title", text: "A short description of the offer and when it applies.", cta: "Claim Offer", placeholder: true },
  ],

  /* Reviews: placeholders. Paste real guest reviews (with permission) here. */
  reviews: [
    { text: "Paste a real guest review here. Keep it short — two or three sentences work best.", name: "Guest name", source: "Source (e.g. Google)", placeholder: true },
    { text: "Paste a real guest review here. Keep it short — two or three sentences work best.", name: "Guest name", source: "Source (e.g. Zomato)", placeholder: true },
    { text: "Paste a real guest review here. Keep it short — two or three sentences work best.", name: "Guest name", source: "Source", placeholder: true },
  ],

  gallery: [
    { src: "photo-1565299624946-b28f40a0ae38", alt: "Pizza with fresh toppings", cat: "Food" },
    { src: "photo-1554118811-1e0d58224f24", alt: "Café interior with wooden tables", cat: "Interior" },
    { src: "photo-1495474472287-4d71bcdd2085", alt: "Cup of coffee on a table", cat: "Coffee" },
    { src: "photo-1578985545062-69928b1d9587", alt: "Slice of chocolate cake", cat: "Desserts" },
    { src: "photo-1529156069898-49953e39b3ac", alt: "Friends laughing together", cat: "People & Moments" },
    { src: "photo-1517248135467-4c7edcad34c4", alt: "Warmly lit dining room", cat: "Ambience" },
    { src: "photo-1568901346375-23c9450c58cd", alt: "Burger on a wooden board", cat: "Food" },
    { src: "photo-1509042239860-f550ce710b93", alt: "Coffee in a ceramic cup", cat: "Coffee" },
    { src: "photo-1488477181946-6428a0291777", alt: "Layered dessert in a glass", cat: "Desserts" },
    { src: "photo-1521017432531-fbd92d768814", alt: "Café counter with coffee equipment", cat: "Interior" },
    { src: "photo-1445116572660-236099ec97a0", alt: "Pendant lights over café tables", cat: "Ambience" },
    { src: "photo-1473093295043-cdd812d0e601", alt: "Bowl of pasta", cat: "Food" },
  ],
};
