import {
  cart,
  burgers,
  addToCart,
  removeFromCart,
  updateCartCount,
  updateTotalPrice,
  handleQuantityChange,
  loadCartFromLocalStorage,
} from './cart.js';

// NAV
const navMenu = document.getElementById('nav-menu');
const navOpen = document.getElementById('nav-open');
const navClose = document.getElementById('nav-close');
const navLogo = document.getElementById('nav-logo');
const navLinks = document.querySelectorAll('.nav-link');

const signInBtns = document.querySelectorAll('.sign-in');
// Shopping cart
const shoppingCartBtn = document.querySelector('.shopping-cart-button');
const cartContainer = document.querySelector('.shopping-cart-items');
const cartCountElement = document.getElementById('cart-count');
const checkoutPriceElement = document.querySelector(
  '.shopping-cart-checkout .price'
);

// Confirm removal
const confirmText = document.querySelector('.confirm-text');
const removeBtn = document.querySelector('.remove-button');
const cancelBtn = document.querySelector('.cancel-button');

// Form
const signInForm = document.getElementById('signin-form');
const signUpForm = document.getElementById('signup-form');

// Modal
const modalClose = document.querySelectorAll('.modal-close');
const modalOverlaySignIn = document.getElementById('modal-signin');
const modalOverlaySignUp = document.getElementById('modal-signup');
const modalChangeSignFormBtn = document.querySelectorAll('.change-sign-form');
const modalShoppingCart = document.getElementById('modal-shopping-cart');
const modalConfirmRemoval = document.getElementById('confirm-modal');
const modalAccount = document.getElementById('account-modal');
const modalAccountBtns = document.querySelectorAll(
  '.primary-button.account-btn'
);

// Menu
const addToCartBtns = document.querySelectorAll('.add-to-cart');

let itemToRemove = null;

// Functions

const toggleShowMenu = function () {
  navMenu.classList.toggle('show-menu');
  navOpen.classList.toggle('hide-nav-logo__close-icon');
  navLogo.classList.toggle('hide-nav-logo__close-icon');
  shoppingCartBtn.classList.toggle('menu-open');
};

const toggleModalSignIn = function () {
  modalOverlaySignIn.classList.toggle('active');
  modalOverlaySignIn.classList.toggle('hidden');
};
const toggleModalSignUp = function () {
  modalOverlaySignUp.classList.toggle('active');
  modalOverlaySignUp.classList.toggle('hidden');
};
function toggleModalConfirmRemoval() {
  modalConfirmRemoval.classList.toggle('active');
  modalConfirmRemoval.classList.toggle('hidden');
}

function toggleModalAccount() {
  modalAccount.classList.toggle('active');
  modalAccount.classList.toggle('hidden');
}

const toggleModalShoppingCart = function () {
  navMenu.classList.remove('show-menu');
  navOpen.classList.remove('hide-nav-logo__close-icon');
  navLogo.classList.remove('hide-nav-logo__close-icon');
  shoppingCartBtn.classList.remove('menu-open');
  modalShoppingCart.classList.toggle('active');
  modalShoppingCart.classList.toggle('hidden');
};

// Menu show
navOpen.addEventListener('click', () => {
  toggleShowMenu();
});

navClose.addEventListener('click', () => {
  toggleShowMenu();
});

navLinks.forEach((link) => link.addEventListener('click', toggleShowMenu));

// Modal close
modalClose.forEach((icon) =>
  icon.addEventListener('click', function (e) {
    const insideSignIn = e.target.closest('#modal-signin');
    const insideSignUp = e.target.closest('#modal-signup');
    const insideShoppingCart = e.target.closest('#modal-shopping-cart');
    const insideConfirmRemoval = e.target.closest('#confirm-modal');
    const insideAccount = e.target.closest('#account-modal');

    if (insideSignIn) {
      toggleModalSignIn();
      signInForm.reset();
      shoppingCartBtn.classList.toggle('modal-open');
    }

    if (insideSignUp) {
      toggleModalSignUp();
      signUpForm.reset();
      shoppingCartBtn.classList.toggle('modal-open');
    }

    if (insideShoppingCart) {
      toggleModalShoppingCart();
      shoppingCartBtn.classList.toggle('modal-open');
    }

    if (insideConfirmRemoval) {
      toggleModalConfirmRemoval();
    }

    if (insideAccount) {
      toggleModalAccount();
      shoppingCartBtn.classList.toggle('modal-open');
    }
  })
);

// Shopping cart modal
shoppingCartBtn.addEventListener('click', function () {
  toggleModalShoppingCart();
  shoppingCartBtn.classList.toggle('modal-open');
});

// Confirm removal modal

// Sign in Modal
signInBtns.forEach((btn) =>
  btn.addEventListener('click', function (e) {
    if (e.target.closest('.nav-menu')) {
      toggleModalSignIn();
      toggleShowMenu();
      shoppingCartBtn.classList.toggle('modal-open');
    } else {
      toggleModalSignIn();
      shoppingCartBtn.classList.toggle('modal-open');
    }
  })
);

// Switch from Sign in to Sign up modal
modalChangeSignFormBtn.forEach((btn) =>
  btn.addEventListener('click', function (e) {
    const insideSignIn = e.target.closest('#modal-signin');
    const insideSignUp = e.target.closest('#modal-signup');

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

// Account modal
modalAccountBtns.forEach((button) => {
  button.addEventListener('click', (e) => {
    if (e.target.closest('.footer-body')) {
      toggleModalAccount();
    } else {
      toggleModalAccount();
      toggleShowMenu();
    }
    shoppingCartBtn.classList.toggle('modal-open');
  });
});

// Add to Cart Buttons
addToCartBtns.forEach((button) => {
  button.addEventListener('click', function () {
    const burgerId = this.dataset.id;
    const burger = burgers[burgerId];
    addToCart(burger, cartContainer, cartCountElement, checkoutPriceElement);
  });
});

// Remove Cart Item - Show Confirmation Modal
cartContainer.addEventListener('click', function (e) {
  const isRemove = e.target.closest('.remove-item');
  if (!isRemove) return;

  const cartItemEl = e.target.closest('.shopping-cart-item');
  const burgerId = cartItemEl.dataset.id;

  itemToRemove = {
    el: cartItemEl,
    id: burgerId,
  };

  confirmText.innerHTML = `Are you sure you want to <br> remove <span class="highlight">${burgers[burgerId].name}</span>?`;
  toggleModalConfirmRemoval();
});

// Confirm Removal
removeBtn.addEventListener('click', () => {
  if (!itemToRemove) return;
  toggleModalConfirmRemoval();

  removeFromCart(
    itemToRemove.id,
    cartContainer,
    cartCountElement,
    checkoutPriceElement
  );
  itemToRemove = null;
});

// Cancel Removal
cancelBtn.addEventListener('click', () => {
  toggleModalConfirmRemoval();
  itemToRemove = null;
});

// Handle Quantity Change
cartContainer.addEventListener('click', function (e) {
  handleQuantityChange(
    e,
    cartContainer,
    cartCountElement,
    checkoutPriceElement
  );
});

// Initialize cart price and count
updateTotalPrice(checkoutPriceElement);
updateCartCount(cartCountElement);
loadCartFromLocalStorage(cartContainer, cartCountElement, checkoutPriceElement);
