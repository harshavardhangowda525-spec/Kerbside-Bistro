/*
 * Kerbside Bistro — interactions & motion
 * Dependency-free. Content comes from window.SITE (config.js) and window.MENU (menu-data.js).
 * One rAF-driven scroll loop feeds a `--p` (0–1 progress) custom property to
 * [data-p] elements; CSS turns that into parallax, scaling and reveals.
 */
(() => {
  "use strict";

  const S = window.SITE || {};
  const MENU = window.MENU || [];
  const doc = document, root = doc.documentElement, body = doc.body;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ------------------------------------------------------------------ images */
  const isUnsplash = (s) => /^photo-[\w-]+$/.test(s);
  const url = (s, w) => (isUnsplash(s) ? `https://images.unsplash.com/${s}?w=${w}&q=70&auto=format&fit=crop` : s);
  function setImg(img, src, alt, sizes = "100vw", widths = [480, 900, 1400, 2000], label) {
    if (!img || !src) return;
    const wrap = img.parentElement;
    img.addEventListener("error", () => { wrap.classList.add("img-fb"); if (label) wrap.dataset.fb = label; }, { once: true });
    if (isUnsplash(src)) { img.srcset = widths.map((w) => `${url(src, w)} ${w}w`).join(", "); img.sizes = sizes; }
    img.src = url(src, widths[1] || widths[0]);
    if (alt !== undefined) img.alt = alt;
  }
  const IMGS = S.images || {};
  $$("[data-img]").forEach((img) => {
    const d = IMGS[img.dataset.img];
    if (d) setImg(img, d.src, d.alt, img.dataset.img === "aboutSmall" || img.dataset.img === "heroCup" ? "(max-width: 860px) 40vw, 22vw" : "(max-width: 860px) 100vw, 60vw");
  });
  const heroImg = $(".hero__img");
  if (heroImg) {
    const fb = () => heroImg.parentElement.classList.add("img-fb");
    if (heroImg.complete && heroImg.naturalWidth === 0) fb(); else heroImg.addEventListener("error", fb, { once: true });
  }

  /* ------------------------------------------------------------------ bindings */
  if (!S.demoMode) body.classList.add("no-demo");
  const waText = encodeURIComponent(`Hello ${S.name || "Kerbside Bistro"}, I'd like to make an enquiry.`);
  const hrefs = {
    directions: S.links && S.links.directions,
    whatsapp: S.phone && S.phone.whatsapp ? `https://wa.me/${S.phone.whatsapp}?text=${waText}` : null,
  };
  $$("[data-href]").forEach((a) => { const v = hrefs[a.dataset.href]; if (v) a.href = v; });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  const credit = $("[data-credit]");
  if (credit && (!S.credit || !S.credit.show)) credit.remove();
  else if (credit && S.credit.url) credit.innerHTML = `Designed &amp; developed by <a href="${esc(S.credit.url)}" target="_blank" rel="noopener">${esc(S.credit.label)}</a>`;

  /* ------------------------------------------------------------------ toast */
  const toastEl = $(".toast");
  let toastT;
  function toast(html, ms = 5000) {
    toastEl.innerHTML = html; toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("is-on"));
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.classList.remove("is-on"); setTimeout(() => (toastEl.hidden = true), 500); }, ms);
  }
  const telLink = `<a href="tel:${S.phone.tel}">${S.phone.display}</a>`;

  /* ------------------------------------------------------------------ render: cuisines */
  const railTrack = $("[data-cuisines]");
  railTrack.innerHTML = (S.cuisines || []).map((c, i) => `
    <li class="ci" style="--i:${i}">
      <a href="#menu" data-menu-link="${esc(c.menu)}" data-cursor="explore">
        <img alt="${esc(c.name)} at Kerbside Bistro (representative photo)" loading="lazy" draggable="false" />
        <span class="ci__n">${pad(i + 1)} / ${pad(S.cuisines.length)}</span>
        <h3><span>${esc(c.name)}</span></h3>
        <p>${esc(c.text)}</p>
        <span class="ci__go">Explore <i></i></span>
      </a>
    </li>`).join("");
  $$(".ci img", railTrack).forEach((img, i) => setImg(img, S.cuisines[i].src, undefined, "(max-width: 860px) 78vw, 30vw", [480, 800, 1200], S.cuisines[i].name));

  /* ------------------------------------------------------------------ render: featured */
  const featTrack = $("[data-featured]");
  const feats = S.featured || [];
  featTrack.innerHTML = feats.map((f, i) => `
    <li class="fc">
      <a class="fc__card" href="#menu" data-menu-link="${esc(f.menu)}" data-cursor="view">
        <img alt="${esc(f.name)} (representative photo)" loading="lazy" />
        <div class="fc__body">
          <span class="fc__k">${pad(i + 1)} · Featured</span>
          <h3>${esc(f.name)}</h3>
          <span class="fc__line"></span>
          <div class="fc__more"><div>
            <p>${esc(f.text)}</p>
            <p class="fc__dish">${f.dish ? esc(f.dish) : '<span class="tag">Dish name to be added</span>'}</p>
          </div></div>
          <span class="fc__cta">See in menu →</span>
        </div>
      </a>
    </li>`).join("");
  $$(".fc img", featTrack).forEach((img, i) => setImg(img, feats[i].src, undefined, "(max-width: 860px) 80vw, 30vw", [480, 800, 1200], feats[i].name));
  $("[data-feat-total]").textContent = pad(feats.length);

  /* ------------------------------------------------------------------ render: offers & reviews */
  $("[data-offers]").innerHTML = (S.offers || []).map((o) => `
    <li class="oc" data-glow>
      <i class="oc__deco" aria-hidden="true"></i>
      <span class="oc__label">${esc(o.label)}</span>
      <h3>${esc(o.title)}</h3>
      <p>${esc(o.text)}</p>
      ${o.placeholder ? '<span class="tag">Placeholder</span>' : ""}
      <button type="button" class="btn btn--accent btn--sm mag" data-claim="${o.placeholder ? "1" : ""}" data-cursor="open"><span class="btn__t">${esc(o.cta || "Claim Offer")}</span></button>
    </li>`).join("");
  $("[data-reviews]").innerHTML = (S.reviews || []).map((r) => `
    <li class="rc">
      <span class="rc__q" aria-hidden="true">“</span>
      <p class="rc__stars">${r.placeholder ? "Placeholder review" : "★★★★★"}</p>
      <p>${esc(r.text)}</p>
      <footer><span class="rc__av" aria-hidden="true">${esc((r.name || "?").charAt(0))}</span><strong>${esc(r.name)}</strong><span>· ${esc(r.source || "")}</span></footer>
    </li>`).join("");

  /* ------------------------------------------------------------------ render: gallery */
  const gal = S.gallery || [];
  const galEl = $("[data-gallery]");
  const shapes = ["t", "s", "w"];
  const speeds = [-60, 40, -20];
  galEl.innerHTML = gal.map((g, i) => `
    <div class="gi__par" data-p="through" data-cat="${esc(g.cat)}" style="--sp:${speeds[i % 3]}px">
      <button type="button" class="gi gi--${shapes[i % 3]} rv-img" style="--d:${i % 3}" data-index="${i}" data-cursor="view" aria-label="Open image: ${esc(g.alt)}">
        <img alt="${esc(g.alt)} (representative photo)" loading="lazy" />
        <span class="gi__ov"><b>${esc(g.cat)}</b><span>${esc(g.alt)}</span></span>
      </button>
    </div>`).join("");
  $$(".gi img", galEl).forEach((img, i) => setImg(img, gal[i].src, undefined, "(max-width: 860px) 46vw, 30vw", [480, 800, 1200], gal[i].cat));
  const cats = ["All", "Food", "Coffee", "Desserts", "Interior", "Ambience", "People & Moments"];
  const filters = $("[data-gal-filters]");
  filters.innerHTML = cats.map((c, i) => `<button type="button" class="chip" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", c === b));
    const cat = b.dataset.cat;
    $$(".gi__par", galEl).forEach((p) => {
      const show = cat === "All" || p.dataset.cat === cat;
      p.classList.toggle("is-hidden", !show);
      if (show) { const g = $(".gi", p); g.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add("is-in"))); }
    });
  });

  /* ------------------------------------------------------------------ menu */
  const tabsEl = $("[data-tabs]");
  const ink = $(".tabs__ink", tabsEl);
  const grid = $("[data-menu-grid]");
  const tabDefs = [{ id: "all", name: "All" }, ...MENU.map((c) => ({ id: c.id, name: c.name }))];
  tabsEl.insertAdjacentHTML("afterbegin", tabDefs.map((t, i) =>
    `<button type="button" class="tab" role="tab" id="tab-${t.id}" aria-selected="${i === 0}" aria-controls="menu-panel" data-tab="${t.id}" tabindex="${i === 0 ? 0 : -1}" data-cursor="menu">${esc(t.name)}</button>`).join(""));
  grid.id = "menu-panel"; grid.setAttribute("role", "tabpanel");
  let curTab = "all", tabBusy = false;

  function itemsFor(id) {
    if (id === "all") return MENU.flatMap((c) => c.items.slice(0, 2).map((it) => ({ ...it, cat: c.name })));
    const c = MENU.find((m) => m.id === id);
    return c ? c.items.map((it) => ({ ...it, cat: c.name })) : [];
  }
  function vegMark(v) {
    if (v === true) return '<i class="veg" role="img" aria-label="Vegetarian"></i><span>Veg</span>';
    if (v === false) return '<i class="veg veg--non" role="img" aria-label="Non-vegetarian"></i><span>Non-veg</span>';
    return '<i class="veg veg--unknown" aria-hidden="true"></i><span>Diet TBC</span>';
  }
  function renderItems(id) {
    const items = itemsFor(id);
    grid.innerHTML = items.map((it, i) => `
      <li class="mi" style="--i:${i}">
        <div class="mi__img"><img alt="${esc(it.name)}" loading="lazy" /></div>
        <div class="mi__body">
          <div class="mi__top"><h3>${esc(it.name)}</h3><span class="mi__price ${it.price ? "" : "mi__price--ph"}">${it.price ? esc(it.price) : "₹ —"}</span></div>
          <p>${esc(it.description || "")}</p>
          <div class="mi__meta">${vegMark(it.veg)}${it.placeholder ? '<span class="tag">Placeholder</span>' : ""}</div>
        </div>
      </li>`).join("");
    $$(".mi img", grid).forEach((img, i) => setImg(img, items[i].image, undefined, "110px", [160, 240], items[i].cat));
  }
  function moveInk() {
    const t = $(`.tab[aria-selected="true"]`, tabsEl);
    if (!t) return;
    ink.style.width = `${t.offsetWidth}px`;
    ink.style.transform = `translateX(${t.offsetLeft}px)`;
  }
  function selectTab(id, focus) {
    if (id === curTab || tabBusy) return;
    curTab = id;
    $$(".tab", tabsEl).forEach((t) => { const on = t.dataset.tab === id; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    grid.setAttribute("aria-labelledby", `tab-${id}`);
    moveInk();
    const t = $(`.tab[aria-selected="true"]`, tabsEl);
    if (t) tabsEl.scrollTo({ left: t.offsetLeft - 40, behavior: reduce ? "auto" : "smooth" });
    if (reduce) return renderItems(id);
    tabBusy = true;
    grid.style.minHeight = `${grid.offsetHeight}px`;
    $$(".mi", grid).forEach((m) => m.classList.add("is-out"));
    setTimeout(() => { renderItems(id); grid.style.minHeight = ""; tabBusy = false; }, 260);
  }
  tabsEl.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) selectTab(t.dataset.tab); });
  tabsEl.addEventListener("keydown", (e) => {
    const ids = tabDefs.map((t) => t.id), i = ids.indexOf(curTab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); selectTab(ids[(i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length], true); }
  });
  renderItems("all");
  grid.setAttribute("aria-labelledby", "tab-all");
  addEventListener("resize", moveInk);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(moveInk);
  setTimeout(moveInk, 50);

  doc.addEventListener("click", (e) => {
    const a = e.target.closest("[data-menu-link]");
    if (!a) return;
    if (dragged) { e.preventDefault(); return; }
    const id = a.dataset.menuLink;
    if (MENU.some((m) => m.id === id)) { curTab = curTab === id ? "" : curTab; tabBusy = false; selectTab(id); }
  });

  $("[data-full-menu]").addEventListener("click", () => {
    if (S.links.fullMenu) window.open(S.links.fullMenu, "_blank", "noopener");
    else toast(`The full menu will be linked here once Kerbside Bistro shares it. For today's menu, call ${telLink}.`);
  });
  $("[data-full-gallery]").addEventListener("click", () => {
    if (S.links.gallery) window.open(S.links.gallery, "_blank", "noopener");
    else toast("The full gallery (e.g. Kerbside Bistro's Instagram) will be linked here.");
  });
  $("[data-more-reviews]").addEventListener("click", () => {
    if (S.links.reviews) window.open(S.links.reviews, "_blank", "noopener");
    else toast("This will link to Kerbside Bistro's reviews page once it's provided.");
  });
  doc.addEventListener("click", (e) => {
    const b = e.target.closest("[data-claim]");
    if (!b) return;
    if (b.dataset.claim) toast(`Offers are placeholders for now. To ask about current offers, call ${telLink}.`);
    else if (hrefs.whatsapp) window.open(hrefs.whatsapp, "_blank", "noopener");
  });

  /* ------------------------------------------------------------------ stagger indices */
  $$(".st").forEach((g) => Array.from(g.children).forEach((c, i) => c.style.setProperty("--i", i)));
  $$(".hero__cuisines li").forEach((li, i) => li.style.setProperty("--i", i));
  $$(".hero .w > span").forEach((w, i) => w.style.setProperty("--wd", `${0.25 + i * 0.12 + Math.floor(i / 2) * 0.12}s`));
  $$(".final .w > span").forEach((w, i) => w.style.setProperty("--wd", `${i * 0.09}s`));

  /* ------------------------------------------------------------------ count-up */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || "0", 10);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1700;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = (to * (1 - Math.pow(1 - p, 4))).toFixed(dec); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ reveals */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    if (e.target.dataset.count) countUp(e.target);
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv, .rv-img, .st, .book, .final, .rail, .info__list, .reviews__score, [data-count]").forEach((el) => io.observe(el));

  /* ------------------------------------------------------------------ scroll engine */
  const nav = $(".nav"), bar = $(".progress span"), dock = $(".dock");
  const pEls = $$("[data-p]");
  const parImgs = $$("[data-par]");
  const featured = $(".featured"), featPin = $(".featured__pin"), featCards = $$(".fc", featTrack), featIdx = $("[data-feat-index]"), featBar = $(".featured__bar");
  let lastY = scrollY, ticking = false, pinned = false, featMax = 0, activeFeat = -1, formFocus = false;

  function setupPin() {
    pinned = !reduce && innerWidth > 860;
    featured.classList.toggle("is-pinned", pinned);
    featTrack.style.transform = "";
    if (!pinned) { featured.style.height = ""; return; }
    featMax = Math.max(0, featTrack.scrollWidth - innerWidth);
    featured.style.height = `${innerHeight + featMax}px`;
  }

  function frame() {
    ticking = false;
    const y = scrollY, vh = innerHeight, max = root.scrollHeight - vh;
    nav.classList.toggle("is-solid", y > 40);
    if (!body.classList.contains("drawer-open")) nav.classList.toggle("is-hidden", y > lastY + 2 && y > vh);
    if (y < lastY - 2) nav.classList.remove("is-hidden");
    bar.style.transform = `scaleY(${max > 0 ? y / max : 0})`;
    if (dock) dock.classList.toggle("is-on", y > vh * 0.6 && !formFocus);
    lastY = y;
    if (reduce) return;

    for (const el of pEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) continue;
      const p = el.dataset.p === "enter" ? clamp((vh - r.top) / (vh * 0.65), 0, 1) : clamp((vh - r.top) / (vh + r.height), 0, 1);
      el.style.setProperty("--p", p.toFixed(4));
    }
    for (const img of parImgs) {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const o = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.translate = `0 ${(o * parseFloat(img.dataset.par) * -100).toFixed(2)}%`;
    }
    if (pinned) {
      const r = featured.getBoundingClientRect();
      const p = clamp(-r.top / (featured.offsetHeight - vh), 0, 1);
      featTrack.style.transform = `translate3d(${-p * featMax}px,0,0)`;
      featBar.style.setProperty("--fp", p.toFixed(4));
      const idx = Math.round(p * (featCards.length - 1));
      if (idx !== activeFeat) {
        activeFeat = idx;
        featCards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
        featIdx.textContent = pad(idx + 1);
      }
    }
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { setupPin(); onScroll(); }, { passive: true });
  setupPin();
  frame();
  if (!pinned) {
    // swipe mode: update the counter from the native scroll position
    featTrack.addEventListener("scroll", () => {
      const w = featCards[0] ? featCards[0].offsetWidth : 1;
      featIdx.textContent = pad(clamp(Math.round(featTrack.scrollLeft / w), 0, featCards.length - 1) + 1);
      featBar.style.setProperty("--fp", (featTrack.scrollLeft / Math.max(1, featTrack.scrollWidth - featTrack.clientWidth)).toFixed(4));
    }, { passive: true });
  }

  // active nav link
  const links = $$(".nav__links a");
  const so = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["home", "about", "menu", "gallery", "offers", "reviews", "contact"].forEach((id) => { const s = doc.getElementById(id); if (s) so.observe(s); });

  /* ------------------------------------------------------------------ rail: buttons + drag */
  let dragged = false;
  $$("[data-rail]").forEach((b) => b.addEventListener("click", () => {
    const step = ($(".ci", railTrack) || { offsetWidth: 300 }).offsetWidth + 20;
    railTrack.scrollBy({ left: step * Number(b.dataset.rail), behavior: reduce ? "auto" : "smooth" });
  }));
  if (fine) {
    let down = false, sx = 0, sl = 0;
    railTrack.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; dragged = false; sx = e.clientX; sl = railTrack.scrollLeft; });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { dragged = true; railTrack.classList.add("is-drag"); }
      if (dragged) railTrack.scrollLeft = sl - dx;
    });
    addEventListener("pointerup", () => { if (!down) return; down = false; railTrack.classList.remove("is-drag"); setTimeout(() => (dragged = false), 0); });
  }

  /* ------------------------------------------------------------------ drawer */
  const burger = $(".burger"), drawer = $("#drawer");
  const setDrawer = (open) => {
    body.classList.toggle("drawer-open", open);
    burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.setAttribute("aria-hidden", !open); body.style.overflow = open ? "hidden" : "";
    nav.classList.remove("is-hidden");
  };
  burger.addEventListener("click", () => setDrawer(!body.classList.contains("drawer-open")));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  doc.addEventListener("keydown", (e) => { if (e.key === "Escape" && body.classList.contains("drawer-open")) { setDrawer(false); burger.focus(); } });

  /* ------------------------------------------------------------------ lightbox */
  const lb = $(".lb"), lbImg = $(".lb__fig img", lb);
  let lbI = 0, lbFrom = null;
  const visibleGal = () => $$(".gi__par:not(.is-hidden) .gi", galEl).map((b) => Number(b.dataset.index));
  function showLb(i) {
    const list = visibleGal(); const pos = (list.indexOf(lbI) + i + list.length) % list.length;
    lbI = list[pos];
    const g = gal[lbI];
    lbImg.classList.remove("is-on");
    setTimeout(() => {
      lbImg.onload = lbImg.onerror = () => lbImg.classList.add("is-on");
      lbImg.src = url(g.src, 1800); lbImg.alt = g.alt;
      $(".lb__cap", lb).textContent = `${g.cat} — ${g.alt}`;
      $(".lb__n", lb).textContent = `${pad(pos + 1)} / ${pad(list.length)}`;
    }, reduce ? 0 : 200);
  }
  galEl.addEventListener("click", (e) => {
    const b = e.target.closest(".gi"); if (!b) return;
    lbFrom = b; lbI = Number(b.dataset.index); lb.hidden = false; body.style.overflow = "hidden";
    requestAnimationFrame(() => lb.classList.add("is-open")); showLb(0); $(".lb__close", lb).focus();
  });
  const closeLb = () => { lb.classList.remove("is-open"); body.style.overflow = ""; setTimeout(() => (lb.hidden = true), reduce ? 0 : 450); if (lbFrom) lbFrom.focus(); };
  $(".lb__close", lb).addEventListener("click", closeLb);
  $(".lb__prev", lb).addEventListener("click", () => showLb(-1));
  $(".lb__next", lb).addEventListener("click", () => showLb(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  doc.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showLb(1);
    if (e.key === "ArrowLeft") showLb(-1);
    if (e.key === "Tab") { const f = $$("button", lb); if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showLb(dx < 0 ? 1 : -1); tx = null; });

  /* ------------------------------------------------------------------ desktop micro-interactions */
  if (fine && !reduce) {
    // cursor
    const cur = $(".cursor"), curLabel = $(".cursor__label", cur);
    let mx = -100, my = -100, cx = -100, cy = -100;
    root.classList.add("has-cursor");
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    doc.addEventListener("pointerleave", () => cur.classList.add("is-off"));
    doc.addEventListener("pointerenter", () => cur.classList.remove("is-off"));
    (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); })();
    const labels = { view: "VIEW", menu: "MENU", book: "BOOK", open: "OPEN", explore: "EXPLORE" };
    doc.addEventListener("pointerover", (e) => {
      const t = e.target;
      const c = t.closest("[data-cursor]");
      const label = c && labels[c.dataset.cursor];
      cur.classList.toggle("is-label", !!label);
      if (label) curLabel.textContent = label;
      cur.classList.toggle("is-link", !label && !!t.closest("a, button, input, select, textarea, label"));
      cur.classList.toggle("is-off", !!t.closest("iframe, .lb"));
    });

    // magnetic buttons + glow
    $$(".mag").forEach((el) => {
      const t = $(".btn__t", el);
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = `${dx * 0.2}px ${dy * 0.3}px`;
        if (t) t.style.translate = `${dx * 0.08}px ${dy * 0.1}px`;
        el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      el.addEventListener("pointerleave", () => { el.style.translate = "0 0"; if (t) t.style.translate = "0 0"; });
    });

    // featured card tilt
    $$(".fc__card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`); card.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => { card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg"); });
    });

    // hero mouse depth
    const hero = $(".hero"), depth = $$("[data-depth]", hero);
    hero.addEventListener("pointermove", (e) => {
      const px = e.clientX / innerWidth - 0.5, py = e.clientY / innerHeight - 0.5;
      depth.forEach((d) => { const k = parseFloat(d.dataset.depth); d.style.transform = `translate3d(${(-px * k).toFixed(1)}px, ${(-py * k).toFixed(1)}px, 0)`; });
    });
  }
  $$("[data-glow]").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect(); c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  /* ------------------------------------------------------------------ hero particles */
  if (!reduce) {
    const pw = $(".hero__particles");
    const n = innerWidth < 860 ? 10 : 22;
    pw.innerHTML = Array.from({ length: n }, () => {
      const s = (Math.random() * 3 + 1.5).toFixed(1);
      return `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(30 + Math.random() * 70).toFixed(1)}%;width:${s}px;height:${s}px;--o:${(0.3 + Math.random() * 0.5).toFixed(2)};--dx:${(Math.random() * 60 - 30).toFixed(0)}px;animation-duration:${(7 + Math.random() * 8).toFixed(1)}s;animation-delay:${(-Math.random() * 12).toFixed(1)}s"></i>`;
    }).join("");
  }

  /* ------------------------------------------------------------------ booking */
  const form = $("[data-booking]");
  const B = S.booking || {};
  const dateIn = form.elements.date, timeIn = form.elements.time, gIn = form.elements.guests, status = $("[data-booking-status]", form);
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const fmt12 = (m) => `${((Math.floor(m / 60) + 11) % 12) + 1}:${pad(m % 60)} ${m < 720 ? "AM" : "PM"}`;
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = iso(new Date());
  dateIn.min = today;
  for (let t = toMin(B.firstSlot || "09:00"); t <= toMin(B.lastSlot || "20:45"); t += B.slotMinutes || 15) {
    const o = doc.createElement("option"); o.value = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`; o.textContent = fmt12(t); timeIn.appendChild(o);
  }
  dateIn.addEventListener("change", () => {
    const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
    Array.from(timeIn.options).forEach((o) => { if (o.value) o.disabled = dateIn.value === today && toMin(o.value) <= nm; });
    if (timeIn.selectedOptions[0] && timeIn.selectedOptions[0].disabled) timeIn.value = "";
  });
  gIn.max = B.maxGuests || 20;
  $$("[data-step]", form).forEach((b) => b.addEventListener("click", () => { gIn.value = clamp((parseInt(gIn.value, 10) || 1) + Number(b.dataset.step), 1, B.maxGuests || 20); }));
  form.addEventListener("focusin", () => { formFocus = true; dock && dock.classList.remove("is-on"); });
  form.addEventListener("focusout", () => (formFocus = false));
  const setErr = (el, msg) => { const f = el.closest(".f"); f.classList.toggle("is-bad", !!msg); const o = $(".f__err", f); if (o) o.textContent = msg || ""; el.setAttribute("aria-invalid", !!msg); return !msg; };
  ["name", "phone"].forEach((n) => form.elements[n].addEventListener("input", (e) => setErr(e.target, "")));
  [dateIn, timeIn].forEach((el) => el.addEventListener("change", () => setErr(el, "")));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = form.elements, digits = f.phone.value.replace(/\D/g, "");
    const ok = [
      setErr(f.name, f.name.value.trim().length < 2 ? "Please enter your name." : ""),
      setErr(f.phone, digits.length < 10 || digits.length > 13 ? "Please enter a valid phone number." : ""),
      setErr(dateIn, !dateIn.value ? "Please choose a date." : dateIn.value < today ? "Please choose today or a later date." : ""),
      setErr(timeIn, !timeIn.value ? "Please choose a time." : ""),
    ].every(Boolean);
    if (!ok) { const bad = $(".is-bad input, .is-bad select", form); if (bad) bad.focus(); return; }
    const guests = clamp(parseInt(gIn.value, 10) || 2, 1, B.maxGuests || 20);
    const dLabel = new Date(`${dateIn.value}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const tLabel = fmt12(toMin(timeIn.value));
    const data = { name: f.name.value.trim(), phone: f.phone.value.trim(), date: dateIn.value, time: timeIn.value, guests, request: f.message.value.trim() };
    const summary = `${guests} ${guests === 1 ? "guest" : "guests"} · ${esc(dLabel)} · ${esc(tLabel)}`;
    const show = (html, err) => { status.hidden = false; status.classList.toggle("is-err", !!err); status.innerHTML = html; status.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); };

    if (B.mode === "endpoint" && B.endpoint) {
      try {
        const res = await fetch(B.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
        show(`<h3>Request sent — not yet confirmed</h3><p>${summary}</p><p>Kerbside Bistro will contact you on ${esc(data.phone)} to confirm your table.</p>`);
      } catch (_) { show(`<h3>We couldn't send that</h3><p>Please call ${telLink} to book your table.</p>`, true); }
      return;
    }
    const text = [
      `Hello ${S.name}, I'd like to book a table.`, "",
      `Name: ${data.name}`, `Phone: ${data.phone}`, `Date: ${dLabel}`, `Time: ${tLabel}`, `Guests: ${guests}`,
      data.request ? `Special request: ${data.request}` : null, "", "(Sent from the website — awaiting your confirmation.)",
    ].filter((l) => l !== null).join("\n");
    const wa = `https://wa.me/${S.phone.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener");
    show(`<h3>Almost there — not yet confirmed</h3><p>${summary}</p>
      <p>Send the message we've prepared on WhatsApp. Your table is confirmed only once Kerbside Bistro replies.</p>
      <p><a class="btn btn--accent btn--sm" href="${esc(wa)}" target="_blank" rel="noopener"><span class="btn__t">Send on WhatsApp</span></a></p>
      <p>Or call ${telLink}.</p>`);
  });

  /* ------------------------------------------------------------------ intro → hero */
  const intro = $(".intro"), introLogo = $(".intro__logo", intro), navLogo = $(".logo");
  let seen = false;
  try { seen = sessionStorage.getItem("kb-intro") === "1"; sessionStorage.setItem("kb-intro", "1"); } catch (_) {}
  if (!reduce) {
    const dust = $(".intro__dust", intro);
    dust.innerHTML = Array.from({ length: 26 }, () => `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(Math.random() * 2).toFixed(2)}s"></i>`).join("");
  }
  const start = (fn, ms) => setTimeout(fn, ms);
  const heroReady = new Promise((res) => { if (!heroImg || heroImg.complete) return res(); heroImg.addEventListener("load", res, { once: true }); heroImg.addEventListener("error", res, { once: true }); setTimeout(res, 1600); });
  const finish = () => { intro.classList.add("is-done"); body.classList.remove("is-loading"); body.classList.add("is-ready"); onScroll(); };

  if (reduce) { finish(); return; }
  const hold = seen ? 350 : 900;
  heroReady.then(() => start(() => {
    body.classList.add("is-revealing");
    intro.classList.add("is-reveal");
    start(() => {
      // FLIP the centred logo into the navigation logo position
      intro.classList.add("is-fly");
      const a = introLogo.getBoundingClientRect(), b = navLogo.getBoundingClientRect();
      const s = b.height / a.height;
      introLogo.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})`;
      start(() => { navLogo.style.transition = "none"; finish(); requestAnimationFrame(() => (navLogo.style.transition = "")); }, 760);
    }, seen ? 250 : 450);
  }, hold));
})();
