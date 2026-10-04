# Kerbside Bistro — Website

A premium, motion-led single-page website for **Kerbside Bistro**, a café at 601, Armane Nagar, 3rd Main Road, Sadashiv Nagar, Bangalore.

It's plain HTML, CSS and JavaScript, with no build step and no third-party JavaScript. Fonts load from Google Fonts. Photos are hotlinked from Unsplash and serve as representative stock imagery for the demo.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Choose **Deploy from a branch** and pick `main` (or the preview branch) with the `/ (root)` folder.
3. The site will be live at `https://harshavardhangowda525-spec.github.io/Kerbside-Bistro/`.

The canonical URL, Open Graph URL, `sitemap.xml` and `robots.txt` all use that address. Update them if you connect a custom domain.

## Files

```
index.html       Semantic markup, SEO meta, Open Graph, Restaurant JSON-LD
css/styles.css   Design tokens (:root), layouts, motion system, responsive rules
js/config.js     ← Business facts, images, cuisines, featured food, offers, reviews, gallery, booking
js/menu-data.js  ← Menu categories and items (placeholders until the real menu is supplied)
js/main.js       Intro, scroll engine, parallax, pinned food story, menu tabs, lightbox, cursor, booking
sitemap.xml, robots.txt, assets/favicon.svg
```

## Replacing demo content

| What | Where |
| --- | --- |
| Photos | Swap the Unsplash IDs in `js/config.js` and `js/menu-data.js` for the café's own photos (`assets/img/…` or full URLs). The hero image also appears in `index.html` (the `<img class="hero__img">` tag and the preload link). |
| Menu | Replace `items` in `js/menu-data.js` with real dishes: `name`, `description`, `price`, `veg` (true/false) and `image`. |
| Featured dishes | Set `dish` on each entry in `SITE.featured`. |
| Offers | Edit `SITE.offers` and set `placeholder: false`. |
| Reviews | Paste real guest reviews (with permission) into `SITE.reviews` and set `placeholder: false`. |
| Full menu, reviews and gallery links | `SITE.links.fullMenu`, `SITE.links.reviews`, `SITE.links.gallery` |
| Booking | `SITE.booking.mode`: `whatsapp` (current) or `endpoint` (POSTs JSON to Formspree or a webhook). |
| Demo labels | Set `SITE.demoMode = false` at launch. |
| Brand colours and fonts | CSS variables at the top of `css/styles.css` |

## Content integrity

- **Business facts come only from the client brief:** address, phone, hours, cost for two, the 4.5 rating from 46 dining ratings, cuisines and payments.
- **Placeholders are labelled:** menu items, prices, offers and reviews are clearly marked and are not invented.
- **Booking never claims confirmation:** the form prepares a WhatsApp enquiry and says the table is confirmed only once the café replies.
- **Structured data:**
  - The rating is not in the JSON-LD. Google's review-snippet rules don't allow third-party ratings in a business's own markup.
  - Opening hours are marked as daily, 9:00–21:15. Confirm the days with the café.
- **Search Console:** paste your verification meta tag where indicated in `index.html`, then submit `sitemap.xml`.

## Accessibility and performance

- **Motion and comfort:**
  - Every animation respects `prefers-reduced-motion`.
  - The intro is about 1.5 seconds, and shorter on repeat visits.
  - The custom cursor and mouse-driven effects only run on desktop pointers.
- **One efficient scroll loop:** a single `requestAnimationFrame` loop drives all scroll-linked motion, and only `transform`, `opacity`, `clip-path` and `filter` are animated.
- **Images:** they are lazy-loaded with responsive `srcset`, and Unsplash's `auto=format` serves AVIF or WebP. The hero image is preloaded.
- **Keyboard and screen readers:** the menu tabs, gallery and lightbox all work from the keyboard. Focus states are visible, and there's a skip link and ARIA labelling.
