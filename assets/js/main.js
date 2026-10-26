// ==========================================================
// Menú superior (cabecera fija .gh-header), igual en todas las páginas.
// ==========================================================
const siteHeaderEl = document.querySelector('.gh-header');
const menuBurger = document.querySelector('.gh-burger');
const mainNavigation = document.querySelector('.gh-nav');
const treatmentItem = document.querySelector('.gh-has-sub');
const treatmentToggle = document.querySelector('.gh-sub-toggle');
const MOBILE_MENU_QUERY = window.matchMedia('(max-width:1180px)');

const NAV_PAGE_BY_FILE = {
  'index.html': 'home',
  'la-clinica.html': 'clinic',
  'el-equipo.html': 'team',
  'blog.html': 'blog',
  'invisalign-o-brackets.html': 'blog',
  'duele-ponerse-implante-dental.html': 'blog',
  'implantes-dentales-poco-hueso.html': 'blog',
  'precio-implantes-dentales-los-cristianos.html': 'blog',
  'contacto.html': 'contact',
  'radiologia-dental-los-cristianos.html': 'radiology',
  'escaner-intraoral-los-cristianos.html': 'scanner',
  'ortodoncia-los-cristianos.html': 'orthodontics',
  'ortodoncia-invisible-los-cristianos.html': 'aligners',
  'dentista-infantil-los-cristianos.html': 'pediatric',
  'periodoncia-los-cristianos.html': 'periodontal',
  'endodoncia-los-cristianos.html': 'endodontic',
  'estetica-dental-los-cristianos.html': 'aesthetic',
  'blanqueamiento-dental-los-cristianos.html': 'whitening',
  'protesis-dentales-los-cristianos.html': 'prosthetic',
  'dentista-los-cristianos.html': 'general',
  'bruxismo-ferulas-descarga-los-cristianos.html': 'bruxism',
  'cirugia-oral-los-cristianos.html': 'surgery',
  'implantes-dentales-los-cristianos.html': 'implants'
};

const TREATMENT_PAGES = new Set([
  'radiology', 'scanner', 'orthodontics', 'aligners', 'pediatric',
  'periodontal', 'endodontic', 'aesthetic', 'whitening', 'prosthetic',
  'general', 'bruxism', 'surgery', 'implants'
]);

function navigationFileName() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const lastPart = parts.at(-1) || 'index.html';
  return lastPart.includes('.') ? lastPart : 'index.html';
}

function setActiveNavigation() {
  const currentPage = NAV_PAGE_BY_FILE[navigationFileName()] || 'home';

  document.querySelectorAll('.gh-header [data-nav-page]').forEach(link => {
    const isCurrent = link.dataset.navPage === currentPage;
    link.classList.toggle('active', isCurrent);
    if (isCurrent && link.tagName === 'A') link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  if (TREATMENT_PAGES.has(currentPage)) treatmentToggle?.classList.add('active');
}

function setTreatmentMenu(open) {
  if (!treatmentItem || !treatmentToggle) return;
  treatmentItem.classList.toggle('is-open', open);
  treatmentToggle.setAttribute('aria-expanded', String(open));
}

function setMainMenu(open) {
  if (!menuBurger) return;
  document.documentElement.classList.toggle('gh-open', open);
  menuBurger.setAttribute('aria-expanded', String(open));
  menuBurger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  if (!open) setTreatmentMenu(false);
}

menuBurger?.addEventListener('click', () => {
  setMainMenu(!document.documentElement.classList.contains('gh-open'));
});

treatmentToggle?.addEventListener('click', event => {
  event.stopPropagation();
  setTreatmentMenu(!treatmentItem.classList.contains('is-open'));
});

// Al elegir un enlace se cierra el menú (también en enlaces a #anclas).
mainNavigation?.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', () => {
    setTreatmentMenu(false);
    setMainMenu(false);
  });
});

// Clic fuera: cierra el submenú (escritorio) o el panel (móvil).
document.addEventListener('click', event => {
  if (!siteHeaderEl || siteHeaderEl.contains(event.target)) return;
  setTreatmentMenu(false);
  setMainMenu(false);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const wasOpen = treatmentItem?.classList.contains('is-open');
  setTreatmentMenu(false);
  setMainMenu(false);
  if (wasOpen) treatmentToggle?.focus();
});

