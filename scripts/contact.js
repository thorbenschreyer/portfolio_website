const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("userMessage");
const errorMessageElement = document.getElementById("error-text");
const checkbox = document.getElementById("checkbox");
const checkboxLabel = document.querySelector(".custom-checkbox");
const sucsessDialog = registerDialog("sucsess-dialog");
document.getElementById("name").addEventListener("input", checkForm);
document.getElementById("email").addEventListener("input", checkForm);
document.getElementById("userMessage").addEventListener("input", checkForm);
document.getElementById("checkbox").addEventListener("change", checkForm);
nameInput.addEventListener("blur", showNameError);
emailInput.addEventListener("blur", showEmailError);
messageInput.addEventListener("blur", showMessageError);

/* -------------------------------------------------------------------------- */
/*                              Validation                                    */
/* -------------------------------------------------------------------------- */

/**
 * Adds validation behavior to an input field.
 *
 * If the field is left empty when losing focus, a translated
 * error message is displayed directly inside the field and
 * the input receives an error style.
 *
 * When the field gains focus again, the error state is removed
 * and the original styling is restored.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} input - Field to validate.
 * @param {string} errorKey - Translation key for the error message.
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
 * Checks whether the entire form is valid and enables or disables
 * the submit button accordingly.
 *
 * Requirements:
 * - Valid name
 * - Valid email address
 * - Non-empty message
 * - Privacy policy checkbox is checked
 *
 * @returns {void}
 */
function checkForm() {
  const button = document.getElementById("send-button");

  const isValid =
    validateName() &&
    validateEmail() &&
    validateMassage() &&
    checkbox.checked;

  button.classList.toggle("btn-disable", !isValid);
}

/**
 * Validates all form inputs and displays the corresponding error message.
 *
 * Validation order:
 * 1. Name
 * 2. Email
 * 3. Message
 * 4. Privacy policy consent
 *
 * @returns {boolean} Returns `true` if all inputs are valid; otherwise `false`.
 */
function validateInput() {
  if (!validateName()) {
    errorMessageElement.innerText =
      getTranslation("error-invalid-name");
    return false;
  }

  if (!validateEmail()) {
    errorMessageElement.innerText =
      getTranslation("error-invalid-email");
    return false;
  }

  if (!validateMassage()) {
    errorMessageElement.innerText =
      getTranslation("error-empty-message");
    return false;
  }

  if (!checkbox.checked) {
    errorMessageElement.innerText =
      getTranslation("error-privacy-policy");
    checkboxLabel.classList.add("error");
    return false;
  }

  return true;
}

/**
 * Validates the name input against the allowed character set.
 *
 * Allowed characters:
 * - Letters (including German umlauts and ß)
 * - Spaces
 * - Apostrophes (')
 * - Hyphens (-)
 *
 * @returns {boolean} Returns `true` if the name is valid; otherwise `false`.
 */
