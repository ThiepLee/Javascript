const productContainerGrid = document.getElementById("product-grid");
const productContainerList = document.getElementById("product-list");
const cartContainer = document.querySelector(".cart-container");
const totalCartElements = document.querySelectorAll(".total-cart");
const totalCountElement = document.querySelector(".total-count");
const vatElements = document.querySelectorAll(".vat");
const checkoutTotalElements = document.querySelectorAll(".checkout__total");
const sortingSelect = document.getElementById("filterSelectSorting");
const filterSelect = document.getElementById("filterSelectShow");
const searchInput = document.getElementById("searchInput");

let products = [];
let cart = [];
let filterProducts = [];
fetch("http://localhost:3000/products")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    filterProducts = products;
    renderProducts("grid");
    renderProducts("list");
  })
  .catch((error) => console.error("Error fetching products:", error));

filterSelect.addEventListener("change", () => {
  const selectedValue = filterSelect.value;
  filterProducts = products.slice(0, selectedValue);
  renderProducts("grid");
  renderProducts("list");
});
sortingSelect.addEventListener("change", () => {
  const value = sortingSelect.value;
  console.log(products);
  if (value === "price-desc") {
    filterProducts.sort((a, b) => b.price - a.price);
  } else {
    filterProducts.sort((a, b) => a.price - b.price);
  }
  renderProducts("grid");
  renderProducts("list");
});
searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim().toLowerCase();
  filterProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.price.toString().includes(query) ||
      product.description.toLowerCase().includes(query)
  );
  renderProducts("grid");
  renderProducts("list");
});
// Render all products
function renderProducts(type) {
  if (type === "grid") {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = "";
    filterProducts.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.className = "col-lg-4";

      productItem.innerHTML = `
            <div class="product__item d-flex flex-column align-items-center px-1 py-4 h-100 justify-content-between bg-light" href="productDetail.html">
              <img class="img-fluid mb-2" src="${
                product.image
              }" alt="product image"/>
              <div class="description text-center mt-2"> 
                  <div class="product__price text-danger fw-bold m-1">${product.price.toLocaleString()} Đ</div>
                  <div class="product__name text-uppercase fw-bold m-1">${
                    product.name
                  }</div>
                  <div class="product__review d-flex align-items-center justify-content-center m-1">
                      <div class="star__icon text-primary">
                          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i>
                      </div>
                      <span class="review__text">(${
                        product.reviews
                      } đơn đánh giá)</span>
                  </div>
              </div>
              <div class="product__btn d-flex justify-content-center m-2">
                  <button class="add-to-cart-btn btn btn-primary m-1 text-light add-to-cart" data-id="${
                    product.id
                  }" data-name="${product.name}" data-price="${
        product.price
      }" " data-image="${product.image}">MUA NGAY</button>
                  <button class="btn btn-secondary m-1"><a class="text-light" href="productDetail.html">XEM CHI TIET</a></button>
              </div>
            </div>
            
     
       
      `;

      productContainerGrid.appendChild(productItem);
    });
  } else if (type === "list") {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    filterProducts.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.className = "col-lg-4";

      productItem.className = "col-lg-12";

      productItem.innerHTML = `
                <div class="product__item d-flex align-items-center px-1 py-4 h-100 justify-content-around bg-light">
                    <img class="img-fluid me-5" src="${
                      product.image
                    }" alt="product image"/>
                    <div class="description mt-2 p-2 d-flex flex-column justify-content-start align-items-start mt-2"> 
                        <div class="product__name text-uppercase fw-bold m-1">${
                          product.name
                        }</div>
                        <div class="product__review d-flex align-items-center justify-content-center m-1">
                            <div class="star__icon text-primary">
                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i>
                            </div>
                            <span class="review__text">(${
                              product.reviews
                            } đơn đánh giá)</span>
                        </div>
                        <div class="product__des m-1">
                            <span>${product.description}</span>
                        </div>
                        <div class="product__price text-danger fw-bold m-1">${product.price.toLocaleString()}Đ</div>
                        <div class="product__btn--show d-flex justify-content-center m-1">
                            <button class="add-to-cart-btn btn btn-primary m-1 text-light add-to-cart" data-id="${
                              product.id
                            }" data-name="${product.name}" data-price="${
        product.price
      }" " data-image="${product.image}">MUA NGAY</button>
                            <button class="btn btn-secondary m-1"><a class="text-light" href="productDetail.html">XEM CHI TIET</a></button>
                        </div>
                    </div>
                </div>
            `;

      productContainerList.appendChild(productItem);
    });
  }
  setupAddToCartListeners();
}

