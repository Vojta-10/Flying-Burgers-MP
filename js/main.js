// NAV
const navMenu = document.getElementById("nav-menu");
const navOpen = document.getElementById("nav-open");
const navClose = document.getElementById("nav-close");
const navLogo = document.getElementById("nav-logo");
const navLinks = document.querySelectorAll(".nav-link");
const navSignInBtn = document.getElementById("nav-sign-in");
// Shopping cart
const shoppingCartBtn = document.querySelector(".shopping-cart-button");
const shoppingCartCount = document.querySelector(".shopping-cart-count");
const cartContainer = document.querySelector(".shopping-cart-items");
const checkoutPrice = document.querySelector(".shopping-cart-checkout .price");
const itemRemovalBtn = document.querySelectorAll(".remove-items");

// Confirm removal
const confirmText = document.querySelector(".confirm-text");
const removeBtn = document.querySelector(".remove-button");
const cancelBtn = document.querySelector(".cancel-button");

// Form
const signInForm = document.getElementById("signin-form");
const signUpForm = document.getElementById("signup-form");

// Modal
const modalClose = document.querySelectorAll(".modal-close");
const modalOverlaySignIn = document.getElementById("modal-signin");
const modalOverlaySignUp = document.getElementById("modal-signup");
const modalChangeSignFormBtn = document.querySelectorAll(".change-sign-form");
const modalShoppingCart = document.getElementById("modal-shopping-cart");
const modalConfirmRemoval = document.getElementById("modal-confirm-removal");

// Menu
const addToCartBtns = document.querySelectorAll(".add-to-cart");

// Functions

const toggleShowMenu = function () {
  navMenu.classList.toggle("show-menu");
  navOpen.classList.toggle("hide-nav-logo__close-icon");
  navLogo.classList.toggle("hide-nav-logo__close-icon");
  shoppingCartBtn.classList.toggle("menu-open");
};

const toggleModalSignIn = function () {
  modalOverlaySignIn.classList.toggle("active");
  modalOverlaySignIn.classList.toggle("hidden");
};
const toggleModalSignUp = function () {
  modalOverlaySignUp.classList.toggle("active");
  modalOverlaySignUp.classList.toggle("hidden");
};
const toggleModalConfirmRemoval = function () {
  modalConfirmRemoval.classList.toggle("active");
  modalConfirmRemoval.classList.toggle("hidden");
};

const toggleModalShoppingCart = function () {
  navMenu.classList.remove("show-menu");
  navOpen.classList.remove("hide-nav-logo__close-icon");
  navLogo.classList.remove("hide-nav-logo__close-icon");
  shoppingCartBtn.classList.remove("menu-open");
  modalShoppingCart.classList.toggle("active");
  modalShoppingCart.classList.toggle("hidden");
};

const updateTotalPrice = function () {
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  checkoutPrice.textContent = `${total} CZK`;
};

const updateCartCount = function () {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
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
    const insideShoppingCart = e.target.closest("#modal-shopping-cart");
    const insideConfirmRemoval = e.target.closest("#modal-confirm-removal");

    if (insideSignIn) {
      toggleModalSignIn();
      signInForm.reset();
      shoppingCartBtn.classList.toggle("modal-open");
    }

    if (insideSignUp) {
      toggleModalSignUp();
      signUpForm.reset();
      shoppingCartBtn.classList.toggle("modal-open");
    }

    if (insideShoppingCart) {
      toggleModalShoppingCart();
      shoppingCartBtn.classList.toggle("modal-open");
    }

    if (insideConfirmRemoval) {
      toggleModalConfirmRemoval();
    }
  })
);

// Shopping cart modal
shoppingCartBtn.addEventListener("click", function () {
  toggleModalShoppingCart();
  shoppingCartBtn.classList.toggle("modal-open");
});

// Confirm removal modal

