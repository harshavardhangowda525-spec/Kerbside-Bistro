/*
 * Restaurant website — interactions
 * Dependency-free. Reads content from window.SITE (config.js) and window.MENU (menu-data.js).
 */
(() => {
  "use strict";

  const S = window.SITE || {};
  const MENU = window.MENU || [];
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------------
     Images — accepts an Unsplash photo ID, a relative path or a full URL
     ------------------------------------------------------------------ */
  const isUnsplashId = (src) => /^photo-[\w-]+$/.test(src);
  const imgUrl = (src, w) => (isUnsplashId(src) ? `https://images.unsplash.com/${src}?w=${w}&q=70&auto=format&fit=crop` : src);

  function markFallback(wrap, label) {
    if (!wrap) return;
    wrap.classList.add("img-fallback");
    if (label) wrap.dataset.ph = label;
  }

  function setImg(img, data, sizes = "100vw", widths = [640, 960, 1400, 2000]) {
    if (!img || !data) return;
    const wrap = img.parentElement;
    img.addEventListener("error", () => markFallback(wrap, data.alt), { once: true });
    if (isUnsplashId(data.src)) {
      img.srcset = widths.map((w) => `${imgUrl(data.src, w)} ${w}w`).join(", ");
      img.sizes = sizes;
    }
    img.src = imgUrl(data.src, widths[1] || widths[0]);
    if (data.alt) img.alt = data.alt;
  }

  const hero = $(".hero__img");
  if (hero) {
    if (hero.complete && hero.naturalWidth === 0) markFallback(hero.parentElement);
    else hero.addEventListener("error", () => markFallback(hero.parentElement), { once: true });
  }
  setImg($('[data-img="experience"]'), S.images && S.images.experience, "(max-width: 860px) 92vw, 45vw");
  setImg($('[data-img="experienceDetail"]'), S.images && S.images.experienceDetail, "(max-width: 860px) 42vw, 20vw", [400, 640, 960]);
  setImg($('[data-img="booking"]'), S.images && S.images.booking, "(max-width: 860px) 92vw, 45vw");

  /* ------------------------------------------------------------------
     Content bindings from config
     ------------------------------------------------------------------ */
  if (!S.demoMode) body.classList.add("no-demo");

  const textBindings = {
    phone: S.phone && S.phone.display,
    hours: S.hours && S.hours.display,
    address: S.address && S.address.display,
    payments: S.payments,
  };
  $$("[data-bind]").forEach((el) => {
    const v = textBindings[el.dataset.bind];
    if (v) el.textContent = v;
  });
  const hrefBindings = {
    tel: S.phone && S.phone.tel ? `tel:${S.phone.tel}` : null,
    directions: S.links && S.links.directions,
  };
  $$("[data-bind-href]").forEach((el) => {
    const v = hrefBindings[el.dataset.bindHref];
    if (v) {
      el.setAttribute("href", v);
      if (el.dataset.bindHref === "directions") { el.target = "_blank"; el.rel = "noopener"; }
    } else if (el.dataset.missing) {
      // Detail not supplied yet: explain instead of linking somewhere wrong.
      el.addEventListener("click", (e) => { e.preventDefault(); toast(esc(el.dataset.missing)); });
    }
  });

  if (S.logo) {
    const brand = $("[data-logo]");
    if (brand) brand.innerHTML = `<img src="${esc(S.logo)}" alt="${esc(S.name || "")}" />`;
  }

  const credit = $("[data-credit]");
  if (credit) {
    if (!S.credit || !S.credit.show) credit.remove();
    else if (S.credit.url) credit.innerHTML = `Designed &amp; developed by <a href="${esc(S.credit.url)}" target="_blank" rel="noopener">${esc(S.credit.label)}</a>`;
  }
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  const map = $("[data-map]");
  if (map && S.links && S.links.mapEmbed) {
    map.innerHTML = `<iframe title="Map showing ${esc(S.name)}" src="${esc(S.links.mapEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }

  // Stats derived from the menu data, so they stay true when the menu changes.
  const menuCounts = {
    biryani: (MENU[0] && MENU[0].items ? MENU[0].items.length : 0),
    dishes: MENU.reduce((n, c) => n + (c.items ? c.items.length : 0), 0),
    sections: MENU.length,
  };
  $$("[data-count-from]").forEach((el) => {
    const v = menuCounts[el.dataset.countFrom];
    if (!v) return el.closest(".stat") && el.closest(".stat").remove();
    el.dataset.count = v;
    el.dataset.pad = "2";
    el.textContent = String(v).padStart(2, "0");
  });

  /* ------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------ */
  const toastEl = $(".toast");
  let toastTimer;
  function toast(html, ms = 5200) {
    if (!toastEl) return;
    toastEl.innerHTML = html;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("is-on"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-on");
      setTimeout(() => (toastEl.hidden = true), 500);
    }, ms);
  }

  /* ------------------------------------------------------------------
     Menu
     ------------------------------------------------------------------ */
  const tabsEl = $("[data-menu-tabs]");
  const panelEl = $("[data-menu-panel]");
  const pad = (n) => String(n).padStart(2, "0");

  const TAG_LABELS = { spicy: "Spicy", signature: "House favourite", new: "New" };
  const DIETS = { "non-veg": "Non-vegetarian", egg: "Contains egg", veg: "Vegetarian", vegan: "Vegan" };
  function dietMark(tags = []) {
    const d = tags.find((t) => DIETS[t]);
    return d ? `<i class="diet diet--${d}" role="img" aria-label="${DIETS[d]}"></i>` : "";
  }

  function renderMenu(index, focus) {
    const cat = MENU[index];
    if (!cat || !panelEl) return;
    $$(".menu-tab", tabsEl).forEach((t, i) => {
      const on = i === index;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panelEl.setAttribute("aria-labelledby", `tab-${cat.id}`);

    const hasItems = Array.isArray(cat.items) && cat.items.length > 0;
    const rows = hasItems
      ? cat.items
          .map(
            (it, i) => `<li style="--i:${i}">
              <div><h4>${dietMark(it.tags)}${esc(it.name)}${(it.tags || []).filter((t) => TAG_LABELS[t]).map((t) => `<span class="tag tag--${esc(t)}">${TAG_LABELS[t]}</span>`).join("")}</h4>
              ${it.description ? `<p>${esc(it.description)}</p>` : ""}</div>
              <span class="leader" aria-hidden="true"></span>
              ${it.price ? `<span class="price">${esc(it.price)}</span>` : ""}
            </li>`
          )
          .join("")
      : [0, 1, 2, 3]
          .map(
            (i) => `<li style="--i:${i}" aria-hidden="true">
              <div style="flex:0 0 ${[46, 38, 52, 42][i]}%"><div class="ph"></div><div class="ph ph-sub"></div></div>
              <span class="leader"></span><span class="ph-price">₹ —</span>
            </li>`
          )
          .join("");

    panelEl.innerHTML = `
      <article class="menu-card">
        <div class="menu-card__media">
          <img alt="${esc(cat.image ? cat.image.alt : "")}" decoding="async" />
          <span class="demo-tag">${hasItems ? "Sample prices · Representative image" : "Sample layout · Representative image"}</span>
        </div>
        <div class="menu-card__body">
          <h3 class="menu-card__title">${esc(cat.name)}</h3>
          <p class="menu-card__blurb">${esc(cat.blurb || "")}</p>
          <ul class="menu-items ${hasItems ? "" : "menu-items--placeholder"}">${rows}</ul>
          ${
            hasItems
              ? ""
              : `<p class="menu-card__note">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
                  <span>${esc(cat.name)} dishes and prices will appear here once the restaurant's own menu is added.</span>
                </p>`
          }
        </div>
      </article>`;
    setImg($("img", panelEl), cat.image, "(max-width: 1080px) 92vw, 55vw", [640, 1000, 1400]);
  }

  if (tabsEl && MENU.length) {
    tabsEl.innerHTML = MENU.map(
      (c, i) => `<button type="button" class="menu-tab" role="tab" id="tab-${esc(c.id)}" aria-controls="menu-panel" aria-selected="false">
        <small>${pad(i + 1)}</small><span>${esc(c.name)}</span></button>`
    ).join("");
    panelEl.id = "menu-panel";
    panelEl.setAttribute("role", "tabpanel");
    let current = 0;
    $$(".menu-tab", tabsEl).forEach((t, i) =>
      t.addEventListener("click", () => {
        if (i === current) return;
        current = i;
        renderMenu(i);
        if (innerWidth <= 1080) t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
      })
    );
    tabsEl.addEventListener("keydown", (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        current = (current + keys[e.key] + MENU.length) % MENU.length;
        renderMenu(current, true);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        current = e.key === "Home" ? 0 : MENU.length - 1;
        renderMenu(current, true);
      }
    });
    renderMenu(0);
  }

  const fullMenuBtn = $("[data-full-menu]");
  if (fullMenuBtn) {
    fullMenuBtn.addEventListener("click", () => {
      if (S.links && S.links.fullMenu) {
        window.open(S.links.fullMenu, "_blank", "noopener");
      } else {
        toast("The full printable menu will be linked here once the restaurant shares it.");
      }
    });
  }

  /* ------------------------------------------------------------------
     Gallery + lightbox
     ------------------------------------------------------------------ */
  const gallery = S.gallery || [];
  const gridEl = $("[data-gallery]");
  if (gridEl) {
    gridEl.innerHTML = gallery
      .map(
        (g, i) => `<button type="button" class="g-item g-item--${esc(g.shape || "square")} reveal-img" style="--d:${i % 4}" data-index="${i}" aria-label="View image: ${esc(g.caption || g.alt)}">
          <img alt="${esc(g.alt)}" loading="lazy" decoding="async" />
          <span class="g-cap" aria-hidden="true">${esc(g.caption || "")}</span>
        </button>`
      )
      .join("");
    $$(".g-item", gridEl).forEach((btn, i) => {
      const wide = gallery[i].shape === "wide";
      setImg($("img", btn), gallery[i], wide ? "(max-width: 860px) 92vw, 46vw" : "(max-width: 860px) 46vw, 23vw", [480, 800, 1200]);
      btn.addEventListener("click", () => openLightbox(i, btn));
    });
  }

  const lb = $(".lightbox");
  const lbImg = lb && $("img", lb);
  let lbIndex = 0;
  let lbReturn = null;

  function showLightbox(i) {
    lbIndex = (i + gallery.length) % gallery.length;
    const g = gallery[lbIndex];
    lbImg.classList.add("is-swapping");
    const next = new Image();
    const url = imgUrl(g.src, 1800);
    const done = () => {
      lbImg.src = url;
      lbImg.alt = g.alt;
      $(".lightbox__caption", lb).textContent = g.caption || "";
      $(".lightbox__count", lb).textContent = `${pad(lbIndex + 1)} / ${pad(gallery.length)}`;
      requestAnimationFrame(() => lbImg.classList.remove("is-swapping"));
    };
    next.onload = done;
    next.onerror = done;
    next.src = url;
    [lbIndex + 1, lbIndex - 1].forEach((j) => {
      const p = gallery[(j + gallery.length) % gallery.length];
      if (p) new Image().src = imgUrl(p.src, 1800);
    });
  }
  function openLightbox(i, from) {
    if (!lb) return;
    lbReturn = from;
    lb.hidden = false;
    body.style.overflow = "hidden";
    requestAnimationFrame(() => lb.classList.add("is-open"));
    showLightbox(i);
    $(".lightbox__close", lb).focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    body.style.overflow = "";
    setTimeout(() => (lb.hidden = true), reduceMotion ? 0 : 450);
    if (lbReturn) lbReturn.focus();
  }
  if (lb) {
    $(".lightbox__close", lb).addEventListener("click", closeLightbox);
    $(".lightbox__nav--prev", lb).addEventListener("click", () => showLightbox(lbIndex - 1));
    $(".lightbox__nav--next", lb).addEventListener("click", () => showLightbox(lbIndex + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    doc.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
      if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
      if (e.key === "Tab") {
        const f = $$("button", lb);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let touchX = null;
    lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ------------------------------------------------------------------
     Scroll reveals (IntersectionObserver — no scroll listeners)
     ------------------------------------------------------------------ */
  $$(".stagger").forEach((group) => Array.from(group.children).forEach((c, i) => c.style.setProperty("--i", i)));

  const counters = $$("[data-count]");
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const padTo = parseInt(el.dataset.pad || "0", 10);
    const fmt = (v) => {
      let s = v.toFixed(decimals);
      return padTo ? s.padStart(padTo, "0") : s;
    };
    if (reduceMotion) return (el.textContent = fmt(target));
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          $$("[data-count]", e.target).forEach(countUp);
          io.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    $$(".reveal, .reveal-img, .stagger").forEach((el) => io.observe(el));
  } else {
    $$(".reveal, .reveal-img, .stagger").forEach((el) => el.classList.add("is-in"));
    counters.forEach(countUp);
  }

  /* ------------------------------------------------------------------
     Scroll-linked: nav state, progress, parallax, mobile bar
     ------------------------------------------------------------------ */
  const nav = $(".nav");
  const progress = $(".scroll-progress span");
  const mobileBar = $(".mobile-bar");
  const heroMedia = $(".hero__media");
  const parallaxImgs = $$("[data-parallax-img]");
  let lastY = scrollY;
  let ticking = false;
  let formFocused = false;

  function onScroll() {
    const y = scrollY;
    const vh = innerHeight;
    const max = doc.documentElement.scrollHeight - vh;

    nav.classList.toggle("is-scrolled", y > 40);
    if (!body.classList.contains("menu-open")) nav.classList.toggle("is-hidden", y > lastY && y > vh * 0.9);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (mobileBar) mobileBar.classList.toggle("is-on", y > vh * 0.55 && !formFocused);

    if (!reduceMotion) {
      if (heroMedia && y < vh * 1.2) heroMedia.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
      parallaxImgs.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const offset = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
        img.style.translate = `0 ${(-offset * 6).toFixed(2)}%`;
      });
    }
    lastY = y;
    ticking = false;
  }
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  onScroll();

  // Active nav link
  const navLinks = $$(".nav__link");
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["home", "menu", "about", "gallery", "visit"].forEach((id) => { const s = doc.getElementById(id); if (s) so.observe(s); });
  }

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  const burger = $(".burger");
  const mobileMenu = $(".mobile-menu");
  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", !open);
    body.style.overflow = open ? "hidden" : "";
    nav.classList.remove("is-hidden");
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    doc.addEventListener("keydown", (e) => { if (e.key === "Escape" && body.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });
  }

  /* ------------------------------------------------------------------
     Desktop micro-interactions: cursor, magnetic buttons, card glow
     ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    const cursor = $(".cursor");
    let mx = -100, my = -100, cx = -100, cy = -100;
    root.classList.add("has-cursor");
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    doc.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
    doc.addEventListener("pointerenter", () => cursor.classList.remove("is-hidden"));
    const loop = () => {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    doc.addEventListener("pointerover", (e) => {
      const t = e.target;
      cursor.classList.toggle("is-view", !!t.closest(".g-item"));
      cursor.classList.toggle("is-link", !t.closest(".g-item") && !!t.closest("a, button, select, label, input[type=date]"));
      cursor.classList.toggle("is-hidden", !!t.closest("iframe, .lightbox"));
    });

    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = `${dx * 0.22}px ${dy * 0.32}px`;
      });
      el.addEventListener("pointerleave", () => (el.style.translate = "0 0"));
    });
  }

  $$("[data-glow]").forEach((card) =>
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    })
  );

  /* ------------------------------------------------------------------
     Booking enquiry
     ------------------------------------------------------------------ */
  const form = $("[data-booking]");
  if (form) {
    const B = S.booking || {};
    const dateIn = form.elements.date;
    const timeIn = form.elements.time;
    const guestsIn = form.elements.guests;
    const status = $("[data-booking-status]", form);
    const maxGuests = B.maxGuests || 20;
    guestsIn.max = maxGuests;

    const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
    const fmt12 = (mins) => {
      const h = Math.floor(mins / 60), m = mins % 60;
      return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    };
    const localISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const today = localISO(new Date());
    dateIn.min = today;

    const first = toMin(B.firstSlot || "09:00"), last = toMin(B.lastSlot || "21:00"), step = B.slotMinutes || 15;
    for (let t = first; t <= last; t += step) {
      const o = doc.createElement("option");
      o.value = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
      o.textContent = fmt12(t);
      timeIn.appendChild(o);
    }
    function refreshSlots() {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const isToday = dateIn.value === today;
      Array.from(timeIn.options).forEach((o) => {
        if (!o.value) return;
        o.disabled = isToday && toMin(o.value) <= nowMin;
      });
      if (timeIn.selectedOptions[0] && timeIn.selectedOptions[0].disabled) timeIn.value = "";
    }
    dateIn.addEventListener("change", refreshSlots);

    $$("[data-step]", form).forEach((b) =>
      b.addEventListener("click", () => {
        const v = Math.min(maxGuests, Math.max(1, (parseInt(guestsIn.value, 10) || 1) + Number(b.dataset.step)));
        guestsIn.value = v;
      })
    );

    const note = $("[data-booking-note]", form);
    const submitLabel = $("[data-submit-label]", form);
    if (B.mode === "whatsapp") {
      note.textContent = "It opens WhatsApp with your details for you to send. Your table is confirmed only once the restaurant replies.";
      submitLabel.textContent = "Send Enquiry via WhatsApp";
    } else if (B.mode === "demo") {
      note.textContent = "Demo mode: details are checked but not sent anywhere.";
    }

    form.addEventListener("focusin", () => { formFocused = true; mobileBar && mobileBar.classList.remove("is-on"); });
    form.addEventListener("focusout", () => { formFocused = false; });

    function setError(input, msg) {
      const field = input.closest(".field");
      field.classList.toggle("is-invalid", !!msg);
      const out = $(".field__error", field);
      if (out) out.textContent = msg || "";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }
    function validate() {
      const f = form.elements;
      const digits = f.phone.value.replace(/\D/g, "");
      const g = parseInt(guestsIn.value, 10);
      const checks = [
        setError(f.name, f.name.value.trim().length < 2 ? "Please enter your name." : ""),
        setError(f.phone, digits.length < 10 || digits.length > 13 ? "Please enter a valid phone number." : ""),
        setError(dateIn, !dateIn.value ? "Please choose a date." : dateIn.value < today ? "Please choose today or a future date." : ""),
        setError(timeIn, !timeIn.value ? "Please choose a time." : ""),
      ];
      if (!(g >= 1 && g <= maxGuests)) { guestsIn.value = Math.min(maxGuests, Math.max(1, g || 2)); }
      const ok = checks.every(Boolean);
      if (!ok) { const bad = $(".is-invalid input, .is-invalid select", form); if (bad) bad.focus(); }
      return ok;
    }
    ["name", "phone"].forEach((n) => form.elements[n].addEventListener("input", (e) => {
      if (e.target.closest(".field").classList.contains("is-invalid")) setError(e.target, "");
    }));
    [dateIn, timeIn].forEach((el) => el.addEventListener("change", () => setError(el, "")));

    function showStatus(html, isError) {
      status.hidden = false;
      status.classList.toggle("is-error", !!isError);
      status.innerHTML = html;
      status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;
      const f = form.elements;
      const dateLabel = new Date(`${dateIn.value}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      const timeLabel = fmt12(toMin(timeIn.value));
      const data = {
        name: f.name.value.trim(),
        phone: f.phone.value.trim(),
        date: dateIn.value,
        time: timeIn.value,
        guests: parseInt(guestsIn.value, 10),
        message: f.message.value.trim(),
      };
      const summary = `${esc(data.guests)} ${data.guests === 1 ? "guest" : "guests"} · ${esc(dateLabel)} · ${esc(timeLabel)}`;
      const telLink = S.phone && S.phone.tel ? `<a href="tel:${esc(S.phone.tel)}">${esc(S.phone.display)}</a>` : "the restaurant";

      if (B.mode === "endpoint" && B.endpoint) {
        const btn = $("button[type=submit]", form);
        btn.disabled = true;
        submitLabel.textContent = "Sending…";
        try {
          const res = await fetch(B.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error(res.status);
          showStatus(`<h3>Enquiry sent — not yet confirmed</h3><p>${summary}</p><p>The restaurant team will contact you on ${esc(data.phone)} to confirm your table.</p>`);
          form.reset(); guestsIn.value = 2;
        } catch (err) {
          showStatus(`<h3>We couldn't send that</h3><p>Please call ${telLink} to request your table.</p>`, true);
        } finally {
          btn.disabled = false;
          submitLabel.textContent = "Send Booking Enquiry";
        }
        return;
      }

      if (B.mode === "demo" || !S.phone || !S.phone.whatsapp) {
        showStatus(`<h3>Enquiry checked — demo only</h3><p>${summary}</p><p>No booking system is connected yet, so nothing was sent. In the live site this request goes straight to ${S.phone && S.phone.tel ? telLink : "the restaurant"}.</p>`);
        return;
      }

      const text = [
        `Hello ${S.name}, I'd like to request a table.`,
        "",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Date: ${dateLabel}`,
        `Time: ${timeLabel}`,
        `Guests: ${data.guests}`,
        data.message ? `Message: ${data.message}` : null,
        "",
        "(Booking enquiry sent from the website. Awaiting your confirmation.)",
      ].filter((l) => l !== null).join("\n");
      const wa = `https://wa.me/${S.phone.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(wa, "_blank", "noopener");
      showStatus(`<h3>Enquiry ready — not yet confirmed</h3>
        <p>${summary}</p>
        <p>Send it on WhatsApp to reach ${esc(S.name)}. Your table is confirmed only once the restaurant replies.</p>
        <p class="book__status-actions"><a class="btn btn--primary btn--sm" href="${esc(wa)}" target="_blank" rel="noopener"><span>Send on WhatsApp</span></a>
        <span>or call <strong>${esc(S.phone.display)}</strong></span></p>`);
    });
  }

  /* ------------------------------------------------------------------
     Loader → hero entrance
     ------------------------------------------------------------------ */
  const loader = $(".loader");
  let seen = false;
  try { seen = sessionStorage.getItem("kb-intro") === "1"; sessionStorage.setItem("kb-intro", "1"); } catch (e) { /* storage unavailable */ }
  const minTime = reduceMotion ? 150 : seen ? 700 : 1700;
  const start = performance.now();
  const heroReady = new Promise((resolve) => {
    if (!hero || hero.complete) return resolve();
    hero.addEventListener("load", resolve, { once: true });
    hero.addEventListener("error", resolve, { once: true });
    setTimeout(resolve, 2800); // never hold the page hostage to a slow image
  });

  heroReady.then(() => {
    const wait = Math.max(0, minTime - (performance.now() - start));
    setTimeout(() => {
      if (!loader) { body.classList.add("is-ready"); body.classList.remove("is-loading"); return; }
      loader.classList.add("is-leaving");
      setTimeout(() => {
        body.classList.add("is-ready");
        body.classList.remove("is-loading");
      }, reduceMotion ? 0 : 280);
      setTimeout(() => loader.classList.add("is-done"), reduceMotion ? 50 : 1100);
    }, wait);
  });
})();
