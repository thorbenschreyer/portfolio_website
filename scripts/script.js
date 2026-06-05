const navLinks = document.querySelectorAll(".navigation-item");
const sections = document.querySelectorAll("section");

let isManualScrolling = false;
let translations = {};

/**
 * Observes section visibility and updates the active navigation item
 * based on the currently visible section.
 * Automatic updates are disabled during manual scrolling.
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

/* -------------------------------------------------------------------------- */
/*                              Initialization                                */
/* -------------------------------------------------------------------------- */

sections.forEach((section) => {
  observer.observe(section);
});

/**
 * Updates the active navigation item when a navigation link is clicked.
 * Temporarily disables automatic section-based navigation highlighting
 * while the user is manually scrolling.
 */
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    isManualScrolling = true;

    navLinks.forEach((nav) => {
      nav.classList.remove("isActive");
    });

    link.classList.add("isActive");

    setTimeout(() => {
      isManualScrolling = false;
    }, 1000);
  });
});

/**
 * Automatically scrolls to the contact section after page load.
 *
 * NOTE:
 * This code is intended for development and testing purposes
 * and should be removed before production deployment.
 */
window.addEventListener("load", () => {
  const container = document.querySelector(".sections");
  const target = document.querySelector("#contact-section");

  if (container && target) {
    container.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }
});

/**
 * Retrieves the currently selected language from local storage.
 * Returns German ("de") if no language has been stored yet.
 *
 * @returns {string} The language code (e.g. "de" or "en")
 */
function getCurrentLanguage() {
  return localStorage.getItem("language") || "de";
}

/**
 * Loads the translation file for the specified language,
 * stores the translations, updates the UI, and saves the
 * selected language in local storage.
 *
 * @async
 * @param {string} language - The language code to load.
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
 * Returns the translated text for the given key.
 * If no translation is found, the key itself is returned.
 *
 * @param {string} key - The translation key.
 * @returns {string} The translated text.
 */
function getTranslation(key) {
  return translations[key] || key;
}

/**
 * Updates all elements containing the `data-i18n` attribute
 * with their corresponding translated text.
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

function updateErrorMessages() {
  const elements = document.querySelectorAll(
    "input[data-error-key], textarea[data-error-key]",
  );

  elements.forEach((element) => {
    element.value = getTranslation(element.dataset.errorKey);
  });
}

/**
 * Loads the German translation file when the German language button is clicked.
 */
document.getElementById("de-btn").addEventListener("click", () => {
  loadLanguage("de");
});

/**
 * Loads the English translation file when the English language button is clicked.
 */
document.getElementById("en-btn").addEventListener("click", () => {
  loadLanguage("en");
});