function validateName() {
  const name = nameInput.value.trim();
  const nameRegex = /^[A-Za-zÄÖÜäöüß\s'-]+$/;

  return nameRegex.test(name);
}

/**
 * Displays an error message if the name input is invalid.
 *
 * Clears the error message when the input becomes valid.
 *
 * @returns {void}
 */
function showNameError() {
  if (!validateName()) {
    errorMessageElement.innerText =
      getTranslation("error-invalid-name");
      nameInput.style.borderColor = "#FD2E12"
  } else {
    errorMessageElement.innerText = "";
    nameInput.style.borderColor = "#b5e93b"
  }
}

/**
 * Validates the email address against the expected format.
 *
 * Supported top-level domains:
 * - .de
 * - .com
 * - .org
 * - .net
 *
 * @returns {boolean} Returns `true` if the email address is valid;
 * otherwise `false`.
 */
function validateEmail() {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[a-zA-Z0-9-]+\.(de|com|org|net)$/;

  return emailRegex.test(email);
}

/**
 * Displays an error message if the email input is invalid.
 *
 * Clears the error message when the input becomes valid.
 *
 * @returns {void}
 */
function showEmailError() {
  if (!validateEmail()) {
    errorMessageElement.innerText =
      getTranslation("error-invalid-email");
      emailInput.style.borderColor = "#FD2E12"
  } else {
    errorMessageElement.innerText = "";
    emailInput.style.borderColor = "#b5e93b"
  }
}

/**
 * Checks whether the message field contains any non-whitespace characters.
 *
 * @returns {boolean} Returns `true` if a message has been entered;
 * otherwise `false`.
 */
function validateMassage() {
  return messageInput.value.trim() !== "";
}

/**
 * Displays an error message if the message field is empty.
 *
 * Clears the error message when a valid message is entered.
 *
 * @returns {void}
 */
function showMessageError() {
  if (!validateMassage()) {
    messageInput.style.borderColor = "#FD2E12"
    errorMessageElement.innerText =
      getTranslation("error-empty-message");
  } else {
    errorMessageElement.innerText = "";
    messageInput.style.borderColor = "#b5e93b"
  }
}

/* -------------------------------------------------------------------------- */
/*                              Initialization                                */
/* -------------------------------------------------------------------------- */

/**
 * Registers validation handlers for all form fields.
 *
 * @returns {void}
 */
function initValidation() {
  checkIsFieldEmpty(nameInput, "error-name-required");
  checkIsFieldEmpty(emailInput, "error-email-required");
  checkIsFieldEmpty(messageInput, "error-message-required");
}

/**
 * Initializes the application.
 *
 * Loads the currently selected language and activates
 * form validation.
 *
 * @returns {void}
 */
function init() {
  initValidation();
  loadLanguage(getCurrentLanguage());
  errorMessageElement.innerText = "";
}

/* -------------------------------------------------------------------------- */
/*                              Form Handling                                 */
/* -------------------------------------------------------------------------- */

/**
 * Handles the contact form submission.
 *
 * Prevents the default form behavior, validates all inputs,
 * sends the form data to the server and resets the form after
 * a successful request.
 *
 * @param {SubmitEvent} e - Form submit event.
 */
function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateInput()) {
    return;
  }
  fetch("./assets/php/formular.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    }),
  })
    .then(async (response) => {
      clearAllFields();
    })
    .catch((err) => console.error(err));
}

/**
 * Clear all inputfilds
 */
function clearAllFields() {
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";

  checkbox.checked = false;
  document.getElementById("send-button").classList.add("btn-disable");
  checkboxLabel.classList.remove("checked");
}

/* -------------------------------------------------------------------------- */
/*                              Event Listeners                               */
/* -------------------------------------------------------------------------- */

/**
 * Removes the checkbox error state as soon as the user
 * accepts the privacy policy.
 */
if (checkbox) {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      checkboxLabel.classList.remove("error");
      errorMessageElement.innerText = "";
    }
  });
}

document
  .getElementById("kontaktForm")
  .addEventListener("submit", handleFormSubmit);

/**
 * Starts the application once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", init);

/* -------------------------------------------------------------------------- */
/*                           Reference Slider                                 */
/* -------------------------------------------------------------------------- */

/**
 * Scrolls smoothly to the selected reference slide.
 *
 * The target slide is determined by its index within the
 * collection of reference elements.
 *
 * @param {number} index - Index of the reference slide.
 * @returns {void}
 */
function goToSlide(index) {
  const references = document.querySelectorAll(".reference");
  slider.scrollTo({
    left: references[index].offsetLeft,
    behavior: "smooth",
  });
}

/**
 * Registers click listeners for all slider indicators.
 *
 * When a dot is clicked, the corresponding reference slide
 * is brought into view with a smooth scrolling animation.
 */
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    goToSlide(index);
  });
});

/**
 * Tracks the current scroll position of the reference slider
 * and updates the active indicator accordingly.
 *
 * The slide whose position is closest to the current scroll
 * offset is considered active. All indicators are reset
 * before the active state is applied to the matching dot.
 */
slider.addEventListener("scroll", () => {
  const references = document.querySelectorAll(".reference");
  let activeIndex = 0;
  references.forEach((reference, index) => {
    const offset = Math.abs(reference.offsetLeft - slider.scrollLeft);
    if (offset < reference.offsetWidth / 2) {
      activeIndex = index;
    }
  });
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });
  dots[activeIndex].classList.add("active");
});
