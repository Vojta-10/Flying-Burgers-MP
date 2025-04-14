// cart.js

// =======================
// CART STATE & DATA
// =======================
export let cart = [];

export const burgers = {
  classic: {
    name: 'Classic',
    price: 189,
    img: './images/classic-burger.jpg',
  },
  cheesebomb: {
    name: 'Cheese Bomb',
    price: 219,
    img: './images/cheese-bomb-burger.jpg',
  },
  inferno: {
    name: 'Inferno',
    price: 209,
    img: './images/inferno-burger.jpg',
  },
  smokey: {
    name: 'Smokey',
    price: 229,
    img: './images/smokey-burger.jpg',
  },
  veggiecrunch: {
    name: 'Veggie Crunch',
    price: 179,
    img: './images/veggie-burger.jpg',
  },
  sunrise: {
    name: 'Sunrise',
    price: 239,
    img: './images/sunrise-burger.jpg',
  },
};

// =======================
// CART UTILITY FUNCTIONS
// =======================
export function updateCartCount(cartCountElement) {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCountElement.textContent = count;
}

export function updateTotalPrice(checkoutPriceElement) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  checkoutPriceElement.textContent = `${total} CZK`;
  localStorage.setItem('totalPrice', JSON.stringify(total));
}

// =======================
// CART MODIFIERS
// =======================

// On load localStorage check, if yes then update the shopping-cart

export const loadCartFromLocalStorage = (
  cartContainer,
  cartCountElement,
  checkoutPriceElement
) => {
  const storedCart = localStorage.getItem('cart');
  if (!storedCart) return;

  cart = JSON.parse(storedCart);
  console.log(cart);
  cartContainer.innerHTML = '';

  cart.forEach((item) => {
    cartContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="shopping-cart-item" data-id="${item.name
        .toLowerCase()
        .replace(/\s+/g, '')}">
        <h3>${item.name}</h3>
        <div class="item-seperator"></div>
        <div class="shopping-cart-burger-item-quantity__price__img">
          <img src="${item.img}" alt="${item.name}" />
          <div class="shopping-cart-quantity-price">
            <div class="shopping-cart-item-quantity">
              <button class="shopping-cart-arrow arrow-up">
                <i class="ri-arrow-up-s-fill"></i>
              </button>
              <span>${item.quantity}</span>
              <button class="shopping-cart-arrow arrow-down">
                <i class="ri-arrow-down-s-fill"></i>
              </button>
            </div>
            <p class="price">${item.price} <span>CZK</span></p>
          </div>
        </div>
        <div class="remove-item">
          <i class="ri-delete-bin-line"></i>
        </div>
      </div>`
    );
  });

  // Then update counters
  updateCartCount(cartCountElement);
  updateTotalPrice(checkoutPriceElement);
};

export function addToCart(
  burger,
  cartContainer,
  cartCountElement,
  checkoutPriceElement
) {
  let found = false;

  cart.forEach((item) => {
    if (item.name === burger.name) {
      item.quantity += 1;
      item.price += burger.price;
      found = true;

      const cartItemEl = document.querySelector(
        `.shopping-cart-item[data-id="${burger.name
          .toLowerCase()
          .split(' ')
          .join('')}"]`
      );

      if (cartItemEl) {
        const quantitySpan = cartItemEl.querySelector(
          '.shopping-cart-item-quantity span'
        );
        const priceElement = cartItemEl.querySelector('.price');

        quantitySpan.textContent = item.quantity;
        priceElement.textContent = `${item.price} CZK`;
      }
    }
  });

  if (!found) {
    cart.push({ ...burger, quantity: 1 });
    cartContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="shopping-cart-item" data-id="${burger.name
        .toLowerCase()
        .split(' ')
        .join('')}">
        <h3>${burger.name}</h3>
        <div class="item-seperator"></div>
        <div class="shopping-cart-burger-item-quantity__price__img">
          <img src="${burger.img}" alt="${burger.name}" />
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

  updateCartCount(cartCountElement);
  updateTotalPrice(checkoutPriceElement);
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(
  burgerId,
  cartContainer,
  cartCountElement,
  checkoutPriceElement
) {
  const cartItemEl = document.querySelector(
    `.shopping-cart-item[data-id="${burgerId}"]`
  );

  if (!cartItemEl) return;

  cartItemEl.remove();
  cart = cart.filter(
    (item) => item.name.toLowerCase().split(' ').join('') !== burgerId
  );
  updateCartCount(cartCountElement);
  updateTotalPrice(checkoutPriceElement);
  if (cart.length === 0) {
    localStorage.removeItem('cart');
  } else {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

export function handleQuantityChange(
  e,
  cartContainer,
  cartCountElement,
  checkoutPriceElement
) {
  const isUp = e.target.closest('.arrow-up');
  const isDown = e.target.closest('.arrow-down');

  if (!isUp && !isDown) return;

  const cartItemEl = e.target.closest('.shopping-cart-item');
  const burgerId = cartItemEl.dataset.id;

  const item = cart.find(
    (b) => b.name.toLowerCase().split(' ').join('') === burgerId
  );

  if (!item) return;

  const quantitySpan = cartItemEl.querySelector(
    '.shopping-cart-item-quantity span'
  );
  const priceElement = cartItemEl.querySelector('.price');

  if (isUp) {
    item.quantity += 1;
    item.price += burgers[burgerId].price;
  } else if (isDown && item.quantity > 1) {
    item.quantity -= 1;
    item.price -= burgers[burgerId].price;
  }

  quantitySpan.textContent = item.quantity;
  priceElement.textContent = `${item.price} CZK`;

  updateCartCount(cartCountElement);
  updateTotalPrice(checkoutPriceElement);
  localStorage.setItem('cart', JSON.stringify(cart));
}
