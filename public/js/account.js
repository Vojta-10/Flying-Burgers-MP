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
const accountBtn = document.querySelector('.primary-button.account-btn');
const signinBtn = document.querySelector('.primary-button.nav-signin');
const accountEmail = document.querySelector('.account-email');

const showAccountUI = function (email) {
  accountBtn.classList.remove('hidden');
  signinBtn.classList.add('hidden');
  accountEmail.textContent = email;
};

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
    signupMsg.textContent = error.message;
    signupMsg.classList.remove('hidden');
    setTimeout(() => {
      signupMsg.classList.add('hidden');
    }, 3000);
  }
};

signupForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    const {
      user: { email },
      token,
    } = await registerUser();
    localStorage.setItem('token', `Bearer ${token}`);
    signupMsg.styles.color = 'darkgreen';
    signupMsg.textContent = 'Success!';
    setTimeout(() => {
      signupModal.classList.remove('active');
      signupModal.classList.add('hidden');
    }, 2000);
  } catch (error) {}
});
