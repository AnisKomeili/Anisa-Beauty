//=====================================
// Cart Page
//=====================================

const cartContainer =
    document.getElementById("cartPageItems");

const subtotalElement =
    document.getElementById("summarySubtotal");

const totalElement =
    document.getElementById("summaryTotal");

const paymentButton =
    document.querySelector(".payment-btn");


const SHIPPING_KEY = "beauty_shipping";

let shippingCost =
    Number(localStorage.getItem(SHIPPING_KEY)) || 120000;

const DISCOUNT_KEY = "beauty_discount";

let discount = Number(
    localStorage.getItem(DISCOUNT_KEY)
) || 0;

const discountCodes = {

    WELCOME10: {
        type: "percent",
        value: 10
    },

    ANISA20: {
        type: "percent",
        value: 20
    },

    FREESHIP: {
        type: "shipping"
    }

};

//=====================================
// Read Cart
//=====================================

const getCart = () => {

    return JSON.parse(
        localStorage.getItem("beauty_cart")
    ) || [];

};


//=====================================
// Render Cart
//=====================================

const renderCart = () => {

    const cart = getCart();
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    سبد خرید شما خالی است
                </h2>

                <p>
                    هنوز محصولی به سبد خرید اضافه نکرده‌اید.
                </p>

                <a href="index.html"
                   class="payment-btn"
                   style="display:inline-block;
                          width:auto;
                          margin-top:25px;
                          text-decoration:none;
                          padding:15px 30px;">

                    بازگشت به فروشگاه

                </a>
            </div>
        `;

        subtotalElement.textContent =
            formatPrice(0);

        totalElement.textContent =
            formatPrice(0);

        return;

    }

    cartContainer.innerHTML = cart.map(item => `
        <article class="cart-item-card">
            <img
                src="${item.image}"
                alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-category">
                    ${item.category}
                </div>
                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-item-price">

                    ${formatPrice(item.price)}

                </div>
            </div>

            <div class="cart-item-right">
                <div class="quantity-box">
                    <button
                        onclick="changeQuantity(${item.id},-1)">

                        -

                    </button>

                    <span class="quantity-number">

                        ${item.quantity}

                    </span>

                    <button
                        onclick="changeQuantity(${item.id},1)">

                        +

                    </button>

                </div>

                <div class="cart-total-price">
                    ${formatPrice(
                        item.price * item.quantity
                    )}
                </div>

                <button
                    class="remove-btn"
                    onclick="deleteItem(${item.id})">

                    حذف محصول

                </button>
            </div>
        </article>

    `).join("");

    const total = cart.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );

    subtotalElement.textContent =
        formatPrice(total);

    const shipping =
        shippingCost;

    const finalTotal =
        total + shipping - discount;

    document.getElementById(
        "discountAmount"
    ).textContent =
        formatPrice(discount);

    totalElement.textContent =
        formatPrice(
            Math.max(finalTotal, 0)
        );
};

const applyDiscount = () => {
    const input =
        document.getElementById("discountInput");

    const message =
        document.getElementById("discountMessage");

    const code =
        input.value
            .trim()
            .toUpperCase();

    discount = 0;
    message.className = "";
    if (!discountCodes[code]) {
        message.textContent =
            "کد تخفیف معتبر نیست.";
        message.classList.add("error");

        localStorage.removeItem(
            DISCOUNT_KEY
        );

        renderCart();
        return;
    }

    const cart = getCart();

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

    if (
        discountCodes[code].type === "percent"
    ) {
        discount =
            total *
            discountCodes[code].value /
            100;
    }

    if (
        discountCodes[code].type === "shipping"
    ) {
        discount =
            shippingCost;
    }

    localStorage.setItem(
        DISCOUNT_KEY,
        discount
    );

    message.textContent =
        "کد تخفیف با موفقیت اعمال شد.";

    message.classList.add("success");

    renderCart();

};


//=====================================
// Change Quantity
//=====================================

const changeQuantity = (id, amount) => {
    const cart = getCart();
    const item =
        cart.find(product => product.id === id);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) {
        const index =
            cart.findIndex(product => product.id === id);

        cart.splice(index, 1);
    }

    localStorage.setItem(
        "beauty_cart",
        JSON.stringify(cart)
    );

    renderCart();
};

//=====================================
// Delete Item
//=====================================

const deleteItem = (id) => {
    const cart = getCart().filter(
        item => item.id !== id
    );

    localStorage.setItem(
        "beauty_cart",
        JSON.stringify(cart)
    );
    renderCart();
};

//=====================================
// Payment Button
//=====================================

paymentButton?.addEventListener("click", () => {

    showToast(
        "درگاه پرداخت در نسخه بعدی اضافه خواهد شد."
    );

});

//=====================================
// Initial Load
//=====================================

document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("theme") === "true") {
        document.body.classList.add("dark");
    }
    const shippingInputs =
        document.querySelectorAll(
            'input[name="shipping"]'
        );

    shippingInputs.forEach(input => {

        if (
            Number(input.value) === shippingCost
        ) {
            input.checked = true;
        }
        input.closest(".shipping-option")
         ?.classList.add("active");

        input.addEventListener("change", () => {

            document
                .querySelectorAll(".shipping-option")
                .forEach(card=>{

                    card.classList.remove("active");

                });

                input.closest(".shipping-option")
                ?.classList.add("active");

            shippingCost =
                Number(input.value);

            localStorage.setItem(
                SHIPPING_KEY,
                shippingCost
            );

        renderCart();
        });
    });
    renderCart();

});

document
    .getElementById("applyDiscountBtn")
    ?.addEventListener(
        "click",
        applyDiscount
    );

renderCart();


//=====================================
// Refresh On Focus
//=====================================

window.addEventListener("focus", () => {
    renderCart();
});


//=====================================
// Refresh On Browser Back
//=====================================

window.addEventListener("pageshow", () => {
    renderCart();
});