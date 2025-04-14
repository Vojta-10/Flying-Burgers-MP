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

const UIRequestSignin = function (token, email) {
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
const UIRequestSignup = function (token, email) {
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
    const { data } = await axios.post('http://localhost:3000/auth/register', {
      email,
      password,
    });
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
    UIRequestSignin(token, email);
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
    const { data } = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    });
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
    UIRequestSignup(token, email);
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
      'http://localhost:3000/user/update-address',
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
