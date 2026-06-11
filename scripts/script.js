const navLinks = document.querySelectorAll(".navigation-item");
const sections = document.querySelectorAll("section");
const mobileMenu = registerDialog("mobile-menu");
const slider = document.querySelector(".all-references");
const dots = document.querySelectorAll(".dot");
const cards = document.querySelectorAll(".project");

let isManualScrolling = false;
let translations = {};

document.addEventListener("DOMContentLoaded", () => {
  initHorizontalWheelScroll();
});

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
  { threshold: 0.3 },
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


/**
 * Enables horizontal scrolling with the mouse wheel on desktop devices.
 *
 * The vertical wheel movement (`deltaY`) is converted into horizontal
 * scrolling inside the main content container. This behavior is disabled
 * on mobile devices (viewport width <= 980px).
 *
 * @returns {void}
 */
function initHorizontalWheelScroll() {
  const container =
    document.querySelector(".sections") ||
    document.querySelector(".impressum-container")

  if (!container) return;

  container.addEventListener(
    "wheel",
    (event) => {
      if (window.innerWidth <= 980) return;

      event.preventDefault();

      container.scrollLeft += event.deltaY * 4;
    },
    { passive: false }
  );
}

/**
 * Handles anchor navigation on desktop devices.
 *
 * Prevents the browser's default anchor behavior and smoothly scrolls
 * the horizontal content container to the target section.
 *
 * This navigation is only intended for layouts that use horizontal
 * scrolling between sections.
 *
 * @param {MouseEvent} event - The click event triggered by the anchor link.
 * @returns {void}
 */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    const container =
      document.querySelector(".sections") ||
      document.querySelector(".impressum-content");

    if (!container) return;

    event.preventDefault();

    container.scrollTo({
      left: target.offsetLeft - 172,
      behavior: "smooth",
    });
  });
});

/**
 * Handles anchor navigation on mobile devices.
 *
 * Prevents the browser's default anchor behavior and smoothly scrolls
 * the target section into view using vertical scrolling.
 *
 * This behavior is only applied on devices with a viewport width
 * of 980px or less.
 *
 * @param {MouseEvent} event - The click event triggered by the anchor link.
 * @returns {void}
 */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (window.innerWidth > 980) return;

    event.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

/* -------------------------------------------------------------------------- */
/*                          Dialog Management                                 */
/* -------------------------------------------------------------------------- */

function openMenuDialog() {
  mobileMenu.showModal();
}

function closeMenuDialog() {
  setTimeout(() => {
    mobileMenu.close();
  }, 100);
}

function showSucsessDialog() {
  sucsessDialog.showModal();
  setTimeout(() => {
    sucsessDialog.close();
  }, 3000);
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
  updateToggleTexts();
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

/**
 * Toggle show more and less
 */
function updateToggleTexts() {
  cards.forEach((card) => {
    const button = card.querySelector(".toggle");

    if (card.classList.contains("active")) {
      button.textContent = getTranslation("show-less");
    } else {
      button.textContent = getTranslation("show-more");
    }
  });
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

/**
 * Registers a dialog element
 * and allows closing it by clicking outside.
 *
 * @param {string} dialogID - Dialog element ID.
 * @returns {HTMLDialogElement} Registered dialog element.
 */
function registerDialog(dialogID) {
  const dialog = document.getElementById(dialogID);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  handleGerman();
  handleEnglish();
  return dialog;
}

/**
 * Change the Language to german
 */
function handleGerman() {
  document
    .getElementById("de-btn-mobile")
    .addEventListener("click", () => handleLanguageChange("de"));
}

/**
 * Change the Language to english
 */
function handleEnglish() {
  document
    .getElementById("en-btn-mobile")
    .addEventListener("click", () => handleLanguageChange("en"));
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

document.addEventListener("DOMContentLoaded", init);

/**
 * Handles the expand/collapse behavior of project cards.
 *
 * When a card is clicked:
 * - If the card is already active, the view scrolls smoothly
 *   to the card and then collapses it after a short delay.
 * - If the card is inactive, all other cards are collapsed
 *   and the selected card is expanded.
 *
 * This ensures that only one project card can be open at a time.
 *
 * @returns {void}
 */
cards.forEach((card) => {
  const button = card.querySelector(".toggle");

  button.addEventListener("click", () => {
    const isActive = card.classList.contains("active");
    if (isActive) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        card.classList.remove("active");
      }, 400);
      return;
    }
    cards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    updateToggleTexts();
  });
});