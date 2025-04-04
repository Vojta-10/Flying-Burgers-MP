// NAV
const navMenu = document.getElementById("nav-menu");
const navOpen = document.getElementById("nav-open");
const navClose = document.getElementById("nav-close");
const navLogo = document.getElementById("nav-logo");
const navLinks = document.querySelectorAll(".nav-link");
const navSignInBtn = document.getElementById("nav-sign-in");
// Form
const signInForm = document.getElementById("signin-form");
const signUpForm = document.getElementById("signup-form");

// Modal
const modalClose = document.querySelectorAll(".modal-close");
const modalOverlaySignIn = document.getElementById("modal-signin");
const modalOverlaySignUp = document.getElementById("modal-signup");
const modalChangeSignFormBtn = document.querySelectorAll(".change-sign-form");

// Functions

const toggleShowMenu = function () {
  navMenu.classList.toggle("show-menu");
  navOpen.classList.toggle("hide-nav-logo__close-icon");
  navLogo.classList.toggle("hide-nav-logo__close-icon");
};

const toggleModalSignIn = function () {
  modalOverlaySignIn.classList.toggle("active");
  modalOverlaySignIn.classList.toggle("hidden");
};
const toggleModalSignUp = function () {
  modalOverlaySignUp.classList.toggle("active");
  modalOverlaySignUp.classList.toggle("hidden");
};

// Menu show
navOpen.addEventListener("click", () => {
  toggleShowMenu();
});

navClose.addEventListener("click", () => {
  toggleShowMenu();
});

navLinks.forEach((link) => link.addEventListener("click", toggleShowMenu));

// Modal close
modalClose.forEach((icon) =>
  icon.addEventListener("click", function (e) {
    const insideSignIn = e.target.closest("#modal-signin");
    const insideSignUp = e.target.closest("#modal-signup");

    if (insideSignIn) {
      toggleModalSignIn();
      signInForm.reset();
    }

    if (insideSignUp) {
      toggleModalSignUp();
      signUpForm.reset();
    }
  })
);

// Sign in Modal
navSignInBtn.addEventListener("click", function () {
  console.log("AHOJ");
  toggleShowMenu();
  toggleModalSignIn();
});

// Switch from Sign in to Sign up modal
modalChangeSignFormBtn.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    const insideSignIn = e.target.closest("#modal-signin");
    const insideSignUp = e.target.closest("#modal-signup");

    if (insideSignIn) {
      toggleModalSignIn();
      signInForm.reset();
      setTimeout(() => {
        toggleModalSignUp();
      }, 150);
    }

    if (insideSignUp) {
      toggleModalSignUp();
      signUpForm.reset();
      setTimeout(() => {
        toggleModalSignIn();
      }, 150);
    }
  })
);
