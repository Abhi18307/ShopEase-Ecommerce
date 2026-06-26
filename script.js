const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones with rich bass and comfortable fit.",
        price: 79.99,
        image: "images/Headphone-Zone-HBD-630-hostpot-mobile-01.jpg"
    },
    {
        id: 2,
        name: "Denim T-shirt",
        description: "Classic denim t-shirt with relaxed fit and rugged wash detail.",
        price: 89.99,
        image: "images/Clothes.jpg"
    },
    {
        id: 3,
        name: "Cricket Bat",
        description: "Premium willow bat designed for powerful shots and great control.",
        price: 69.99,
        image: "images/Cricket bat.jpeg"
    },
    {
        id: 4,
        name: "Training Football",
        description: "Durable all-weather football built for daily practice and play.",
        price: 34.99,
        image: "images/Football.jpg"
    },
    {
        id: 5,
        name: "Nivia Pro Ball",
        description: "Official-size football ideal for school matches and training sessions.",
        price: 29.99,
        image: "images/Nivia Football.jpeg"
    },
    {
        id: 6,
        name: "Portable Speaker",
        description: "High-quality portable speaker with clear sound and long battery life.",
        price: 49.99,
        image: "images/images.jpeg"
    },
    {
        id: 7,
        name: "Wooden Cricket Bat",
        description: "Classic bat for practice and match-day power plays.",
        price: 64.99,
        image: "images/Bat.jpg"
    },
    {
        id: 8,
        name: "Blue Jeans",
        description: "Comfortable denim jeans ideal for everyday styling.",
        price: 54.99,
        image: "images/jeans.jpg"
    },
    {
        id: 9,
        name: "Sports Sneakers",
        description: "Lightweight sneakers built for comfort during workouts and walks.",
        price: 69.99,
        image: "images/MF05263P09-16x9-wk25.avif"
    },
    {
        id: 10,
        name: "Rubik's Cube",
        description: "Classic 3x3 cube puzzle for skill-building and fun.",
        price: 19.99,
        image: "images/Rubik Cube.jpg"
    },
    {
        id: 11,
        name: "Bluetooth Speaker",
        description: "Compact Bluetooth speaker with rich sound and sleek design.",
        price: 59.99,
        image: "images/Speaker"
    },
    {
        id: 12,
        name: "Wired Earphones",
        description: "Comfortable wired earphones with clear audio and durable cable.",
        price: 24.99,
        image: "images/wired earphone.jpeg"
    }
];

const cart = new Map();
const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartButton = document.getElementById("closeCartButton");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const paymentModal = document.getElementById("paymentModal");
const closePaymentButton = document.getElementById("closePaymentButton");
const paymentForm = document.getElementById("paymentForm");
const paymentMethod = document.getElementById("paymentMethod");
const cardFields = document.getElementById("cardFields");
const paypalInfo = document.getElementById("paypalInfo");
const paymentAmount = document.getElementById("paymentAmount");
const authModal = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");
const closeAuthButton = document.getElementById("closeAuthButton");
const authModeLogin = document.getElementById("authModeLogin");
const authModeSignup = document.getElementById("authModeSignup");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");
const authButton = document.getElementById("authButton");
const userBadge = document.getElementById("userBadge");
const ordersButton = document.getElementById("ordersButton");
const orderHistoryModal = document.getElementById("orderHistoryModal");
const closeOrdersButton = document.getElementById("closeOrdersButton");
const ordersList = document.getElementById("ordersList");
const searchInput = document.getElementById("searchInput");
const shopNowButton = document.getElementById("shopNowButton");

function formatPrice(value) {
    return `$${value.toFixed(2)}`;
}

function renderProducts(items) {
    productsGrid.innerHTML = items.map(product => `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
            </div>
            <div class="product-meta">
                <span class="price">${formatPrice(product.price)}</span>
                <button class="add-button" data-id="${product.id}">Add</button>
            </div>
        </article>
    `).join("");

    productsGrid.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            addToCart(id);
        });
    });
}

