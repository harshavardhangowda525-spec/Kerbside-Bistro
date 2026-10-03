# Donne Gowdru Biriyani Mane — Website

ದೊನ್ನೆ ಗೌಡ್ರು ಬಿರಿಯಾನಿ ಮನೆ

Premium single-page demo website for **Donne Gowdru Biriyani Mane**, a non-vegetarian biryani house in the Bengaluru donne-biryani style.

Static HTML, CSS and JavaScript with no build step and no third-party JavaScript.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

To deploy, upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel).

## Project structure

```
index.html        Semantic markup, SEO meta, Open Graph, JSON-LD
css/styles.css    Design tokens (:root), layout, motion, responsive rules
js/config.js      ← Business facts, images, links, booking settings
js/menu-data.js   ← Menu categories and items
js/main.js        Interactions: loader, reveals, parallax, menu, gallery, booking
assets/           Favicon (add logo and photos here)
```

## Handing over to the real content

| What | Where |
| --- | --- |
| Logo | `SITE.logo` in `js/config.js` (path to SVG/PNG), and replace `assets/favicon.svg` |
| Address, phone, hours | `SITE.address`, `SITE.phone`, `SITE.hours`, `SITE.links.directions`, `SITE.links.mapEmbed` |
| Menu dishes and prices | Edit `items` in `js/menu-data.js`. Diet tags `non-veg` / `egg` / `veg` show the standard Indian food symbols |
| Full menu PDF | `SITE.links.fullMenu` |
| Photographs | `SITE.images` and `SITE.gallery`. Use local paths such as `assets/img/x.jpg` or full URLs. The hero image is also in `index.html` (`<img class="hero__img">` and the preload `<link>`) |
| Brand colours and fonts | CSS variables at the top of `css/styles.css` |
| Reservations | `SITE.booking.mode`: `demo` (current), `whatsapp` (needs the phone number), or `endpoint` (POST JSON to Formspree or a webhook) |
| Online ordering | `SITE.links.order` |
| Demo annotations | Set `SITE.demoMode = false` before the public launch |
| Development credit | `SITE.credit` |

## Demo content — confirm before launch

This is a client demonstration. The following is **sample or placeholder content** and is labelled on the page while `demoMode` is on:

- **Menu and prices** (`js/menu-data.js`) are a sample donne-biryani / non-veg hotel menu. Replace them with the restaurant's confirmed dishes and prices.
- **Address, phone, hours and payment options** show "to be confirmed". Call and Directions buttons explain this until real values are added in `js/config.js`.
- **The map** appears automatically once `links.mapEmbed` is set.
- **Booking** runs in `demo` mode: details are checked but not sent. Set the phone number and `booking.mode = "whatsapp"` (or a form endpoint) to make it live. The form never claims a table is confirmed.
- **Services** (parcel, delivery, party orders and so on), the tagline and the About copy are proposed, for the owner to confirm.
- **Photos** are representative images from Unsplash, not photographs of the restaurant.
- **Structured data** (JSON-LD) omits address, phone and hours until they're confirmed.

## Accessibility and performance

- Respects `prefers-reduced-motion`.
- Keyboard-navigable menu tabs and lightbox.
- Visible focus states and a skip link.
- Animations use transforms, opacity and clip-path only, and reveals use `IntersectionObserver`.
- Images are lazy-loaded with responsive `srcset` (AVIF/WebP via Unsplash `auto=format`).
- The hero image is preloaded.
- If an image fails to load, a branded fallback is shown.
