/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu");
const navOpen = document.getElementById("nav-open");
const navClose = document.getElementById("nav-close");
const navLogo = document.getElementById("nav-logo");

// Menu show
navOpen.addEventListener("click", () => {
  navMenu.classList.add("show-menu");
  navOpen.classList.add("hide-nav-logo__close-icon");
  navLogo.classList.add("hide-nav-logo__close-icon");
});

navClose.addEventListener("click", () => {
  navMenu.classList.remove("show-menu");
  navOpen.classList.remove("hide-nav-logo__close-icon");
  navLogo.classList.remove("hide-nav-logo__close-icon");
});