MOBILE_MENU_QUERY.addEventListener?.('change', () => {
  setTreatmentMenu(false);
  setMainMenu(false);
});

setActiveNavigation();

// Sombra suave al hacer scroll. Solo cambia la opacidad de un
// pseudo-elemento: el menú no se mueve ni cambia de tamaño.
let headerShadowTicking = false;

function updateHeaderShadow() {
  headerShadowTicking = false;
  siteHeaderEl?.classList.toggle('is-scrolled', window.scrollY > 4);
}

window.addEventListener('scroll', () => {
  if (headerShadowTicking) return;
  headerShadowTicking = true;
  window.requestAnimationFrame(updateHeaderShadow);
}, { passive:true });

updateHeaderShadow();


// Envío de formularios a clinicaguayero@gmail.com mediante FormSubmit (https://formsubmit.co)
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/clinicaguayero@gmail.com';

document.querySelectorAll('form[data-demo-form]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = {
      _subject: 'Nuevo mensaje desde la web - ' + document.title,
      _template: 'table',
      _captcha: 'false',
      'Página': window.location.href
    };
    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (field.type === 'checkbox' || field.type === 'submit') return;
      const label = (field.name || field.placeholder || 'Campo').replace(/\s*\(requerido\)/i, '');
      if (field.value.trim()) data[label] = field.value.trim();
      if (field.type === 'email' && field.value.trim()) data._replyto = field.value.trim();
    });

    if (button) button.disabled = true;
    if (status) status.textContent = 'Enviando...';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === 'false') throw new Error(result.message || 'Error');
      if (status) status.textContent = '¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.';
      form.reset();
    } catch (error) {
      if (status) status.textContent = 'No se ha podido enviar. Llámanos al +34 922 79 74 05 o escríbenos a clinicaguayero@gmail.com.';
    } finally {
      if (button) button.disabled = false;
    }
  });
});

// Selector directo y funcional conectado a Google Traductor.
const languageSelect = document.querySelector('[data-language-select="true"]');
const languageSelectFlag = document.querySelector(
  '[data-language-select-flag]'
);

const LANGUAGE_FLAGS = {
  es: 'assets/images/flags/es.svg',
  en: 'assets/images/flags/gb.svg',
  de: 'assets/images/flags/de.svg',
  fr: 'assets/images/flags/fr.svg',
  it: 'assets/images/flags/it.svg',
  pt: 'assets/images/flags/pt.svg',
  nl: 'assets/images/flags/nl.svg',
  pl: 'assets/images/flags/pl.svg'
};

const LANGUAGE_NAMES = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski'
};


// Barra clásica de Google Traductor. Se crea por JavaScript para que aparezca
// en todas las páginas sin modificar el selector de idiomas de la cabecera.
let classicGoogleBar = null;
let classicGoogleBarLanguage = 'es';

function createClassicGoogleBar() {
  if (classicGoogleBar) return classicGoogleBar;

  const siteHeader = document.querySelector('.gh-header');
  if (!siteHeader) return null;

  const bar = document.createElement('aside');
  bar.className = 'classic-google-translate-bar skiptranslate';
  bar.setAttribute('aria-label', 'Barra de Google Traductor');
  bar.setAttribute('translate', 'no');
  bar.hidden = true;
  bar.innerHTML = `
    <div class="classic-google-translate-inner">
      <div class="classic-google-brand" aria-label="Google Traductor">
        <span class="classic-google-g" aria-hidden="true">
          <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
        </span>
        <span class="classic-google-product">Traductor</span>
      </div>
      <div class="classic-google-status">
        <span>Traducido al:</span>
        <strong data-classic-google-language>Español</strong>
      </div>
      <button class="classic-google-original" data-classic-google-original type="button">
        Mostrar original
      </button>
      <button class="classic-google-close" data-classic-google-close type="button" aria-label="Cerrar barra de traducción">
        <span aria-hidden="true">×</span>
      </button>
    </div>`;

  siteHeader.insertAdjacentElement('afterend', bar);

  bar.querySelector('[data-classic-google-original]')?.addEventListener(
    'click',
    restoreSpanishVersion
  );

  bar.querySelector('[data-classic-google-close]')?.addEventListener(
    'click',
    () => {
      bar.hidden = true;
      document.body.classList.remove('has-classic-google-translate-bar');
    }
  );

  classicGoogleBar = bar;
  return bar;
}

