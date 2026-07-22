// Barra de navegación única para todas las páginas.
const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('.nav');
const treatmentDropdown = document.querySelector('.dropdown');
const treatmentToggle = document.querySelector('.nav-treatments');

const NAV_PAGE_BY_FILE = {
  'index.html': 'home',
  'la-clinica.html': 'clinic',
  'el-equipo.html': 'team',
  'blog.html': 'blog',
  'contacto.html': 'contact',
  'radiologia.html': 'radiology',
  'escaner-intraoral.html': 'scanner',
  'ortodoncia.html': 'orthodontics',
  'cirugia-oral.html': 'surgery',
  'implantologia-avanzada.html': 'implants'
};

const TREATMENT_PAGES = new Set([
  'radiology',
  'scanner',
  'orthodontics',
  'surgery',
  'implants'
]);

function navigationFileName() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const lastPart = parts.at(-1) || 'index.html';
  return lastPart.includes('.') ? lastPart : 'index.html';
}

function setActiveNavigation() {
  const currentPage = NAV_PAGE_BY_FILE[navigationFileName()] || 'home';

  document.querySelectorAll('[data-nav-page]').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });

  const exactLink = document.querySelector(
    `[data-nav-page="${currentPage}"]`
  );

  if (exactLink) {
    exactLink.classList.add('active');
    exactLink.setAttribute('aria-current', 'page');
  }

  if (TREATMENT_PAGES.has(currentPage) && treatmentToggle) {
    treatmentToggle.classList.add('active');
  }
}

function setMainMenu(open) {
  if (!menuToggle || !mainNavigation) return;

  mainNavigation.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');

  const icon = menuToggle.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-xmark', open);
  }

  if (!open && treatmentDropdown && treatmentToggle) {
    treatmentDropdown.classList.remove('open');
    treatmentToggle.setAttribute('aria-expanded', 'false');
  }
}

function setTreatmentMenu(open) {
  if (!treatmentDropdown || !treatmentToggle) return;

  treatmentDropdown.classList.toggle('open', open);
  treatmentToggle.setAttribute('aria-expanded', String(open));
}

menuToggle?.addEventListener('click', () => {
  setMainMenu(!mainNavigation?.classList.contains('open'));
});

treatmentToggle?.addEventListener('click', event => {
  if (window.innerWidth <= 980) {
    event.preventDefault();
    setTreatmentMenu(!treatmentDropdown?.classList.contains('open'));
  }
});

document.querySelectorAll('.nav a[href]').forEach(link => {
  link.addEventListener('click', () => {
    if (
      window.innerWidth <= 980 &&
      !link.classList.contains('nav-treatments')
    ) {
      setMainMenu(false);
    }
  });
});

document.addEventListener('click', event => {
  if (
    window.innerWidth <= 980 &&
    mainNavigation?.classList.contains('open') &&
    !mainNavigation.contains(event.target) &&
    !menuToggle?.contains(event.target)
  ) {
    setMainMenu(false);
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setTreatmentMenu(false);
    setMainMenu(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    setMainMenu(false);
    setTreatmentMenu(false);
  }
});

setActiveNavigation();


document.querySelectorAll('form[data-demo-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) {
      status.textContent = 'Formulario preparado. Conecta aquí tu servicio de correo o backend.';
    }
    form.reset();
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

  const siteHeader = document.querySelector('.site-header');
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

// Se utiliza solamente como respaldo al probar el proyecto en localhost.
// Cuando publiques la réplica en otro dominio, cambia esta dirección.
const TRANSLATION_PUBLIC_ORIGIN = 'https://clinicadentalguayero.es';

const TRANSLATION_PUBLIC_ROUTES = {
  'index.html': '/',
  'la-clinica.html': '/la-clinica/',
  'el-equipo.html': '/el-equipo/',
  'blog.html': '/blog/',
  'contacto.html': '/contacto/',
  'radiologia.html': '/radiologia/',
  'escaner-intraoral.html': '/escaner-intraoral/',
  'ortodoncia.html': '/ortodoncia/',
  'cirugia-oral.html': '/cirugia-oral/',
  'implantologia-avanzada.html': '/implantologia-avanzada/',
  'politica-de-cookies.html': '/politica-de-cookies/',
  'politica-de-privacidad.html': '/politica-de-privacidad/',
  'aviso-legal.html': '/aviso-legal/'
};

function normalizeSelectedLanguage(language) {
  const normalized = String(language || '')
    .trim()
    .toLowerCase()
    .split('-')[0];

  return Object.prototype.hasOwnProperty.call(LANGUAGE_FLAGS, normalized)
    ? normalized
    : 'es';
}

function currentTranslationFileName() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const lastPart = parts.at(-1) || 'index.html';

  return lastPart.includes('.') ? lastPart : 'index.html';
}