// Display the shopping cart
function displayCart() {
  cartContainer.innerHTML = "";
  let totalCart = 0;
  let totalCount = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    totalCart += itemTotal;
    totalCount += item.quantity;

    const cartItem = document.createElement("div");

    cartItem.className = "cart__item d-flex justify-content-between p-2 border";
    cartItem.innerHTML = `
                  <img class="image-fluid cart__img me-3" src="${
                    item.image
                  }" alt="cart item"/>
                  <div class="description"> 
                    <div class="name text-uppercase mb-2">${item.name}</div>
                    <div class="price"> <span class="quality">${
                      item.quantity
                    }<span> x</span> </span><span class="text-danger fw-bold">${itemTotal.toLocaleString()}</span><span class="text-danger fw-bold ms-1">Đ</span></div>
                  </div>
                  <a class="delete-cart-item" data-id="${
                    item.id
                  }"><i class="bi bi-x text-danger fw-bold display-6"></i></button>

    `;

    cartContainer.appendChild(cartItem);
  });

  totalCartElements.forEach((totalCartElement) => {
    totalCartElement.textContent = `${totalCart.toLocaleString()}`;
  });

  totalCountElement.textContent = `${totalCount}`;
  let vat = 0;
  vat = totalCart * 0.05;
  let checkoutTotal = vat + totalCart;
  console.log(checkoutTotal);
  vatElements.forEach((vatElement) => {
    vatElement.textContent = `${vat.toLocaleString()} Đ`;
  });

  checkoutTotalElements.forEach((checkoutTotalElement) => {
    checkoutTotalElement.textContent = `${checkoutTotal.toLocaleString()} Đ`;
  });
  const deleteCartItemButtons = document.querySelectorAll(".delete-cart-item");
  deleteCartItemButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = button.dataset.id;
      removeCartItem(itemId);
      displayCart();
    });
  });
}

function setupAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
  displayCart();
}
function addToCart(event) {
  const id = event.target.dataset.id;
  const name = event.target.dataset.name;
  const image = event.target.dataset.image;
  const price = parseFloat(event.target.dataset.price);

  const existingCartItem = cart.find((item) => item.id === id);
  if (existingCartItem) {
    existingCartItem.quantity++;
  } else {
    cart.push({ id, name, image, price, quantity: 1 });
  }
  saveCartToLocalStorage();
  loadCartFromLocalStorage();
  displayCart();
  displayCartItems();
}
function removeCartItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCartToLocalStorage();
  displayCart();
  displayCartItems();
}

// Lưu giỏ hàng vào Local Storage
function saveCartToLocalStorage() {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Load giỏ hàng từ Local Storage
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem("shoppingCart");
  cart = cartData ? JSON.parse(cartData) : [];
}



function getCartFromLocalStorage() {
  const cartData = localStorage.getItem("shoppingCart");
  return cartData ? JSON.parse(cartData) : [];
}
// Hàm hiển thị giỏ hàng vào bảng
function displayCartItems() {
  const cartItems = getCartFromLocalStorage();
  const cartTable = document.querySelector(".shopping-cart-table");
  const cartTableBody = document.querySelector(".table__body");
  cartTableBody.innerHTML = "";
  if (cartItems.length > 0) {
    cartItems.forEach((item, index) => {
      const { id, image, name, price, quantity } = item;

      const cartItemRow = document.createElement("tr");
      cartItemRow.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td><img src="${image}" alt="shopping cart image"></td>
      <td class="text-uppercase">${name}</td>
      <td>${price.toLocaleString()} Đ</td>
      <td><input class="quantity-input p-1 ps-2" type="number" min="1" value="${quantity}"></td>
      <td class="item-total">${(price * quantity).toLocaleString()} Đ</td>
      <td><a class="delete-cart-item" data-id="${id}"><i class="bi bi-x text-danger fw-bold display-6"></i></a></td>
    `;

      cartTableBody.appendChild(cartItemRow);
    });
  } else {
    cartTable.innerHTML = `
    <div class="no-item my-5 text-center">
      <h3> Không có sản phẩm nào trong giỏ hàng </h3>
     <button class="btn btn-secondary p-3 text-uppercase mt-5"><a href="product.html">Tiếp tục mua hàng </a></button>
    </div>
    `;
  }
  function calculateTotalCart() {
    let totalCart = 0;
    cartItems.forEach((item) => {
      totalCart += item.price * item.quantity;
    });
    return totalCart;
  }

  const quantityInputs = document.querySelectorAll(".quantity-input");
  quantityInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      const index = event.target.closest("tr").rowIndex - 1;
      const newQuantity = parseInt(event.target.value);
      if (!isNaN(newQuantity)) {
        cart[index].quantity = newQuantity;
        saveCartToLocalStorage();
        displayCart();
      }
      // Cập nhật giá trị item-total mỗi khi giá trị quantity thay đổi
      const itemTotalElement = document.querySelectorAll(".item-total");
      const itemPrice = cart[index].price;
      itemTotalElement[index].textContent =
        (itemPrice * newQuantity).toLocaleString() + " Đ";

      // Cập nhật tổng tiền và giỏ hàng
      const totalCart = calculateTotalCart();
      totalCartElements.forEach((totalCartElement) => {
        totalCartElement.textContent = totalCart.toLocaleString();
        
      });
      displayCart();

      // Cập nhật giá trị tổng tiền mới vào các phần tử có liên quan trong bảng
      
    });
  });

  const deleteCartItemButtons = document.querySelectorAll(".delete-cart-item");
  deleteCartItemButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = button.dataset.id;
      removeCartItem(itemId);
      displayCartItems();
    });
  });
}
// Hàm khởi tạo
function init() {
  loadCartFromLocalStorage();

  setupAddToCartListeners();
  displayCart();
  displayCartItems();
}
init();
