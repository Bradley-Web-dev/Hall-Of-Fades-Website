/* =========================================================
   HALL OF FADES BARBERSHOP — SITE SCRIPT
   Vanilla JS only. No build step, no dependencies.
   ========================================================= */

/* ---------------------------------------------------------
   1. CENTRAL BUSINESS CONFIGURATION
   Edit these values to update information across the site.
   --------------------------------------------------------- */
const BUSINESS = {
  name: "Hall Of Fades Barbershop",
  type: "Barber Shop",
  phone: "+13464128235",
  displayPhone: "+1 346-412-8235",
  address: "1807 Gessner Rd Suite A, Houston, TX 77043, United States",
  rating: "4.9",
  reviewCount: 69,
  // Actual verified Google Maps listing for Hall Of Fades Barbershop.
  // Used for the "Read Our Google Reviews" CTA and the footer Google link.
  googleMapsReviewsUrl:
    "https://www.google.com/maps/place/Hall+Of+Fades+Barbershop/@29.8048102,-95.5485075,17z/data=!4m8!3m7!1s0x8640c57ac00f340f:0x78f776a0917d65d0!8m2!3d29.8048102!4d-95.5459326!9m1!1b1!16s%2Fg%2F11qp47xpjk?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
  // Standard Google Maps "directions" deep link built from the verified street
  // address above — no API key required, and no coordinates were invented.
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("1807 Gessner Rd Suite A, Houston, TX 77043"),
};

/* Apply any businesses values that should stay in sync with BUSINESS
   even if the markup is edited later. */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href*="google.com/maps/place"]').forEach((el) => {
    el.setAttribute("href", BUSINESS.googleMapsReviewsUrl);
  });
  document.querySelectorAll('a[href*="google.com/maps/dir"]').forEach((el) => {
    el.setAttribute("href", BUSINESS.directionsUrl);
  });
});

/* ---------------------------------------------------------
   2. STICKY NAVBAR SCROLL STATE
   --------------------------------------------------------- */
(function navScrollState() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const setState = () => {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  setState();
  window.addEventListener("scroll", setState, { passive: true });
})();

/* ---------------------------------------------------------
   3. MOBILE HAMBURGER MENU
   Accessible: keyboard operable, closes on link click,
   closes on outside click, closes on Escape.
   --------------------------------------------------------- */
(function mobileMenu() {
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("mobileMenu");
  const backdrop = document.getElementById("mobileMenuBackdrop");
  if (!btn || !menu || !backdrop) return;

  let lastFocused = null;

  const openMenu = () => {
    lastFocused = document.activeElement;
    menu.classList.add("is-open");
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-visible"));
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!menu.classList.contains("is-open")) backdrop.hidden = true;
    }, 320);
    if (lastFocused) lastFocused.focus();
  };

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close when a nav link inside the mobile menu is clicked
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on outside click (backdrop)
  backdrop.addEventListener("click", closeMenu);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
    }
  });
})();

/* ---------------------------------------------------------
   4. SMOOTH SCROLL WITH HEADER OFFSET
   --------------------------------------------------------- */
(function smoothScrollLinks() {
  const header = document.getElementById("siteHeader");
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
})();

/* ---------------------------------------------------------
   5. SCROLL REVEAL ANIMATIONS
   --------------------------------------------------------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), (i % 6) * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------------------------------------------------------
   6. GALLERY LIGHTBOX
   --------------------------------------------------------- */
(function galleryLightbox() {
  const STYLES = [
    { title: "Skin Fade", swatch: "swatch-1", desc: "A tight, gradual blend down to bare skin at the sides and back." },
    { title: "Taper Fade", swatch: "swatch-2", desc: "A softer blend that tapers close around the ears and neckline." },
    { title: "Low Fade", swatch: "swatch-3", desc: "The fade starts low, keeping more length up top for a subtle look." },
    { title: "Beard Line-Up", swatch: "swatch-4", desc: "Crisp, defined edges along the cheek line, neckline, and mustache." },
    { title: "Classic Crop", swatch: "swatch-5", desc: "A traditional short cut with clean lines and minimal fuss." },
    { title: "Textured Crop", swatch: "swatch-6", desc: "Longer on top with texture worked in for a modern, natural finish." },
    { title: "Clean Edge Up", swatch: "swatch-7", desc: "A sharp perimeter touch-up to keep the hairline crisp between cuts." },
    { title: "Beard Trim & Shape", swatch: "swatch-8", desc: "Beard length evened out and the shape cleaned up around the edges." },
  ];

  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  const swatchEl = document.getElementById("lightboxSwatch");
  const labelEl = document.getElementById("lightboxLabel");
  const descEl = document.getElementById("lightboxDesc");
  const countEl = document.getElementById("lightboxCount");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  let currentIndex = 0;
  let lastFocused = null;

  const render = (index) => {
    currentIndex = (index + STYLES.length) % STYLES.length;
    const style = STYLES[currentIndex];

    swatchEl.className = "lightbox-swatch " + style.swatch;
    labelEl.textContent = style.title;
    descEl.textContent = style.desc;
    countEl.textContent = `${currentIndex + 1} / ${STYLES.length}`;
  };

  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    render(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  items.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => render(currentIndex - 1));
  nextBtn.addEventListener("click", () => render(currentIndex + 1));

  // Click outside content to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard: Escape to close, arrows to navigate
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") render(currentIndex + 1);
    if (e.key === "ArrowLeft") render(currentIndex - 1);
  });
})();

/* ---------------------------------------------------------
   7. DYNAMIC FOOTER YEAR
   --------------------------------------------------------- */
(function footerYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
})();
