let state = {
  cart: JSON.parse(localStorage.getItem("beauty_cart")) || []
};

//============================
// نمایش قیمت
//============================

const formatPrice = (price) =>
  `${new Intl.NumberFormat("en-IR").format(price)} تومان`;

//============================
// Toast
//============================

const showToast = (message) => {
  const toast =
    document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
};

const saveCart = () => {
  localStorage.setItem("beauty_cart", JSON.stringify(state.cart));
};

const getCartItem = (id) => {
  return state.cart.find(item => item.id === id);
};


const addToCart = (productId) => {
  const product =
    products.find(p => p.id === productId);

  const existing =
    state.cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({
      ...product,
      quantity: 1
    });
  }
  saveCart();
  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
  showToast("✓ محصول به سبد خرید اضافه شد");
  if (typeof renderProducts === "function") {
    renderProducts(
      document.getElementById("searchInput")?.value || ""
    );
  }
  if (typeof renderCart === "function") {
    renderCart();
  }
};


const increaseQuantity = (id) => {
  const item =
    state.cart.find(product => product.id === id);
  if (!item) return;
  item.quantity++;
  saveCart();
  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
  if (typeof renderProducts === "function") {
    renderProducts(
      document.getElementById("searchInput")?.value || ""
    );
  }
  if (typeof renderCart === "function") {
    renderCart();
  }
};

const decreaseQuantity = (id) => {
  const item =
    state.cart.find(product => product.id === id);
  if (!item) return;
  item.quantity--;
  if (item.quantity <= 0) {
    state.cart =
      state.cart.filter(product => product.id !== id);
  }

  saveCart();
  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
  if (typeof renderProducts === "function") {
    renderProducts(
      document.getElementById("searchInput")?.value || ""
    );
  }
  if (typeof renderCart === "function") {
    renderCart();
  }
};

const removeFromCart = (productId) => {
  state.cart =
    state.cart.filter(item => item.id !== productId);
  saveCart();
  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
  if (typeof renderProducts === "function") {
    renderProducts(
      document.getElementById("searchInput")?.value || ""
    );
  }
  if (typeof renderCart === "function") {
    renderCart();
  }
};
