const signinModal = document.getElementById('modal-signin');
const signupModal = document.getElementById('modal-signup');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const emailSigninInput = document.querySelector('.email-signin');
const passwordSigninInput = document.querySelector('.password-signin');
const emailSignupInput = document.querySelector('.email-signup');
const passwordSignupInput = document.querySelector('.password-signup');
const errorMsg = document.querySelector('.invalid-message');
const signupMsg = document.querySelector('.signup-msg');
const signinMsg = document.querySelector('.signin-msg');
const accountEmail = document.querySelector('.account-email');
const accountBtns = document.querySelectorAll('.account-btn');
const signinBtns = document.querySelectorAll('.sign-in');
const signoutBtn = document.querySelector('.signout-btn');
const shoppingCartBtn = document.querySelector('.shopping-cart-button');
const streetNoInput = document.getElementById('street');
const postCityInput = document.getElementById('city');
const addressUpdateMsg = document.querySelector('.address-update-msg');
const updateBtn = document.querySelector('.update-btn');
const orderHistoryBtn = document.querySelector('.order-history-btn');
const orderHistoryModal = document.getElementById('order-history-modal');

const UIRequestSignup = function (token, email) {
  localStorage.setItem('token', `Bearer ${token}`);
  signupMsg.classList.remove('hidden');
  signupMsg.textContent = 'Success!';
  signupMsg.style.color = 'darkgreen';
  shoppingCartBtn.classList.remove('modal-open');
  setTimeout(() => {
    signupMsg.classList.add('hidden');
    signupModal.classList.remove('active');
    signupModal.classList.add('hidden');
    showAccountUI(email);
  }, 1000);
};
const UIRequestSignin = function (token, email) {
  localStorage.setItem('token', `Bearer ${token}`);
  signinMsg.classList.remove('hidden');
  signinMsg.textContent = 'Success!';
  signinMsg.style.color = 'darkgreen';
  shoppingCartBtn.classList.remove('modal-open');
  setTimeout(() => {
    signinMsg.classList.add('hidden');
    signinModal.classList.remove('active');
    signinModal.classList.add('hidden');
    showAccountUI(email);
  }, 1000);
};

const showOrderHistoryModal = function () {
  orderHistoryModal.classList.toggle('active');
  orderHistoryModal.classList.toggle('hidden');
};

const showAccBtns = function () {
  accountBtns.forEach((button) => {
    button.classList.toggle('hidden');
  });
  signinBtns.forEach((button) => {
    button.classList.toggle('hidden');
  });
};

// UI changes
const showAccountUI = function (email) {
  showAccBtns();
  accountEmail.textContent = email;
};

const errorUISignup = function (error) {
  signupMsg.textContent = error.message;
  signupMsg.classList.remove('hidden');
  setTimeout(() => {
    signupMsg.classList.add('hidden');
  }, 3000);
};
const errorUISignin = function (error) {
  signinMsg.textContent = error.response.data.msg;
  signinMsg.classList.remove('hidden');
  setTimeout(() => {
    signinMsg.classList.add('hidden');
  }, 3000);
};

const errorUIAddress = function (error) {
  addressUpdateMsg.textContent = error.response.data.msg;
  addressUpdateMsg.classList.remove('hidden');
  addressUpdateMsg.style.color = 'var(--error-color)';
  setTimeout(() => {
    addressUpdateMsg.classList.add('hidden');
  }, 3000);
};

// On page load check for token, UI change if yes
document.addEventListener('DOMContentLoaded', function () {
  const fullToken = localStorage.getItem('token');
  if (fullToken) {
    const token = fullToken.split(' ')[1];
    const decoded = jwt_decode(token);
    showAccountUI(decoded.email);
  } else {
    console.log('No token found');
  }
});

// Register logic
const registerUser = async function () {
  try {
    const email = emailSignupInput.value.trim();
    const password = passwordSignupInput.value.trim();
    if (!email || !password) {
      throw new Error('Please fill in both fields');
    }
    if (password.length < 5) {
      throw new Error('Password must be longer than 5 characters');
    }
    const { data } = await axios.post(
      'https://flyingburgers.onrender.com/auth/register',
      {
        email,
        password,
      }
    );
    return data;
  } catch (error) {
    errorUISignup(error);
  }
};

signupForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const {
      user: { email },
      token,
    } = await registerUser();
    UIRequestSignup(token, email);
  } catch (error) {
    console.log(error);
  }
});

// Signout logic
signoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  location.reload();
});

// Login logic

const loginUser = async function () {
  try {
    const email = emailSigninInput.value.trim();
    const password = passwordSigninInput.value.trim();
    const { data } = await axios.post(
      'https://flyingburgers.onrender.com/auth/login',
      {
        email,
        password,
      }
    );
    return data;
  } catch (error) {
    errorUISignin(error);
  }
};

signinForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const {
      user: { email },
      token,
    } = await loginUser();
    UIRequestSignin(token, email);
  } catch (error) {
    console.log(error);
  }
});

// Update address logic

const userUpdateAddress = async function () {
  try {
    const streetNo = streetNoInput.value.trim();
    const postCity = postCityInput.value.trim();
    const token = localStorage.getItem('token');
    const { data } = await axios.patch(
      'https://flyingburgers.onrender.com/user/update-address',
      {
        streetNo,
        postCity,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return data;
  } catch (error) {
    errorUIAddress(error);
  }
};

updateBtn.addEventListener('click', async function () {
  try {
    const {
      user: { address },
    } = await userUpdateAddress();
    addressUpdateMsg.textContent = 'Address Updated';
    addressUpdateMsg.classList.remove('hidden');
    addressUpdateMsg.style.color = 'var(--success-color)';
    setTimeout(() => {
      addressUpdateMsg.classList.add('hidden');
    }, 3000);
  } catch (error) {}
});

// Order history

const orderHistory = async () => {
  const token = localStorage.getItem('token');
  const {
    data: { orders },
  } = await axios.get('https://flyingburgers.onrender.com/order/history', {
    headers: {
      Authorization: token,
    },
  });
  console.log(orders);
  return orders;
};

orderHistoryBtn.addEventListener('click', async () => {
  const orders = await orderHistory();
  const orderContainer = document.querySelector('.order-history-content');

  const allOrdersHtml = orders
    .map((order) => {
      // 1. Format the date
      const orderDate = new Date(order.createdAt).toLocaleDateString('cs-CZ');

      // 2. Generate items HTML
      const itemsHTML = order.items
        .map(
          (item) => `
      <div class="order-history-item-details">
        <h4>${item.name}</h4>
        <p>Price: <span class="price">${item.price} CZK</span></p>
        <p>Quantity: <span class="quantity">${item.quantity}</span></p>
      </div>
    `
        )
        .join('');

      // 3. Generate summary HTML
      const summaryHTML = `
      <div class="content-seperator"></div>
      <div class="order-history-summary">
        <h4>Order Summary</h4>
        <div class="order-summary-desc">
          <p>${order.totalPrice} CZK</p>
          <p>${order.paymentType}</p>
          <p>${order.deliveryType}</p>
        </div>
      </div>
    `;

      // 4. Combine all together
      return `
      <div class="order-history-item">
        <h3>Order <span class="order-date">${orderDate}</span></h3>
        <div class="content-seperator"></div>
        <div class="order-history-desc">
          ${itemsHTML}
        </div>
        ${summaryHTML}
      </div>
    `;
    })
    .join('');

  orderContainer.insertAdjacentHTML('beforeend', allOrdersHtml);
  showOrderHistoryModal();
});