// Sign in Modal
navSignInBtn.addEventListener("click", function () {
  toggleShowMenu();
  toggleModalSignIn();
  shoppingCartBtn.classList.toggle("modal-open");
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

// Cart add logic

let cart = [];

const burgers = {
  classic: {
    name: "Classic",
    price: 189,
    img: "images/classic-burger.jpg",
  },
  cheesebomb: {
    name: "Cheese Bomb",
    price: 219,
    img: "images/cheese-bomb-burger.jpg",
  },
  inferno: {
    name: "Inferno",
    price: 209,
    img: "images/inferno-burger.jpg",
  },
  smokey: {
    name: "Smokey",
    price: 229,
    img: "images/smokey-burger.jpg",
  },
  veggiecrunch: {
    name: "Veggie Crunch",
    price: 179,
    img: "images/veggie-burger.jpg",
  },
  sunrise: {
    name: "Sunrise",
    price: 239,
    img: "images/sunrise-burger.jpg",
  },
};

const addToCart = function (burger) {
  let found = false;
  // 1. Check if item already exists in cart
  cart.forEach((item) => {
    if (item.name === burger.name) {
      // 2. If it does, increase quantity
      item.quantity += 1;
      item.price += burger.price;
      found = true;

      const cartItemEl = document.querySelector(
        `.shopping-cart-item[data-id="${burger.name.toLowerCase()}"]`
      );

      if (cartItemEl) {
        // Update quantity and price
        const quantitySpan = cartItemEl.querySelector(
          ".shopping-cart-item-quantity span"
        );
        quantitySpan.textContent = item.quantity;

        const priceElement = cartItemEl.querySelector(".price");
        priceElement.textContent = `${item.price} CZK`;
      }
    }
  });
  // 3. If not, create and insert new cart item HTML
  if (!found) {
    cart.push({ ...burger, quantity: 1 });
    // Update total price
    cartContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="shopping-cart-item" data-id="${burger.name
        .toLowerCase()
        .split(" ")
        .join("")}">
                <h3>${burger.name}</h3>
                <div class="item-seperator"></div>
                <div class="shopping-cart-burger-item-quantity__price__img">
                  <img src="${burger.img}" alt="classic-burger" />
                  <div class="shopping-cart-quantity-price">
                    <div class="shopping-cart-item-quantity">
                      <button class="shopping-cart-arrow arrow-up">
                        <i class="ri-arrow-up-s-fill"></i>
                      </button>
                      <span>1</span>
                      <button class="shopping-cart-arrow arrow-down">
                        <i class="ri-arrow-down-s-fill"></i>
                      </button>
                    </div>
                    <p class="price">${burger.price} <span>CZK</span></p> 
                  </div>
                </div>
                <div class="remove-item" id="remove-item">
                  <i class="ri-delete-bin-line"></i>
                </div>
              </div>`
    );
  }
  //Update total price
  updateTotalPrice();
  // Update floating count
  updateCartCount();
};

cartContainer.addEventListener("click", function (e) {
  const isUp = e.target.closest(".arrow-up");
  const isDown = e.target.closest(".arrow-down");

  if (!isUp && !isDown) return;

  const cartItemEl = e.target.closest(".shopping-cart-item");
  const burgerId = cartItemEl.dataset.id;

  const item = cart.find(
    (b) => b.name.toLowerCase().split(" ").join("") === burgerId
  );
  const quantitySpan = cartItemEl.querySelector(
    ".shopping-cart-item-quantity span"
  );
  const priceElement = cartItemEl.querySelector(".price");

  if (isUp) {
    item.quantity += 1;
    item.price += burgers[burgerId].price;
    updateCartCount();
  } else if (isDown && item.quantity > 1) {
    item.quantity -= 1;
    item.price -= burgers[burgerId].price;
    updateCartCount();
  }

  // Update DOM
  quantitySpan.textContent = item.quantity;
  priceElement.textContent = `${item.price} CZK`;
  updateTotalPrice();
});

addToCartBtns.forEach((button) => {
  button.addEventListener("click", function () {
    const burgerId = this.dataset.id;
    const burger = burgers[burgerId];
    addToCart(burger);
  });
});

// Cart remove logic
let itemToRemove = null;

cartContainer.addEventListener("click", function (e) {
  const isRemove = e.target.closest(".remove-item");
  if (!isRemove) return;

  const cartItemEl = e.target.closest(".shopping-cart-item");
  const burgerId = cartItemEl.dataset.id;

  itemToRemove = {
    el: cartItemEl,
    id: burgerId,
  };

  // Update confirm modal text:
  confirmText.innerHTML = `Are you sure you want to remove <br> <span class="highlight">${burgers[burgerId].name}</span>?`;

  // Show confirmation modal
  toggleModalConfirmRemoval();
});

removeBtn.addEventListener("click", () => {
  if (!itemToRemove) return;

  // 1. Remove from DOM
  itemToRemove.el.remove();

  // 2. Remove from cart array
  cart = cart.filter(
    (item) => item.name.toLowerCase().split(" ").join("") !== itemToRemove.id
  );

  // 3. Recalculate total price
  updateTotalPrice();

  // 4. Update cart count
  updateCartCount();

  // 5. Hide modal and reset temp storage
  toggleModalConfirmRemoval();
  itemToRemove = null;
});

cancelBtn.addEventListener("click", () => {
  toggleModalConfirmRemoval();
  itemToRemove = null;
});