function setClassicGoogleBar(language, forceOpen = false) {
  const selected = normalizeSelectedLanguage(language);
  const bar = createClassicGoogleBar();
  if (!bar) return;

  classicGoogleBarLanguage = selected;

  if (selected === 'es') {
    bar.hidden = true;
    document.body.classList.remove('has-classic-google-translate-bar');
    return;
  }

  const languageLabel = bar.querySelector('[data-classic-google-language]');
  if (languageLabel) languageLabel.textContent = LANGUAGE_NAMES[selected];

  if (forceOpen || bar.hidden) bar.hidden = false;
  document.body.classList.add('has-classic-google-translate-bar');
}

function normalizeSelectedLanguage(language) {
  const normalized = String(language || '')
    .trim()
    .toLowerCase()
    .split('-')[0];

  return Object.prototype.hasOwnProperty.call(LANGUAGE_FLAGS, normalized)
    ? normalized
    : 'es';
}

// La traducción se conserva en una cookie propia de Google Traductor.
// Al cambiar de idioma se recarga exactamente la misma URL, sin abrir
// translate.google.com ni sustituir el dominio por translate.goog.
function googleTranslationCookieValue(language) {
  const selected = normalizeSelectedLanguage(language);
  return selected === 'es' ? '' : `/es/${selected}`;
}

function setGoogleTranslationCookie(language) {
  const value = googleTranslationCookieValue(language);
  const secure = window.location.protocol === 'https:' ? ';Secure' : '';

  if (!value) {
    clearGoogleTranslationCookies();
    return;
  }

  document.cookie =
    `googtrans=${value};path=/;max-age=31536000;SameSite=Lax${secure}`;
}

function readTranslatedLanguage() {
  const match = document.cookie.match(
    /(?:^|;\s*)googtrans=\/es\/([a-z-]+)/i
  );

  return match ? normalizeSelectedLanguage(match[1]) : 'es';
}

function updateLanguageSelect(language) {
  const selected = normalizeSelectedLanguage(language);

  if (languageSelect) {
    languageSelect.value = selected;
    languageSelect.setAttribute(
      'aria-label',
      `Seleccionar idioma. Idioma actual: ${LANGUAGE_NAMES[selected]}`
    );
  }

  if (languageSelectFlag) {
    languageSelectFlag.src = LANGUAGE_FLAGS[selected];
  }

  document.documentElement.lang = selected;
}

function clearGoogleTranslationCookies() {
  const expired =
    'googtrans=;path=/;max-age=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax';

  document.cookie = expired;

  // Limpia también posibles cookies antiguas creadas por versiones previas.
  if (window.location.hostname && window.location.hostname.includes('.')) {
    document.cookie =
      `${expired};domain=.${window.location.hostname}`;
  }
}

function restoreSpanishVersion() {
  clearGoogleTranslationCookies();
  localStorage.setItem('guayeroSelectedLanguage', 'es');
  updateLanguageSelect('es');
  setClassicGoogleBar('es');
  window.location.reload();
}

function applyGoogleTranslation(language) {
  const selected = normalizeSelectedLanguage(language);

  localStorage.setItem('guayeroSelectedLanguage', selected);
  updateLanguageSelect(selected);
  setClassicGoogleBar(selected, true);
  setGoogleTranslationCookie(selected);

  // Mantiene el dominio y la ruta actuales. Google aplicará la cookie al
  // inicializarse de nuevo después de la recarga.
  window.location.reload();
}

languageSelect?.addEventListener('change', event => {
  applyGoogleTranslation(event.target.value);
});

const initialSelectedLanguage =
  localStorage.getItem('guayeroSelectedLanguage') ||
  readTranslatedLanguage();

