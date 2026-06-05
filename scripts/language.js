let translations = {};

document.addEventListener("DOMContentLoaded", initLanguage);

function initLanguage() {
  loadLanguage(getCurrentLanguage());

  const deBtn = document.getElementById("de-btn");
  const enBtn = document.getElementById("en-btn");

  if (deBtn) {
    deBtn.addEventListener("click", () => {
      loadLanguage("de");
    });
  }

  if (enBtn) {
    enBtn.addEventListener("click", () => {
      loadLanguage("en");
    });
  }
}

function getCurrentLanguage() {
  return localStorage.getItem("language") || "de";
}

async function loadLanguage(language) {
  try {
    const response = await fetch(`./assets/i18n/${language}.json`);

    translations = await response.json();

    applyTranslations();

    localStorage.setItem("language", language);

    document.dispatchEvent(new CustomEvent("languageLoaded"));
  } catch (error) {
    console.error("Fehler beim Laden der Sprache:", error);
  }
}

function getTranslation(key) {
  return translations[key] || key;
}

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
