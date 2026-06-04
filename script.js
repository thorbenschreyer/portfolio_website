const navLinks = document.querySelectorAll(".navigation-item");
const sections = document.querySelectorAll("section");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const massageInput = document.getElementById("userMessage");
const errorEditText = document.getElementById("error-text");

let isManualScrolling = false;

checkIsFieldEmpty(nameInput, "Your name is required");
checkIsFieldEmpty(emailInput, "Your email is required");
checkIsFieldEmpty(massageInput, "Your message is required");

/**
 * This function check if a inputfild is notfilled with text
 * @param {const} input
 * @param {string} errorMessage
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
 * Allows to scroll to the clicked site,
 * without get interferences in the nav bar
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
 * Set and remove isAvtivestate
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

sections.forEach((section) => {
  observer.observe(section);
});

/**
 * This function checks whether
 * @param {document.getElementById of handleSubmit or handleEditSubmit} name
 * @param {document.getElementById of handleSubmit or handleEditSubmit} email
 * @param {document.getElementById of handleSubmit or handleEditSubmit} userMassage
 * have been entered correctly. If not
 * @returns the error message
 */
function validateInput() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const userMassage = document.getElementById("userMessage").value.trim();

  const nameRegex = /^[A-Za-zÄÖÜäöüß\s'\-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.(de|com|org|net)$/;
  const massageRegex = /^(?!\s*$).+/;

  if (!nameRegex.test(name)) {
    errorEditText.innerText = "Invalid name. Only letters and hyphens allowed.";
    return false;
  }
  if (!emailRegex.test(email)) {
    errorEditText.innerText = "Invalid email. “@” and valid domain required.";
    return false;
  }
  if (!massageRegex.test(userMassage)) {
    errorEditText.innerText = "Empty massage is not allowed";
    return false;
  }
  errorEditText.innerText = "";
  return true;
}

document.getElementById("kontaktForm").addEventListener("submit", function (e) {
  e.preventDefault();
  validateInput();
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
    })
    .catch((err) => console.error(err));
});

// Remove bevore Launch
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
