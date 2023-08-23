const stepButtons = document.querySelectorAll(".step-button");
stepButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const step = button.dataset.next || button.dataset.pre;
    if (step) {
      navigateToStep(step);
      updateStepNames(step);
    }
  });
});
function updateStepNames(step) {
  const stepNames = document.querySelectorAll(".step-name");

  stepNames.forEach((stepName, index) => {
    if (index + 1 < step) {
      stepName.classList.add("completed");
      stepName.classList.remove("active");
    } else if (index + 1 === step) {
      stepName.classList.add("active");
      stepName.classList.remove("completed");
    } else {
      stepName.classList.remove("active");
      stepName.classList.remove("completed");
    }
  });
}

function navigateToStep(step) {
  const stepElements = document.querySelectorAll(".step");
  stepElements.forEach((stepElement) => {
    if (stepElement.id === `step${step}`) {
      stepElement.style.display = "block";
    } else {
      stepElement.style.display = "none";
    }
  });

  updateProgress(step);
  if (step === "1") {
    displayCartSummary();
  } else if (step === "2") {
  } else if (step === "3") {
    displayOrderConfirmation();
  } else if (step === "4") {
    displayOrderComplete();
  }
}

function updateProgress(step) {
  const progressBar = document.querySelector(".progress-bar");
  const numberOfSteps = 4;
  const progressValue = ((parseInt(step) - 1) / (numberOfSteps - 1)) * 100;
  progressBar.style.width = `${progressValue}%`;
}

function displayCartSummary() {
  // Lấy thông tin giỏ hàng và tổng tiền từ Local Storage
  const cartData = localStorage.getItem("shoppingCart");
  const cart = cartData ? JSON.parse(cartData) : [];
  const totalCart = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Hiển thị thông tin giỏ hàng và tổng tiền
  const cartSummarys = document.querySelectorAll(".cart-summary");
  cartSummarys.forEach((cartSummary) => {
    const cartTableBody = cartSummary.querySelector(".table-checkout");
    cartTableBody.innerHTML = "";

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      const cartItemRow = `
      <tr class="text-center text-align">
        <td>${index + 1}</td>
        <td><img src="${item.image}" alt="product image" /></td>
        <td>${item.name}</td>
        <td>${item.price} Đ</td>
        <td>${item.quantity}</td>
        <td>${itemTotal} Đ</td>
        
      </tr>
    `;
      cartTableBody.innerHTML += cartItemRow;
    });
    const totalCartElement = document.querySelector(".total-cart");
    console.log(totalCartElement)
    totalCartElement.textContent = `${totalCart} Đ`;
  });

  
}

function getBillingInfo() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  return { name, address, phone };
}

function saveBillingInfoToLocalStorage() {
  
  const billingInfo = getBillingInfo();
  localStorage.setItem("billingInfo", JSON.stringify(billingInfo));
}

function loadBillingInfoFromLocalStorage() {
  const billingData = localStorage.getItem("billingInfo");
  return billingData ? JSON.parse(billingData) : {};
}
document.getElementById("saveButton").addEventListener("click", function () {
  const nameInput = document.getElementById("name");
  const addressInput = document.getElementById("address");
  const phoneInput = document.getElementById("phone");

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => message.remove());

  let isValid = true;

  if (nameInput.value.trim() === "") {
    isValid = false;
    showError(nameInput, "Please enter your name.");
  }

  if (addressInput.value.trim() === "") {
    isValid = false;
    showError(addressInput, "Please enter your address.");
  }

  if (phoneInput.value.trim() === "") {
    isValid = false;
    showError(phoneInput, "Please enter your phone number.");
  }

  if (isValid) {
    const billingInfo = {
      name: nameInput.value.trim(),
      address: addressInput.value.trim(),
      phone: phoneInput.value.trim(),
    };

    saveBillingInfoToLocalStorage(billingInfo);
    
  }
});

function showError(input, message) {
  const errorElement = document.createElement("div");
  errorElement.className = "error-message text-danger";
  errorElement.textContent = message;
  input.parentElement.appendChild(errorElement);
}

const billingInfo = loadBillingInfoFromLocalStorage();

function displayOrderConfirmation() {
  // Lấy thông tin thanh toán từ form
  const billingInfo = loadBillingInfoFromLocalStorage();
  // Hiển thị thông tin xác nhận đơn hàng
  const orderConfirmation = document.querySelector(".order-confirmation");
  orderConfirmation.innerHTML = `
    <div class="d-flex justify-content-start fw-bold">
      <div class="label p-3 border text-uppercase">Name:</div>
      <div class="total p-3 border">${billingInfo.name}</div>
     </div>
     <div class="d-flex justify-content-start fw-bold">
      <div class="label p-3 border text-uppercase">Address:</div>
      <div class="total p-3 border">${billingInfo.address}</div>
     </div>
     <div class="d-flex justify-content-start fw-bold">
      <div class="label p-3 border text-uppercase">Phone:</div>
      <div class="total p-3 border">${billingInfo.phone}</div>
     </div>
  `;
  displayCartSummary();
}
function clearLocalStorageData() {
  
  localStorage.removeItem("shoppingCart");
}
function displayOrderComplete() {
  // Hiển thị thông báo hoàn tất đơn hàng
  clearLocalStorageData();
  const orderComplete = document.querySelector(".order-complete");
  orderComplete.innerHTML =
    "<p>Order completed. Thank you for your purchase!</p>";
    alert("Order completed")
    window.location.href = "product.html";
}

// Hàm khởi tạo
function init() {
  loadCartFromLocalStorage();
  updateProgress("1");
  navigateToStep("1");
}

init();
