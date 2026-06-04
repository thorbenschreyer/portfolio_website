const navLinks = document.querySelectorAll(".navigation-item");
const sections = document.querySelectorAll("section");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("userMessage");
const errorMessageElement = document.getElementById("error-text");
const checkbox = document.getElementById("checkbox");
const checkboxLabel = document.querySelector(".custom-checkbox");

let isManualScrolling = false;
let translations = {};

/**
 * Adds validation behavior to an input field.
 * Displays an error message when the field loses focus and is empty,
 * and restores the default state when the field gains focus again.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input - The input element to validate.
 * @param {string} errorMessage - The error message displayed when the field is empty.
 */
function checkIsFieldEmpty(input, errorMessage) {
  input.addEventListener("blur", function () {
    if (this.value.trim() === "") {
      this.value = errorMessage;
      this.style.color = "#FD2E12";
      this.style.borderColor = "#FD2E12";
    }
  });

  input.addEventListener("focus", function () {
    if (this.value === errorMessage) {
      this.value = "";
      this.style.color = "";
      this.style.borderColor = "";
    }
  });
}

/**
 * Validates all form fields before submission.
 *
 * Validation rules:
 * - Name must contain only letters, spaces, apostrophes, and hyphens.
 * - Email must contain a valid format and supported domain.
 * - Message field must not be empty.
 * - Privacy policy checkbox must be checked.
 *
 * @returns {boolean} Returns true if all fields are valid; otherwise false.
 */
function validateInput() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const userMessage = document.getElementById("userMessage").value.trim();

  const nameRegex = /^[A-Za-zÄÖÜäöüß\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.(de|com|org|net)$/;

  if (!nameRegex.test(name) || name === "Your name is required") {
    errorMessageElement.innerText =
      "Invalid name. Only letters and hyphens allowed.";
    return false;
  }

  if (
    email === "" ||
    email === "Your email is required" ||
    !emailRegex.test(email)
  ) {
    errorMessageElement.innerText =
      "Invalid email. '@' and a valid domain are required.";
    return false;
  }

  if (userMessage === "" || userMessage === "Your message is required") {
    errorMessageElement.innerText = "An empty message is not allowed.";
    return false;
  }

  if (!checkbox.checked) {
    errorMessageElement.innerText = "Please accept the privacy policy.";
    checkboxLabel.classList.add("error");
    return false;
  }

  checkboxLabel.classList.remove("error");
  errorMessageElement.innerText = "";
  return true;
}

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

checkIsFieldEmpty(nameInput, "Your name is required");
checkIsFieldEmpty(emailInput, "Your email is required");
checkIsFieldEmpty(messageInput, "Your message is required");

sections.forEach((section) => {
  observer.observe(section);
});

/* -------------------------------------------------------------------------- */
/*                              Event Listeners                               */
/* -------------------------------------------------------------------------- */

/**
 * Removes the checkbox error state when the user accepts
 * the privacy policy.
 */
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    checkboxLabel.classList.remove("error");
    errorMessageElement.innerText = "";
  }
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
 * Handles form submission.
 * Prevents the default browser behavior, validates user input,
 * and sends the form data to the server via a POST request.
 */
document.getElementById("kontaktForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateInput()) {
    return;
  }

  fetch("./assets/php/formular.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("userMessage").value,
    }),
  })
    .then(async (response) => {
      const text = await response.text();
      console.log(text);

      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("userMessage").value = "";

      checkbox.checked = false;
      checkboxLabel.classList.remove("checked");
    })
    .catch((err) => console.error(err));
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






// Translations
async function loadLanguage(language) {
  try {
    const response = await fetch(`./assets/i18n/${language}.json`);

    translations = await response.json();

    applyTranslations();

    localStorage.setItem("language", language);
  } catch (error) {
    console.error(error);
  }
}

function getTranslation(key) {
  return translations[key] || key;
}

function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((element) => {
    const key = element.dataset.i18n;

    element.textContent = getTranslation(key);
  });
}

document
    .getElementById('de-btn')
    .addEventListener('click', () => {
        loadLanguage('de');
    });

document
    .getElementById('en-btn')
    .addEventListener('click', () => {
        loadLanguage('en');
    });