/*
 * Donne Gowdru Biriyani Mane — menu data
 * ------------------------------------------------------------------
 * DEMO MENU: dish list and prices are SAMPLE content for the client
 * presentation. Replace with the restaurant's confirmed menu and prices.
 *
 * Item shape:
 *   { name: "Dish", description: "Short description", price: "₹000", tags: ["non-veg", "spicy"] }
 *
 * Diet tags (shown as the standard Indian food symbols): "non-veg", "egg", "veg".
 * Other tags: "spicy", "signature".
 */
window.MENU = [
  {
    id: "donne-biryani",
    name: "Donne Biryani",
    blurb: "Seeraga samba rice cooked with whole spices, mint and green chilli, served hot in a leaf donne.",
    image: { src: "assets/illustrations/menu-donne.svg", alt: "Illustration of chicken donne biryani with egg" },
    items: [
      { name: "Chicken Donne Biryani", description: "Tender chicken in green masala rice. The house classic.", price: "₹240", tags: ["non-veg", "signature"] },
      { name: "Mutton Donne Biryani", description: "Bone-in mutton, slow-cooked with seeraga samba rice.", price: "₹340", tags: ["non-veg", "signature"] },
      { name: "Nati Koli Biryani", description: "Country-chicken biryani, robust and rustic.", price: "₹320", tags: ["non-veg", "spicy"] },
      { name: "Kheema Biryani", description: "Minced mutton cooked into fragrant spiced rice.", price: "₹310", tags: ["non-veg"] },
      { name: "Egg Donne Biryani", description: "Two masala-roasted eggs over biryani rice.", price: "₹180", tags: ["egg"] },
      { name: "Family Pack Chicken Biryani", description: "Serves 3–4. Packed in donnes with raita and onion.", price: "₹850", tags: ["non-veg"] },
    ],
  },
  {
    id: "kababs",
    name: "Kababs & Starters",
    blurb: "Fried and roasted to order — the plate that sits beside every biryani.",
    image: { src: "assets/illustrations/menu-kabab.svg", alt: "Illustration of chicken kabab" },
    items: [
      { name: "Chicken Kabab", description: "Bengaluru-style, red-masala marinated and deep fried.", price: "₹200", tags: ["non-veg", "spicy", "signature"] },
      { name: "Chicken 65", description: "Curry leaf, green chilli and a crisp coating.", price: "₹220", tags: ["non-veg", "spicy"] },
      { name: "Pepper Chicken Dry", description: "Black pepper, onion and curry leaves.", price: "₹250", tags: ["non-veg"] },
      { name: "Chicken Lollipop", description: "Six pieces with schezwan dip.", price: "₹240", tags: ["non-veg"] },
      { name: "Fish Fry", description: "Rava-coated, pan-fried. Catch of the day.", price: "₹280", tags: ["non-veg"] },
    ],
  },
  {
    id: "chicken",
    name: "Chicken",
    blurb: "Gravies and roasts for rice, parotta or ragi mudde.",
    image: { src: "assets/illustrations/menu-chicken.svg", alt: "Illustration of chicken ghee roast" },
    items: [
      { name: "Gowdru Special Chicken", description: "House dry chicken, coconut and roasted spices.", price: "₹290", tags: ["non-veg", "spicy", "signature"] },
      { name: "Chicken Ghee Roast", description: "Red chilli and ghee, roasted down until thick.", price: "₹290", tags: ["non-veg", "spicy"] },
      { name: "Chicken Saaru", description: "Thin, peppery chicken curry for rice.", price: "₹220", tags: ["non-veg"] },
      { name: "Butter Chicken", description: "Mild tomato and butter gravy.", price: "₹280", tags: ["non-veg"] },
    ],
  },
  {
    id: "mutton",
    name: "Mutton",
    blurb: "Slow-cooked goat — fries, curries and the cuts regulars ask for.",
    image: { src: "assets/illustrations/menu-mutton.svg", alt: "Illustration of mutton pepper fry" },
    items: [
      { name: "Mutton Pepper Fry", description: "Bone-in pieces tossed with crushed pepper.", price: "₹340", tags: ["non-veg", "spicy"] },
      { name: "Mutton Chops", description: "Rib chops in a thick, dark masala.", price: "₹340", tags: ["non-veg"] },
      { name: "Mutton Kheema Fry", description: "Minced mutton with onion and green peas.", price: "₹320", tags: ["non-veg"] },
      { name: "Boti Fry", description: "Goat tripe, cleaned and fried with spices.", price: "₹260", tags: ["non-veg", "spicy"] },
      { name: "Liver Fry", description: "Quick-fried goat liver, pepper and onion.", price: "₹260", tags: ["non-veg"] },
    ],
  },
  {
    id: "nati",
    name: "Nati Specials",
    blurb: "Old Mysore village cooking — country chicken, saaru and ragi.",
    image: { src: "assets/illustrations/menu-nati.svg", alt: "Illustration of ragi mudde with saaru on a banana leaf" },
    items: [
      { name: "Ragi Mudde & Nati Koli Saaru", description: "Two ragi balls with country-chicken curry.", price: "₹320", tags: ["non-veg", "signature"] },
      { name: "Nati Koli Saaru", description: "Country-chicken curry, thin and fiery.", price: "₹280", tags: ["non-veg", "spicy"] },
      { name: "Thale Mamsa", description: "Goat-head curry, slow cooked.", price: "₹300", tags: ["non-veg"] },
      { name: "Kaal Soup", description: "Goat-trotter soup with pepper and garlic.", price: "₹160", tags: ["non-veg"] },
      { name: "Ragi Mudde", description: "Two finger-millet balls.", price: "₹60", tags: ["veg"] },
    ],
  },
  {
    id: "rice-sides",
    name: "Rice & Sides",
    blurb: "Everything else that belongs on the table.",
    image: { src: "assets/illustrations/menu-sides.svg", alt: "Illustration of parotta with egg masala" },
    items: [
      { name: "Egg Burji", description: "Scrambled eggs with onion and green chilli.", price: "₹120", tags: ["egg"] },
      { name: "Egg Masala", description: "Two boiled eggs in onion-tomato masala.", price: "₹140", tags: ["egg"] },
      { name: "Kerala Parotta", description: "Two layered parottas.", price: "₹70", tags: ["veg"] },
      { name: "Plain Rice", description: "Steamed rice.", price: "₹80", tags: ["veg"] },
      { name: "Curd Rice", description: "With pickle.", price: "₹90", tags: ["veg"] },
    ],
  },
  {
    id: "drinks-desserts",
    name: "Drinks & Desserts",
    blurb: "Something cool after the spice.",
    image: { src: "assets/illustrations/menu-drinks.svg", alt: "Illustration of majjige and gulab jamun" },
    items: [
      { name: "Majjige", description: "Spiced buttermilk with curry leaf and ginger.", price: "₹40", tags: ["veg"] },
      { name: "Lime Soda", description: "Sweet, salt or mixed.", price: "₹50", tags: ["veg"] },
      { name: "Badam Milk", description: "Chilled almond milk with saffron.", price: "₹70", tags: ["veg"] },
      { name: "Gulab Jamun", description: "Two pieces, served warm.", price: "₹60", tags: ["veg"] },
      { name: "Double Ka Meetha", description: "Bread pudding soaked in saffron milk.", price: "₹90", tags: ["veg"] },
    ],
  },
];
