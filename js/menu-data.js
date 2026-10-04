/*
 * Kerbside Bistro — menu
 * ------------------------------------------------------------------
 * PLACEHOLDER MENU. The café's actual dishes and prices have not been
 * supplied, so each category shows editable placeholder items.
 *
 * To publish the real menu, replace each category's `items`:
 *   { name: "Dish name", description: "Short description", price: "₹000",
 *     veg: true | false | null, image: "photo-…" | "assets/img/dish.jpg" }
 * Leave `placeholder` out (or false) on real items.
 */
(function () {
  const categories = [
    { id: "cafe", name: "Cafe", images: ["photo-1495474472287-4d71bcdd2085", "photo-1509042239860-f550ce710b93", "photo-1461023058943-07fcbe16d735"] },
    { id: "continental", name: "Continental", images: ["photo-1504674900247-0877df9cc836", "photo-1546069901-ba9599a7e63c", "photo-1414235077428-338989a2e8c0"] },
    { id: "italian", name: "Italian", images: ["photo-1565299624946-b28f40a0ae38", "photo-1473093295043-cdd812d0e601", "photo-1513104890138-7c749659a591"] },
    { id: "american", name: "American", images: ["photo-1568901346375-23c9450c58cd", "photo-1550547660-d9450f859349", "photo-1504674900247-0877df9cc836"] },
    { id: "fast-food", name: "Fast Food", images: ["photo-1573080496219-bb080dd4f877", "photo-1550547660-d9450f859349", "photo-1565299624946-b28f40a0ae38"] },
    { id: "desserts", name: "Desserts", images: ["photo-1578985545062-69928b1d9587", "photo-1551024601-bf5c4b8c2c5b", "photo-1488477181946-6428a0291777"] },
    { id: "beverages", name: "Beverages", images: ["photo-1461023058943-07fcbe16d735", "photo-1544145945-f90425340c7e", "photo-1509042239860-f550ce710b93"] },
  ];

  window.MENU = categories.map((c) => ({
    id: c.id,
    name: c.name,
    items: c.images.map((img, i) => ({
      name: `${c.name} dish ${String(i + 1).padStart(2, "0")}`,
      description: "Add the dish description here.",
      price: null,
      veg: null,
      image: img,
      placeholder: true,
    })),
  }));
})();
