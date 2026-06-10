const CONFIG = {
  whatsapp: "5511999999999",
  whatsappMsg: "Olá! Gostaria de agendar um horário na barbearia-app.",
  telefone: "(11) 99999-9999",
  email: "contato@barbearia-app.com",
  endereco: "Rua das Palmeiras, 123 — Centro, São Paulo - SP",
  enderecoCurto: "Rua das Palmeiras, 123 — SP",
  instagram: "https://instagram.com/barbearia.app",
  instagramHandle: "@barbearia.app",
  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=Rua+das+Palmeiras+123+Centro+Sao+Paulo+SP",
};

function abrirWhatsApp(mensagemExtra) {
  const mensagem = mensagemExtra || CONFIG.whatsappMsg;
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function initContactInfo() {
  const enderecoEl = document.getElementById("enderecoTexto");
  const telefoneEl = document.getElementById("telefoneTexto");
  const linkChegar = document.getElementById("linkComoChegar");
  const footerTelefone = document.getElementById("footerTelefone");
  const footerEmail = document.getElementById("footerEmail");
  const footerEndereco = document.getElementById("footerEndereco");
  const footerInstagram = document.getElementById("footerInstagram");

  if (enderecoEl) enderecoEl.textContent = CONFIG.endereco;
  if (telefoneEl) telefoneEl.textContent = CONFIG.telefone;
  if (linkChegar) linkChegar.href = CONFIG.googleMaps;
  if (footerTelefone) footerTelefone.textContent = CONFIG.telefone;
  if (footerEmail) footerEmail.textContent = CONFIG.email;
  if (footerEndereco) footerEndereco.textContent = CONFIG.enderecoCurto;
  if (footerInstagram) {
    footerInstagram.href = CONFIG.instagram;
    footerInstagram.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      ${CONFIG.instagramHandle}
    `;
  }
}

function initWhatsAppButtons() {
  const heroBtn = document.getElementById("heroWhatsapp");
  const ctaBtn = document.getElementById("ctaWhatsapp");

  if (heroBtn) heroBtn.addEventListener("click", () => abrirWhatsApp());
  if (ctaBtn) ctaBtn.addEventListener("click", () => abrirWhatsApp());
}

function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const close = document.getElementById("menuClose");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileMenuOverlay");
  const links = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (toggle) toggle.addEventListener("click", openMenu);
  if (close) close.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));
}

function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
}

function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function initTestimonialCarousel() {
  const slides = document.getElementById("testimonialSlides");
  const dotsContainer = document.getElementById("testimonialDots");
  if (!slides || !dotsContainer) return;

  const total = slides.children.length;
  let current = 0;
  let intervalId;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Depoimento ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll("button");

  function goToSlide(index) {
    current = index;
    slides.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function startAutoplay() {
    intervalId = setInterval(() => {
      goToSlide((current + 1) % total);
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(intervalId);
  }

  dotsContainer.addEventListener("mouseenter", stopAutoplay);
  dotsContainer.addEventListener("mouseleave", startAutoplay);
  startAutoplay();
}

document.addEventListener("DOMContentLoaded", () => {
  initContactInfo();
  initWhatsAppButtons();
  initMobileMenu();
  initHeaderScroll();
  initScrollAnimations();
  initActiveNav();
  initTestimonialCarousel();
});

window.CONFIG = CONFIG;
window.abrirWhatsApp = abrirWhatsApp;
