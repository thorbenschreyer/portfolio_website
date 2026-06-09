const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("userMessage");
const errorMessageElement = document.getElementById("error-text");
const checkbox = document.getElementById("checkbox");
const checkboxLabel = document.querySelector(".custom-checkbox");

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
 * Validates all form fields before the form is submitted.
 *
 * Validation rules:
 * - Name must contain only valid characters.
 * - Email must match a supported email format.
 * - Message field must not be empty.
 * - Privacy policy checkbox must be accepted.
 *
 * Displays a translated error message when validation fails.
 *
 * @returns {boolean} True if all inputs are valid, otherwise false.
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    }),
  })
    .then(async (response) => {
      const text = await response.text();
      console.log(text);

      nameInput.value = "";
      emailInput.value = "";
      messageInput.value = "";
      
      checkbox.checked = false;
      document.getElementById("send-button").classList.add("btn-disable")
      checkboxLabel.classList.remove("checked");
    })
    .catch((err) => console.error(err));
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
      document.getElementById("send-button").classList.remove("btn-disable")
    } else {
      document.getElementById("send-button").classList.add("btn-disable")
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
