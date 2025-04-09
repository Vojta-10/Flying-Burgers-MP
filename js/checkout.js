"use strict";
const deliveryFeeElement = document.getElementById("delivery-fee");
const radioBtns = document.querySelectorAll('[name="radio-delivery-type"]');
const contactInputs = document.querySelectorAll('[name="delivery-type"]');
const addressInput = document.querySelector("#address-input-wrapper");
const mapContainer = document.querySelector(".map-container");
const finalizeBtn = document.querySelector(".finish-order-btn");
const modalReviewOrder = document.getElementById("modal-order-summary");
const modalClose = document.querySelector(".close-icon");
const cancelReviewBtn = document.querySelector(".cancel-modal-btn");
const confirmOrderBtn = document.querySelector(".confirm-order-btn");
const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
const savedTotal = JSON.parse(localStorage.getItem("totalPrice")) || 0;
const summaryContainer = document.querySelector(".summary-container");
finalizeBtn.disabled = true;
let isDelivery = false;

const toggleReviewOrderModal = function () {
  modalReviewOrder.classList.toggle("active");
  modalReviewOrder.classList.toggle("hidden");
};

const closeReviewModal = function () {
  modalClose.addEventListener("click", toggleReviewOrderModal);
  cancelReviewBtn.addEventListener("click", toggleReviewOrderModal);
};

const openReviewModal = function () {
  finalizeBtn.addEventListener("click", () => {
    const deliveryFee = document.getElementById("delivery-fee").textContent;
    const paymentMethod = document.querySelector(
      'input[name="payment-method"]:checked'
    ).value;
    const deliveryMethod = document.querySelector(
      'input[name="radio-delivery-type"]:checked'
    ).value;
    if (deliveryMethod === "Delivery") isDelivery = true;
    const sumAddress = document
      .querySelector(".mapboxgl-ctrl-geocoder--input")
      .value.split(",")
      .slice(0, 2);

    const [firstName, lastName] = [
      contactInputs[0].value,
      contactInputs[1].value,
    ];
    console.log(firstName, lastName);
    toggleReviewOrderModal();
    modalInfoFill(
      deliveryMethod,
      paymentMethod,
      sumAddress,
      deliveryFee,
      savedTotal
    );
  });
};

const modalInfoFill = function (
  deliveryMethod,
  paymentMethod,
  address,
  deliveryFee,
  total
) {
  document.getElementById("summary-delivery-type").textContent = deliveryMethod;
  document.getElementById("summary-payment").textContent = paymentMethod;
  document.getElementById("summary-address").textContent = isDelivery
    ? address
    : "Pick-up at restaurant";
  document.getElementById("summary-fee").textContent = isDelivery
    ? `${deliveryFee}`
    : "0 CZK";
  document.getElementById("summary-total").textContent = `${total} CZK`;
};

const orderSummaryFill = function (cart) {
  cart.forEach((order) => {
    summaryContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="checkout-cart-item" data-id="${order.name
        .toLowerCase()
        .split(" ")
        .join("")} ">
      <h3>${order.name} </h3>
      <div class="item-seperator"></div>
      <div class="checkout-cart-quantity-price">
        <p>Quantity: ${order.quantity} </p>
        <p>Total burger price: <span class="price">${
          order.price
        }  CZK</span></p>
      </div>
    </div>`
    );
  });
};

const radioBtnsChange = function () {
  radioBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const radioEl = e.target.closest('[name="radio-delivery-type"]');
      if (radioEl.value === "Pick-up") {
        addressInput.style.display = "none";
        mapContainer.style.display = "none";
        deliveryFeeElement.textContent = `0 CZK`;
        document.querySelector(".mapboxgl-ctrl-geocoder--input").value = "";
        document.querySelector("#delivery-section h2").textContent =
          "Contact info";
        if (inputFieldCheck(contactInputs)) finalizeBtn.disabled = false;
      } else {
        addressInput.style.display = "inherit";
        mapContainer.style.display = "inherit";
        console.log(addressFieldCheck());
        if (!inputFieldCheck(contactInputs) || !addressFieldCheck()) {
          finalizeBtn.disabled = true;
        }
        document.querySelector("#delivery-section h2").textContent =
          "Delivery address";
      }
    });
  });
};

const inputFieldCheck = function (inputArr) {
  let filled = 0;
  inputArr.forEach((input) => {
    if (input.value.trim().length > 0) {
      filled++;
    }
  });
  return filled === 2 ? true : false;
};

const updateFormValidation = () => {
  const address = document.querySelector(".mapboxgl-ctrl-geocoder--input");
  const allFields = [...contactInputs, address].filter(Boolean);

  allFields.forEach((input) => {
    input.addEventListener("input", function () {
      if (addressInput.style.display === "none") {
        if (inputFieldCheck(contactInputs)) finalizeBtn.disabled = false;
        else finalizeBtn.disabled = true;
      } else {
        if (inputFieldCheck(contactInputs) && addressFieldCheck())
          finalizeBtn.disabled = false;
        else finalizeBtn.disabled = true;
      }
    });
  });
};

const addressFieldCheck = function () {
  if (
    document.querySelector(".mapboxgl-ctrl-geocoder--input").value.trim()
      .length > 0
  ) {
    return true;
  }
  return false;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d.toFixed(2);
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

const deliveryFeeCalc = function (distance) {
  let deliveryFee;
  if (distance <= 5) {
    deliveryFee = 49;
    return deliveryFee;
  }
  if (distance > 5 && distance <= 10) {
    deliveryFee = 69;
    return deliveryFee;
  }
  if (distance > 10 && distance <= 20) {
    deliveryFee = 99;
    return deliveryFee;
  }
  if (distance > 20 && distance <= 50) {
    deliveryFee = 139;
    return deliveryFee;
  }
  deliveryFee = 199;
  return deliveryFee;
};

let userMarker = null;
const handleAddressSelection = function (coords) {
  const userLat = Number(coords[1]);
  const userLon = Number(coords[0]);
  if (userMarker) {
    userMarker.remove();
  }
  userMarker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
  map.flyTo({ center: coords, zoom: 10 });

  const distance = calculateDistance(
    restaurantLocation.lat,
    restaurantLocation.lon,
    userLat,
    userLon
  );

  const fee = deliveryFeeCalc(distance);
  deliveryFeeElement.textContent = `${fee} CZK`;
};

const restaurantLocation = {
  lat: 49.1176511,
  lon: 16.7843002,
};
mapboxgl.accessToken =
  "pk.eyJ1Ijoidm9qdGFza29zNTgiLCJhIjoiY205YTNheW02MDE0djJsc2dwNm1hYW5vaiJ9.YIQvWNUOyYA1q_Mwnw589w";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [16.7875, 49.1222],
  zoom: 12,
});

new mapboxgl.Marker({ color: "#f77f00" })
  .setLngLat([restaurantLocation.lon, restaurantLocation.lat])
  .addTo(map);

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: "Search for your address",
  mapboxgl: mapboxgl,
  marker: false,
  countries: "cz",
});

geocoder.addTo("#address-input-wrapper");

geocoder.on("result", (e) => {
  const coords = e.result.geometry.coordinates;
  handleAddressSelection(coords);
});

const init = function () {
  radioBtnsChange();
  closeReviewModal();
  updateFormValidation();
  openReviewModal();
  orderSummaryFill(savedCart);
};

init();
