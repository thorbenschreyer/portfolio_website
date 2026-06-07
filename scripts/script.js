const navLinks = document.querySelectorAll(".navigation-item");
const sections = document.querySelectorAll("section");

let isManualScrolling = false;
let translations = {};

/* -------------------------------------------------------------------------- */
/*                              Navigation                                    */
/* -------------------------------------------------------------------------- */

/**
 * Observes all sections and automatically updates the active
 * navigation item based on the currently visible section.
 *
 * Automatic updates are temporarily disabled while the user
 * is manually navigating through the page.
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isManualScrolling) {
        navLinks.forEach((link) => {
          link.classList.remove("isActive");
        });

        const activeLink = document.querySelector(
          `.navigation-item[href="#${entry.target.id}"]`,
        );

        if (activeLink) {
          activeLink.classList.add("isActive");
        }
      }
    });
  },
  {
    threshold: 0.9,
  },
);

/**
 * Registers all sections with the Intersection Observer
 * so navigation highlighting can be updated automatically.
 *
 * @returns {void}
 */
function initSectionObserver() {
  sections.forEach((section) => {
    observer.observe(section);
  });
}

/**
 * Updates the active navigation state when a navigation
 * item is clicked.
 *
 * Automatic navigation highlighting is temporarily disabled
 * to prevent conflicts during manual scrolling.
 *
 * @param {MouseEvent} event - Navigation click event.
 */
function handleNavigationClick(event) {
  isManualScrolling = true;

  navLinks.forEach((nav) => {
    nav.classList.remove("isActive");
  });

  event.currentTarget.classList.add("isActive");

  setTimeout(() => {
    isManualScrolling = false;
  }, 1000);
}

/* -------------------------------------------------------------------------- */
/*                              Language                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns the currently selected language.
 *
 * If no language has been stored yet, German ("de")
 * is used as the default language.
 *
 * @returns {string} Current language code.
 */
function getCurrentLanguage() {
  return localStorage.getItem("language") || "de";
}

/**
 * Loads a translation file, updates all translated content
 * on the page and stores the selected language.
 *
 * @async
 * @param {string} language - Language code to load.
 * @returns {Promise<void>}
 */
async function loadLanguage(language) {
  const response = await fetch(`./assets/i18n/${language}.json`);

  translations = await response.json();

  applyTranslations();
  updateErrorMessages();

  localStorage.setItem("language", language);
}

/**
 * Returns the translation for a given key.
 *
 * If the key does not exist in the translation object,
 * the key itself is returned as a fallback.
 *
 * @param {string} key - Translation key.
 * @returns {string} Translated text.
 */
function getTranslation(key) {
  return translations[key] || key;
}

/**
 * Updates all translatable elements on the page.
 *
 * Supports:
 * - Text content via data-i18n
 * - HTML content via data-i18n-html
 * - Input placeholders via data-i18n-placeholder
 *
 * @returns {void}
 */
function applyTranslations() {
  const textElements = document.querySelectorAll("[data-i18n]");

  textElements.forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = getTranslation(key);
  });

  const htmlElements = document.querySelectorAll("[data-i18n-html]");

  htmlElements.forEach((element) => {
    const key = element.dataset.i18nHtml;
    element.innerHTML = getTranslation(key);
  });

  const placeholderElements = document.querySelectorAll(
    "[data-i18n-placeholder]",
  );

  placeholderElements.forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = getTranslation(key);
  });
}

/**
 * Updates validation error messages that are currently
 * displayed inside input and textarea fields.
 *
 * This ensures that visible validation messages are also
 * translated when the language changes.
 *
 * @returns {void}
 */
function updateErrorMessages() {
  const elements = document.querySelectorAll(
    "input[data-error-key], textarea[data-error-key]",
  );

  elements.forEach((element) => {
    element.value = getTranslation(element.dataset.errorKey);
  });
}

/**
 * Switches the application language.
 *
 * @param {string} language - Language code.
 * @returns {void}
 */
function handleLanguageChange(language) {
  loadLanguage(language);
}

/* -------------------------------------------------------------------------- */
/*                              Development                                   */
/* -------------------------------------------------------------------------- */

/**
 * Scrolls automatically to the contact section after page load.
 *
 * This helper is intended for development and testing only
 * and should be removed before deployment.
 *
 * @returns {void}
 */
function scrollToContactSection() {
  const container = document.querySelector(".sections");
  const target = document.querySelector("#hero-section");

  if (container && target) {
    container.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                              Initialization                                */
/* -------------------------------------------------------------------------- */

/**
 * Initializes navigation and loads the current language.
 *
 * @returns {void}
 */
function init() {
  initSectionObserver();
  loadLanguage(getCurrentLanguage());
}

/* -------------------------------------------------------------------------- */
/*                              Event Listeners                               */
/* -------------------------------------------------------------------------- */

navLinks.forEach((link) => {
  link.addEventListener("click", handleNavigationClick);
});

document
  .getElementById("de-btn")
  .addEventListener("click", () => handleLanguageChange("de"));

document
  .getElementById("en-btn")
  .addEventListener("click", () => handleLanguageChange("en"));

window.addEventListener("load", scrollToContactSection);

document.addEventListener("DOMContentLoaded", init);
