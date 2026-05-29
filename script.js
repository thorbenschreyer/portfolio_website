const navLinks = document.querySelectorAll('.navigation-item');
const sections = document.querySelectorAll('section');
let isManualScrolling = false;


navLinks.forEach((link) => {
    link.addEventListener('click', () => {

        isManualScrolling = true;
        navLinks.forEach((nav) => {
            nav.classList.remove('isActive');
        });

        link.classList.add('isActive');
        setTimeout(() => {
            isManualScrolling = false;
        }, 1000);
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting && !isManualScrolling) {

            // Aktive Klasse entfernen
            navLinks.forEach((link) => {
                link.classList.remove('isActive');
            });

            // Passenden Link finden
            const activeLink = document.querySelector(
                `.navigation-item[href="#${entry.target.id}"]`
            );

            // Neue Klasse setzen
            if (activeLink) {
                activeLink.classList.add('isActive');
            }
        }
    });
}, {
    threshold: 0.9
});

sections.forEach((section) => {
    observer.observe(section);
});


window.addEventListener("load", () => {
    const container = document.querySelector(".sections");
    const target = document.querySelector("#portfolio-section");

    if (container && target) {
        container.scrollTo({
            left: target.offsetLeft,
            behavior: "smooth"
        });
    }
});