function isLocalTranslationPreview() {
  const hostname = window.location.hostname;

  return (
    window.location.protocol === 'file:' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  );
}

function sourcePageForGoogleTranslation() {
  if (
    !isLocalTranslationPreview() &&
    /^https?:$/.test(window.location.protocol) &&
    !window.location.hostname.endsWith('.translate.goog') &&
    window.location.hostname !== 'translate.google.com'
  ) {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = '';
    return currentUrl.toString();
  }

  const route =
    TRANSLATION_PUBLIC_ROUTES[currentTranslationFileName()] || '/';

  return new URL(route, TRANSLATION_PUBLIC_ORIGIN).toString();
}

function buildGoogleTranslationUrl(language) {
  const selected = normalizeSelectedLanguage(language);
  const googleUrl = new URL('https://translate.google.com/translate');

  googleUrl.searchParams.set('sl', 'es');
  googleUrl.searchParams.set('tl', selected);
  googleUrl.searchParams.set('hl', selected);
  googleUrl.searchParams.set('u', sourcePageForGoogleTranslation());

  return googleUrl.toString();
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
  document.cookie =
    'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';

  if (window.location.hostname && window.location.hostname.includes('.')) {
    document.cookie =
      `googtrans=;path=/;domain=.${window.location.hostname};` +
      'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

function restoreSpanishVersion() {
  clearGoogleTranslationCookies();
  localStorage.setItem('guayeroSelectedLanguage', 'es');
  updateLanguageSelect('es');
  setClassicGoogleBar('es');

  // Si estamos dentro de una página traducida por Google, vuelve al original.
  if (
    window.location.hostname.endsWith('.translate.goog') ||
    window.location.hostname === 'translate.google.com'
  ) {
    window.location.assign(sourcePageForGoogleTranslation());
    return;
  }

  window.location.reload();
}

function useOfficialGoogleWidget(language) {
  const selected = normalizeSelectedLanguage(language);
  const googleCombo = document.querySelector('.goog-te-combo');

  if (!googleCombo) return false;

  googleCombo.value = selected;
  googleCombo.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function applyGoogleTranslation(language) {
  const selected = normalizeSelectedLanguage(language);

  localStorage.setItem('guayeroSelectedLanguage', selected);
  updateLanguageSelect(selected);
  setClassicGoogleBar(selected, true);

  if (selected === 'es') {
    restoreSpanishVersion();
    return;
  }

  // Primera opción: utiliza el selector oficial oculto de Google.
  if (useOfficialGoogleWidget(selected)) return;

  // Respaldo: si el script oficial tarda o está bloqueado, abre Google
  // Traductor con la URL pública equivalente. Así el desplegable nunca queda
  // inutilizado.
  window.location.assign(buildGoogleTranslationUrl(selected));
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

const animatedHeader = document.querySelector('.site-header');

function updateAnimatedHeader() {
  animatedHeader?.classList.toggle('is-scrolled', window.scrollY > 34);
}

updateAnimatedHeader();
window.addEventListener('scroll', updateAnimatedHeader, { passive:true });

const animatedHero = document.querySelector(
  '.hero,.page-hero,.clinic-page-hero,.team-page-hero,.treatment-hero-v2'
);

function updateHeroDepth() {
  if (
    reducedMotion ||
    !animatedHero ||
    window.innerWidth <= 980 ||
    window.scrollY > window.innerHeight
  ) {
    return;
  }

  animatedHero.style.setProperty(
    '--hero-shift',
    `${Math.min(window.scrollY * 0.08, 22)}px`
  );
}

updateHeroDepth();
window.addEventListener('scroll', updateHeroDepth, { passive:true });