updateLanguageSelect(initialSelectedLanguage);
setClassicGoogleBar(initialSelectedLanguage);

window.googleTranslateElementInit = function googleTranslateElementInit() {
  const target = document.getElementById('google_translate_element');

  if (
    !target ||
    !window.google ||
    !google.translate ||
    !google.translate.TranslateElement
  ) {
    return;
  }

  target.textContent = '';

  new google.translate.TranslateElement(
    {
      pageLanguage: 'es',
      includedLanguages: 'en,de,fr,it,pt,nl,pl',
      autoDisplay: false,
      multilanguagePage: true,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    'google_translate_element'
  );

  window.setTimeout(() => {
    const selected =
      localStorage.getItem('guayeroSelectedLanguage') ||
      readTranslatedLanguage();

    updateLanguageSelect(selected);
  }, 350);
};


// Galería accesible en ventana emergente (lightbox).
(() => {
  const triggers = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (!triggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'lightbox';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Vista ampliada de la imagen');
  modal.innerHTML = `
    <div class="lightbox__counter" aria-live="polite"></div>
    <button class="lightbox__close" type="button" aria-label="Cerrar imagen"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    <button class="lightbox__nav lightbox__prev" type="button" aria-label="Imagen anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
    <figure class="lightbox__figure">
      <img class="lightbox__image" alt="" />
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__next" type="button" aria-label="Imagen siguiente"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`;
  document.body.appendChild(modal);

  const image = modal.querySelector('.lightbox__image');
  const caption = modal.querySelector('.lightbox__caption');
  const counter = modal.querySelector('.lightbox__counter');
  const closeButton = modal.querySelector('.lightbox__close');
  const prevButton = modal.querySelector('.lightbox__prev');
  const nextButton = modal.querySelector('.lightbox__next');
  let group = [];
  let current = 0;
  let lastFocused = null;

  triggers.forEach(trigger => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', event => {
      event.preventDefault();
      const groupName = trigger.dataset.lightbox || 'default';
      group = triggers.filter(item => (item.dataset.lightbox || 'default') === groupName);
      current = group.indexOf(trigger);
      lastFocused = trigger;
      open();
    });
  });

  function itemData(item) {
    const img = item.querySelector('img');
    return {
      src: item.getAttribute('href') || img?.currentSrc || img?.src || '',
      alt: img?.alt || item.getAttribute('aria-label') || 'Imagen ampliada'
    };
  }

  function render() {
    const data = itemData(group[current]);
    image.src = data.src;
    image.alt = data.alt;
    caption.textContent = data.alt;
    counter.textContent = `${current + 1} / ${group.length}`;
    const showNavigation = group.length > 1;
    prevButton.hidden = !showNavigation;
    nextButton.hidden = !showNavigation;
  }

  function open() {
    render();
    modal.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    image.removeAttribute('src');
    if (lastFocused) lastFocused.focus();
  }

  function move(direction) {
    current = (current + direction + group.length) % group.length;
    render();
  }

  closeButton.addEventListener('click', close);
  prevButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  modal.addEventListener('click', event => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
})();


// ==========================================================
// Animaciones al cargar y al hacer scroll
// ==========================================================
document.documentElement.classList.add('js-animations');

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function markPageReady() {
  document.body.classList.add('page-ready');
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => window.requestAnimationFrame(markPageReady),
    { once: true }
  );
} else {
  window.requestAnimationFrame(markPageReady);
}

const animationSelectors = [
  '.section-title',
  '.title-rule',
  '.two-col > *',
  '.features .feature',
  '.treatment-grid .treatment-card',
  '.tech-copy',
  '.tech-image',
  '.reviews .review',
  '.contact-info',
  '.map-wrap',
  '.content-grid > *',
  '.clinic-story-grid > *',
  '.clinic-gallery a',
  '.team-intro-grid > *',
  '.doctors-grid .doctor-card',
  '.team-portrait-gallery a',
  '.blog-layout > *',
  '.blog-card',
  '.contact-cards .contact-card',
  '.contact-form',
  '.treatment-split > *',
  '.treatment-features .feature',
  '.treatment-content > *',
  '.treatment-contact-block > *',
  '.ortho-feature',
  '.ortho-gallery a',
  '.surgery-block',
  '.social-band > *',
  '.legal-section > *',
  '.legal-contact-section .contact-block > *'
];

