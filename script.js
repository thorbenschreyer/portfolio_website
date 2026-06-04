const navLinks = document.querySelectorAll(".navigation-item");
const sections = document.querySelectorAll("section");
let isManualScrolling = false;

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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isManualScrolling) {
        // Aktive Klasse entfernen
        navLinks.forEach((link) => {
          link.classList.remove("isActive");
        });

        // Passenden Link finden
        const activeLink = document.querySelector(
          `.navigation-item[href="#${entry.target.id}"]`,
        );

        // Neue Klasse setzen
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

document.getElementById("kontaktForm").addEventListener("submit", function (e) {
  console.log(document.getElementById("name").value);
  console.log(document.getElementById("email").value);
  console.log(document.getElementById("userMessage").value);
  e.preventDefault();

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
      console.log("Status:", response.status);
      console.log("Content-Type:", response.headers.get("content-type"));

      const text = await response.text();
      console.log("Antwort:", text);
    })
    .catch((err) => console.error(err));
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("userMessage").value = "";
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
