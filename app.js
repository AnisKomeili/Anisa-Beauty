let showFavoritesOnly = false;

let favorites =
 JSON.parse(
  localStorage.getItem("beauty_favorites")
 ) || [];

const renderProducts = (query = "") => {

  const grid = document.getElementById("productsGrid");

  const category =
    document.getElementById("categoryFilter").value;

  const q = query.trim().toLowerCase();

  const filtered = products.filter(product => {

    const matchSearch =
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);

    const matchCategory =
      !category ||
      product.category === category;

    const matchFavorite = 
      !showFavoritesOnly || favorites.includes(product.id);


    return matchSearch && matchCategory && matchFavorite;
  });

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        محصولی پیدا نشد.
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {

    const cartItem = getCartItem(product.id);

    return `
      <article class="product-card">

        <div class="product-img-wrapper"
             onclick="openModal(${product.id})">

          <img src="${product.image}"
               alt="${product.name}"
               loading="lazy">

        </div>

        <button
          class="favorite-btn"
          onclick="toggleFavorite(${product.id})">

          ${favorites.includes(product.id)
            ? "❤️"
            : "🤍"}

        </button>


        <div class="product-info">

          <div class="product-category">
            ${product.category}
          </div>

          <h3 class="product-name">
            ${product.name}
          </h3>

          <div class="product-price">
            ${formatPrice(product.price)}
          </div>

          ${
            cartItem
            ?
            `
            <div class="quantity-controls">

              <button
                class="qty-btn"
                onclick="decreaseQuantity(${product.id})">
                -
              </button>

              <span class="qty-number">
                ${cartItem.quantity}
              </span>

              <button
                class="qty-btn"
                onclick="increaseQuantity(${product.id})">
                +
              </button>

            </div>
            `
            :
            `
            <button
              class="add-to-cart-btn"
              onclick="addToCart(${product.id})">

              افزودن به سبد خرید

            </button>
            `
          }

        </div>

      </article>
    `;

  }).join("");

  initScrollAnimation();
};

const updateCartUI = () => {

  const cartItems =
    document.getElementById("cartItems");

  const cartCount =
    document.getElementById("cartCount");

  const cartTotal =
    document.getElementById("cartTotal");

  const totalItems =
    state.cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

  cartCount.textContent = totalItems;

  if (!state.cart.length) {

    cartItems.innerHTML = `
      <p class="empty-state">
        سبد خرید شما خالی است.
      </p>
    `;

    cartTotal.textContent = formatPrice(0);

    return;
  }

  cartItems.innerHTML = state.cart.map(item => `

    <div class="cart-item">

      <img src="${item.image}"
           alt="${item.name}">

      <div>

        <div class="cart-item-title">
          ${item.name}
        </div>

        <div class="cart-item-meta">
          ${item.quantity} عدد ×
          ${formatPrice(item.price)}
        </div>

      </div>

      <div class="cart-item-actions">

        <button onclick="removeFromCart(${item.id})">
          حذف
        </button>

      </div>

    </div>

  `).join("");

  const total =
    state.cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

  cartTotal.textContent =
    formatPrice(total);
};

const toggleCart = () => {

  document
    .getElementById("cartDrawer")
    .classList.toggle("open");

  document
    .querySelector(".cart-overlay")
    .classList.toggle("show");
};

const openModal = (productId) => {

  const product =
    products.find(p => p.id === productId);

  const modal =
    document.getElementById("productModal");

  const content =
    document.getElementById("modalContent");

  content.innerHTML = `
    <div class="modal-grid">

      <img src="${product.image}"
           alt="${product.name}">

      <div>

        <span class="hero__tag">
          ${product.category}
        </span>

        <h2 style="margin-bottom:12px;">
          ${product.name}
        </h2>

        <p style="line-height:1.9;margin-bottom:16px;">
          این محصول با کیفیت بالا و طراحی لوکس
          برای تجربه‌ای حرفه‌ای انتخاب شده است.
        </p>

        <div style="font-size:1.4rem;
                    font-weight:800;
                    margin-bottom:18px;">

          ${formatPrice(product.price)}

        </div>

        <button
          class="add-to-cart-btn"
          onclick="addToCart(${product.id});closeModal();">

          افزودن به سبد خرید

        </button>

      </div>

    </div>
  `;

  modal.showModal();
};

const closeModal = () => {
  document.getElementById("productModal").close();
};

const openContactModal = () => {
  document.getElementById("contactModal").showModal();
};

const closeContactModal = () => {
  document.getElementById("contactModal").close();
};

const toggleTheme = () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark")
  );
};

const initScrollAnimation = () => {

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }

    });

  });

  document
    .querySelectorAll(".product-card")
    .forEach(card => observer.observe(card));
};

document.addEventListener("DOMContentLoaded", () => {

  if (
    localStorage.getItem("theme") === "true"
  ) {
    document.body.classList.add("dark");
  }

  renderProducts();
  updateCartUI();

  document
    .getElementById("searchInput")
    .addEventListener("input", (e) => {

      renderProducts(e.target.value);

    });


  document.getElementById("sortFilter")
    ?.addEventListener("change", () => {
      renderProducts(
        document.getElementById("searchInput").value
      );
  });

  document
  .getElementById("categoryFilter")
  ?.addEventListener("change", () => {
    renderProducts(
      document.getElementById("searchInput").value
    );

});
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);

});

document
  .getElementById("favLink")
  ?.addEventListener("click", (e) => {

    e.preventDefault();

    showFavoritesOnly = !showFavoritesOnly;

    document
      .getElementById("favLink")
      .classList.toggle("active");

    renderProducts(
      document.getElementById("searchInput").value
    );

});

const toggleFavorite = (id) => {

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem(
    "beauty_favorites",
    JSON.stringify(favorites)
  );

  renderProducts(
    document.getElementById("searchInput")?.value || ""
  );

};