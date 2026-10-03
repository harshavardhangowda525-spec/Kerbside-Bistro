/*
 * Kerbside Bistro — menu data
 * ------------------------------------------------------------------
 * The client brief lists cuisine categories only. No dishes or prices
 * have been supplied, so every `items` array is intentionally empty and
 * the site shows an elegant "menu to be added" layout.
 *
 * To publish the real menu, fill in `items` for each category:
 *
 *   items: [
 *     { name: "Dish name", description: "Short description", price: "₹000", tags: ["veg"] },
 *   ]
 *
 * Supported tags: "veg", "non-veg", "egg", "vegan", "spicy", "new".
 * Categories can be renamed, re-ordered, added or removed freely.
 */
window.MENU = [
  {
    id: "cafe",
    name: "Cafe",
    blurb: "All-day cafe fare for slow mornings and easy afternoons.",
    image: { src: "photo-1495474472287-4d71bcdd2085", alt: "Coffee cup on a café table" },
    items: [],
  },
  {
    id: "continental",
    name: "Continental",
    blurb: "Continental plates for a relaxed lunch or dinner.",
    image: { src: "photo-1504674900247-0877df9cc836", alt: "Plated main course" },
    items: [],
  },
  {
    id: "italian",
    name: "Italian",
    blurb: "Italian favourites, made for sharing at the table.",
    image: { src: "photo-1551183053-bf91a1d81141", alt: "Bowl of pasta" },
    items: [],
  },
  {
    id: "american",
    name: "American",
    blurb: "Generous American classics.",
    image: { src: "photo-1568901346375-23c9450c58cd", alt: "Burger on a board" },
    items: [],
  },
  {
    id: "fast-food",
    name: "Fast Food",
    blurb: "Quick bites when you're on the go.",
    image: { src: "photo-1550547660-d9450f859349", alt: "Burger and fries" },
    items: [],
  },
  {
    id: "desserts",
    name: "Desserts",
    blurb: "Something sweet to end on.",
    image: { src: "photo-1488477181946-6428a0291777", alt: "Layered dessert in a glass" },
    items: [],
  },
  {
    id: "beverages",
    name: "Beverages",
    blurb: "Hot and cold drinks for any time of day.",
    image: { src: "photo-1461023058943-07fcbe16d735", alt: "Iced coffee in a tall glass" },
    items: [],
  },
];
