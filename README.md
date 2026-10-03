# Kerbside Bistro — Website

Premium single-page website for **Kerbside Bistro**, a cafe and restaurant at 601, Armane Nagar, 3rd Main Road, Sadashiv Nagar, Bangalore.

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
| Menu dishes and prices | Fill `items` in `js/menu-data.js`. The placeholder layout disappears automatically |
| Full menu PDF | `SITE.links.fullMenu` |
| Photographs | `SITE.images` and `SITE.gallery`. Use local paths such as `assets/img/x.jpg` or full URLs. The hero image is also in `index.html` (`<img class="hero__img">` and the preload `<link>`) |
| Brand colours and fonts | CSS variables at the top of `css/styles.css` |
| Reservations | `SITE.booking.mode`: `whatsapp` (default), `endpoint` (POST JSON to Formspree or a webhook), or `demo` |
| Online ordering | `SITE.links.order` |
| Demo annotations | Set `SITE.demoMode = false` before the public launch |
| Development credit | `SITE.credit` |

## Content integrity

Built only from the business information supplied in the brief:

- **No invented content.** There are no dishes, prices, reviews, testimonials, awards or history. Menu categories show a clearly labelled sample layout.
- **Imagery is representative.** It comes from Unsplash and is labelled "Representative imagery" while `demoMode` is on.
- **Proposed copy is labelled.** The tagline *"Good food. Great ambience. Your neighbourhood table."* and the highlight descriptions are proposed website copy for client review.
- **Bookings are enquiries.** The form never claims a reservation is confirmed. In WhatsApp mode it pre-fills a message for the guest to send.
- **Structured data omits unconfirmed facts.** The JSON-LD leaves out opening days (not supplied) and the aggregate rating (no review count supplied). Add `openingHoursSpecification` once the days are confirmed.

## Accessibility and performance

- Respects `prefers-reduced-motion`.
- Keyboard-navigable menu tabs and lightbox.
- Visible focus states and a skip link.
- Animations use transforms, opacity and clip-path only, and reveals use `IntersectionObserver`.
- Images are lazy-loaded with responsive `srcset` (AVIF/WebP via Unsplash `auto=format`).
- The hero image is preloaded.
- If an image fails to load, a branded fallback is shown.