const revealElements = Array.from(
  document.querySelectorAll(animationSelectors.join(','))
);

revealElements.forEach((element, index) => {
  element.classList.add('reveal');

  const parent = element.parentElement;
  if (
    parent?.matches(
      '.two-col,.content-grid,.clinic-story-grid,.team-intro-grid,' +
      '.treatment-split,.treatment-contact-block,.blog-layout'
    )
  ) {
    const siblings = Array.from(parent.children);
    const position = siblings.indexOf(element);
    element.classList.add(position % 2 === 0 ? 'reveal-left' : 'reveal-right');
  }

  if (
    element.matches(
      '.feature,.treatment-card,.review,.contact-card,.doctor-card,' +
      '.clinic-gallery a,.team-portrait-gallery a,.ortho-gallery a'
    )
  ) {
    element.classList.add('reveal-scale');
  }

  element.style.setProperty(
    '--motion-delay',
    `${(index % 6) * 70}ms`
  );
});

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold:0.12,
      rootMargin:'0px 0px -7% 0px'
    }
  );

  revealElements.forEach(element => revealObserver.observe(element));
}

// La sombra del menú al hacer scroll está al principio de este archivo.


// El efecto parallax del fondo de cabecera se ha desactivado: repintaba
// la imagen en cada evento de scroll y producía tirones.

// ==========================================================
// Aparición suave de los bloques [data-reveal] (portada y páginas interiores) al hacer scroll.
(() => {
  const items = document.querySelectorAll('[data-reveal]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }
  document.documentElement.classList.add('hp-motion');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => io.observe(el));
})();

// ==========================================================
// Aviso de cookies. Se muestra hasta que el usuario acepta o rechaza;
// la elección se guarda en el navegador durante 12 meses.
// ==========================================================
(function cookieNotice() {
  const KEY = 'guayero-cookies';
  const MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && Date.now() - saved.date < MAX_AGE) return;
  } catch (e) { /* sin almacenamiento: se muestra el aviso */ }

  const style = document.createElement('style');
  style.textContent = `
.gc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:760px;margin:0 auto;
  display:flex;align-items:center;gap:20px;padding:18px 22px;background:#221a15;color:#efe7da;
  border-radius:6px;box-shadow:0 24px 50px -18px rgba(34,26,21,.6);
  font:14px/1.5 "Manrope","Helvetica Neue",Arial,sans-serif}
.gc-banner p{margin:0;flex:1}
.gc-banner a{color:#d7ba68;text-decoration:underline}
.gc-actions{display:flex;gap:10px;flex-shrink:0}
.gc-btn{cursor:pointer;border-radius:999px;padding:10px 20px;font:600 14px/1 inherit;font-family:inherit;
  border:1px solid #d7ba68;background:transparent;color:#efe7da}
.gc-btn--accept{background:#d7ba68;color:#221a15}
.gc-btn:hover{filter:brightness(1.08)}
.gc-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
@media (max-width:640px){.gc-banner{flex-direction:column;align-items:stretch;gap:14px;padding:16px}
  .gc-actions .gc-btn{flex:1}}`;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.className = 'gc-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML =
    '<p>Utilizamos cookies propias y de terceros para mejorar nuestros servicios y tu experiencia de navegación. ' +
    'Puedes aceptar su uso o rechazarlas. ' +
    'Más información en nuestra <a href="politica-de-cookies.html">Política de cookies</a>.</p>' +
    '<div class="gc-actions">' +
    '<button type="button" class="gc-btn" data-choice="rejected">Rechazar</button>' +
    '<button type="button" class="gc-btn gc-btn--accept" data-choice="accepted">Aceptar</button>' +
    '</div>';
  banner.addEventListener('click', e => {
    const btn = e.target.closest('[data-choice]');
    if (!btn) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice: btn.dataset.choice, date: Date.now() }));
    } catch (err) { /* sin almacenamiento */ }
    banner.remove();
  });
  document.body.appendChild(banner);
})();
