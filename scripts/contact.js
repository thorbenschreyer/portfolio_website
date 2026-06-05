const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("userMessage");
const errorMessageElement = document.getElementById("error-text");
const checkbox = document.getElementById("checkbox");
const checkboxLabel = document.querySelector(".custom-checkbox");

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
 * Adds validation behavior to an input field.
 * Displays an error message when the field loses focus and is empty,
 * and restores the default state when the field gains focus again.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input - The input element to validate.
 * @param {string} errorMessage - The error message displayed when the field is empty.
 */
function checkIsFieldEmpty(input, errorKey) {
  input.addEventListener("blur", function () {
    if (this.value.trim() === "") {
      this.dataset.errorKey = errorKey;
      this.value = getTranslation(errorKey);
      this.style.color = "#FD2E12";
      this.style.borderColor = "#FD2E12";
    }
  });

  input.addEventListener("focus", function () {
    if (this.dataset.errorKey) {
      this.value = "";
      delete this.dataset.errorKey;

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

  if (!nameRegex.test(name) || name === getTranslation("error-invalid-name")) {
    errorMessageElement.innerText = getTranslation("error-invalid-name");
    return false;
  }

  if (
    email === "" ||
    email === getTranslation("error-invalid-email") ||
    !emailRegex.test(email)
  ) {
    errorMessageElement.innerText = getTranslation("error-invalid-email");
    return false;
  }

  if (
    userMessage === "" ||
    userMessage === getTranslation("error-empty-message")
  ) {
    errorMessageElement.innerText = getTranslation("error-empty-message");
    return false;
  }

  if (!checkbox.checked) {
    errorMessageElement.innerText = getTranslation("error-privacy-policy");
    checkboxLabel.classList.add("error");
    return false;
  }

  checkboxLabel.classList.remove("error");
  errorMessageElement.innerText = "";
  return true;
}

/* -------------------------------------------------------------------------- */
/*                              Event Listeners                               */
/* -------------------------------------------------------------------------- */

/**
 * Removes the checkbox error state when the user accepts
 * the privacy policy.
 */
if (checkbox) {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      checkboxLabel.classList.remove("error");
      errorMessageElement.innerText = "";
    }
  });
}

function initValidation() {
  checkIsFieldEmpty(nameInput, "error-name-required");
  checkIsFieldEmpty(emailInput, "error-email-required");
  checkIsFieldEmpty(messageInput, "error-message-required");
}

/**
 * Starts the application and loads the current language.
 *
 * @returns {void}
 */
function init() {
  initValidation();
  loadLanguage(getCurrentLanguage());
}

/**
 * Initializes the translation system after the DOM has been fully loaded.
 * Loads the currently selected language or the default language.
 */
document.addEventListener("DOMContentLoaded", init);