function updateCartCount() {
    const totalItems = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartTotal() {
    const total = [...cart.values()].reduce((sum, item) => sum + item.quantity * item.price, 0);
    cartTotal.textContent = formatPrice(total);
}

function renderCartItems() {
    if (cart.size === 0) {
        cartItems.innerHTML = `<p style="color: var(--muted);">Your cart is empty. Add a product to begin.</p>`;
        return;
    }

    cartItems.innerHTML = [...cart.values()].map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${formatPrice(item.price)} × ${item.quantity}</span>
                <div class="quantity-controls">
                    <button data-id="${item.id}" data-action="decrease">-</button>
                    <button data-id="${item.id}" data-action="increase">+</button>
                </div>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
    `).join("");

    cartItems.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            const action = button.dataset.action;
            changeQuantity(id, action);
        });
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    if (cart.has(productId)) {
        const existing = cart.get(productId);
        existing.quantity += 1;
    } else {
        cart.set(productId, { ...product, quantity: 1 });
    }

    updateCartCount();
    updateCartTotal();
    renderCartItems();
    showCart();
}

function changeQuantity(productId, action) {
    const item = cart.get(productId);
    if (!item) return;

    if (action === "increase") {
        item.quantity += 1;
    } else if (action === "decrease") {
        item.quantity -= 1;
    }

    if (item.quantity <= 0) {
        cart.delete(productId);
    }

    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function showCart() {
    cartDrawer.classList.add("visible");
    cartDrawer.classList.remove("hidden");
    overlay.classList.remove("hidden");
    cartDrawer.setAttribute("aria-hidden", "false");
}

function hideCart() {
    cartDrawer.classList.remove("visible");
    cartDrawer.classList.add("hidden");
    overlay.classList.add("hidden");
    cartDrawer.setAttribute("aria-hidden", "true");
}

function showPaymentModal() {
    paymentModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    paymentModal.setAttribute("aria-hidden", "false");
    paymentAmount.textContent = formatPrice(getCartTotalValue());
}

function hidePaymentModal() {
    paymentModal.classList.add("hidden");
    overlay.classList.add("hidden");
    paymentModal.setAttribute("aria-hidden", "true");
}

function showAuthModal() {
    authModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    authModal.setAttribute("aria-hidden", "false");
}

function hideAuthModal() {
    authModal.classList.add("hidden");
    overlay.classList.add("hidden");
    authModal.setAttribute("aria-hidden", "true");
}

function showOrdersModal() {
    orderHistoryModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    orderHistoryModal.setAttribute("aria-hidden", "false");
    renderOrderHistory();
}

function hideOrdersModal() {
    orderHistoryModal.classList.add("hidden");
    overlay.classList.add("hidden");
    orderHistoryModal.setAttribute("aria-hidden", "true");
}

function getCartTotalValue() {
    return [...cart.values()].reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function updatePaymentFields() {
    const method = paymentMethod.value;
    if (method === "paypal") {
        cardFields.classList.add("hidden");
        paypalInfo.classList.remove("hidden");
    } else {
        cardFields.classList.remove("hidden");
        paypalInfo.classList.add("hidden");
    }
}

function authenticateUser(email, password, mode) {
    if (mode === "signup") {
        const existing = localStorage.getItem(`user_${email}`);
        if (existing) {
            authMessage.textContent = "Account already exists. Please login.";
            return null;
        }
        localStorage.setItem(`user_${email}`, JSON.stringify({ email, password }));
        return { email };
    }

    const stored = localStorage.getItem(`user_${email}`);
    if (!stored) {
        authMessage.textContent = "No account found. Please sign up.";
        return null;
    }

    const userData = JSON.parse(stored);
    if (userData.password !== password) {
        authMessage.textContent = "Incorrect password. Try again.";
        return null;
    }

    return { email };
}

function setLoggedInUser(user) {
    if (user) {
        localStorage.setItem("shopEaseUser", JSON.stringify(user));
        userBadge.textContent = user.email;
        userBadge.classList.remove("hidden");
        authButton.textContent = "Logout";
        ordersButton.classList.remove("hidden");
        authMessage.textContent = "";
    }
}

function clearLoggedInUser() {
    localStorage.removeItem("shopEaseUser");
    authButton.textContent = "Login";
    userBadge.classList.add("hidden");
    ordersButton.classList.add("hidden");
}

function getLoggedInUser() {
    const user = localStorage.getItem("shopEaseUser");
    return user ? JSON.parse(user) : null;
}

function recordOrder(order) {
    const user = getLoggedInUser();
    if (!user) return;
    const key = `orders_${user.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(order);
    localStorage.setItem(key, JSON.stringify(existing));
}

function renderOrderHistory() {
    const user = getLoggedInUser();
    if (!user) {
        ordersList.innerHTML = `<p style="color: var(--muted);">Please log in to view your orders.</p>`;
        return;
    }

    const key = `orders_${user.email}`;
    const history = JSON.parse(localStorage.getItem(key) || "[]");
    if (history.length === 0) {
        ordersList.innerHTML = `<p style="color: var(--muted);">No orders yet. Place your first order!</p>`;
        return;
    }

    ordersList.innerHTML = history.map(order => `
        <div class="order-card">
            <h4>Order #${order.id}</h4>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
            <p><strong>Items:</strong> ${order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}</p>
        </div>
    `).join("");
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = products.filter(product => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));
    renderProducts(filtered);
}

cartButton.addEventListener("click", showCart);
closeCartButton.addEventListener("click", hideCart);
overlay.addEventListener("click", () => {
    hideCart();
    hidePaymentModal();
});
checkoutButton.addEventListener("click", () => {
    if (cart.size === 0) {
        alert("Your cart is empty. Add items before checking out.");
        return;
    }

    hideCart();
    showPaymentModal();
});

closePaymentButton.addEventListener("click", hidePaymentModal);
closeAuthButton.addEventListener("click", hideAuthModal);
authModeLogin.addEventListener("click", () => setAuthMode("login"));
authModeSignup.addEventListener("click", () => setAuthMode("signup"));
authButton.addEventListener("click", () => {
    const user = getLoggedInUser();
    if (user) {
        clearLoggedInUser();
        return;
    }
    setAuthMode("login");
    showAuthModal();
});
ordersButton.addEventListener("click", showOrdersModal);
closeOrdersButton.addEventListener("click", hideOrdersModal);
paymentMethod.addEventListener("change", updatePaymentFields);
paymentForm.addEventListener("submit", event => {
    event.preventDefault();
    const method = paymentMethod.value;
    const total = getCartTotalValue();

    if (cart.size === 0) {
        alert("Your cart is empty. Add items before paying.");
        hidePaymentModal();
        return;
    }

    if (method === "card") {
        const cardName = document.getElementById("cardName").value.trim();
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const cardExpiry = document.getElementById("cardExpiry").value.trim();
        const cardCvc = document.getElementById("cardCvc").value.trim();

        if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
            alert("Please complete all credit card fields.");
            return;
        }

        alert(`Payment successful! Charged ${formatPrice(total)} to your card ending in ${cardNumber.slice(-4)}.`);
    } else {
        alert(`Redirecting to PayPal for payment of ${formatPrice(total)}.`);
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        total,
        items: [...cart.values()].map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }))
    };

    recordOrder(order);
    cart.clear();
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    hidePaymentModal();
});

function setAuthMode(mode) {
    const isSignup = mode === "signup";
    authTitle.textContent = isSignup ? "Sign Up" : "Login";
    authModeLogin.classList.toggle("active", !isSignup);
    authModeSignup.classList.toggle("active", isSignup);
    authForm.querySelector("button[type=submit]").textContent = isSignup ? "Sign Up" : "Sign In";
    authMessage.textContent = "";
}

authForm.addEventListener("submit", event => {
    event.preventDefault();
    const mode = authModeSignup.classList.contains("active") ? "signup" : "login";
    const user = authenticateUser(authEmail.value.trim(), authPassword.value.trim(), mode);
    if (user) {
        setLoggedInUser(user);
        hideAuthModal();
    }
});

overlay.addEventListener("click", () => {
    hideCart();
    hidePaymentModal();
    hideAuthModal();
    hideOrdersModal();
});

searchInput.addEventListener("input", handleSearch);
shopNowButton.addEventListener("click", () => {
    window.scrollTo({ top: document.querySelector(".products-section").offsetTop - 80, behavior: "smooth" });
});

const currentUser = getLoggedInUser();
if (currentUser) {
    setLoggedInUser(currentUser);
}

renderProducts(products);
renderCartItems();
updateCartCount();
updateCartTotal();
