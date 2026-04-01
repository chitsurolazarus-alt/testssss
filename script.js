// Product Data with Prices
const productsData = {
    1: { 
        id: 1, 
        name: "Glow Whitening Lotion", 
        price: 350, 
        desc: "Complete face and body lotion that hydrates, brightens, and helps improve uneven tone, dryness, acne marks, and dull skin. Perfect for daily use to achieve that radiant glow you deserve.",
        img: "images/products/product1.jpg",
        benefits: "Hydrates, Brightens, Evens skin tone, Reduces dark spots",
        howToUse: "Apply daily after showering. Massage gently until absorbed. For best results, use morning and evening."
    },
    2: { 
        id: 2, 
        name: "Soap", 
        price: 350, 
        desc: "All-in-one cleansing bar that helps fight acne, impurities, and dull skin while keeping skin fresh and clean. Enriched with natural ingredients for gentle yet effective cleansing.",
        img: "images/products/product2.jpg",
        benefits: "Fights acne, Removes impurities, Fresh feeling, pH balanced",
        howToUse: "Lather with water, massage onto skin, rinse thoroughly. Use twice daily for best results."
    },
    3: { 
        id: 3, 
        name: "Scrub", 
        price: 400, 
        desc: "Targets everyday skin problems by gently exfoliating, clearing pores, and revealing fresh, glowing skin. Removes dead skin cells for smoother texture.",
        img: "images/products/product3.jpg",
        benefits: "Exfoliates, Unclogs pores, Reveals glow, Smooths texture",
        howToUse: "Apply to damp skin, massage in circular motions for 2-3 minutes, rinse well. Use 2-3 times per week."
    },
    4: { 
        id: 4, 
        name: "Body Oil", 
        price: 350, 
        desc: "Multi-benefit oil that nourishes deeply, supports clear skin, and restores natural radiance. Lightweight formula that absorbs quickly without greasy residue.",
        img: "images/products/product4.jpg",
        benefits: "Deep nourishment, Clear skin, Natural radiance, Fast absorbing",
        howToUse: "Apply to damp skin after showering for maximum absorption. Massage until fully absorbed."
    },
    5: { 
        id: 5, 
        name: "Soap bar", 
        price: 350, 
        desc: "Deep cleans the skin freeing it from acne and imbalance. Formulated to maintain skin's natural pH balance while providing thorough cleansing.",
        img: "images/products/product5.jpg",
        benefits: "Deep cleansing, pH balanced, Acne control, Gentle formula",
        howToUse: "Use daily. Lather and massage onto skin, rinse with warm water. Follow with moisturizer."
    },
    6: { 
        id: 6, 
        name: "BonosBeautySkin Combo", 
        price: 1500, 
        desc: "Complete skincare bundle! Get everything at an amazing value. Includes Glow Lotion, Soap, Scrub, Body Oil, and Soap Bar. Perfect for complete skincare routine.",
        img: "images/products/product6.jpg",
        benefits: "Complete routine, Best value, All products included, Save 20%",
        howToUse: "Follow each product's instructions for best results. Use in order: Soap, Scrub, Lotion, Oil."
    }
};

// Cart State
let cart = [];

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// Mobile Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Cart Functions
function updateCartUI() {
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <span>Add some beautiful products!</span>
            </div>
        `;
        cartTotalSpan.textContent = 'R0';
        cartCountSpan.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.animation = 'slideIn 0.3s ease';
        cartItem.innerHTML = `
            <div class="cart-item-img" style="background-image: url('${item.img}');"></div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">R${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-item" onclick="removeItem(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalSpan.textContent = `R${total}`;
    const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    cartCountSpan.textContent = itemCount;
    localStorage.setItem('beautyCart', JSON.stringify(cart));
}

window.updateQuantity = (index, delta) => {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
        showNotification(cart[index] ? `Quantity updated!` : 'Item removed from cart');
    }
};

window.removeItem = (index) => {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showNotification(`${itemName} removed from cart`);
};

function addToCart(productId) {
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        showNotification('Please login or create an account to add items to cart!', 'error');
        if (typeof showAuthModal === 'function') showAuthModal();
        return;
    }
    
    const product = productsData[productId];
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
        showNotification(`${product.name} quantity increased to ${existing.quantity}`);
    } else {
        cart.push({ ...product, quantity: 1 });
        showNotification(`${product.name} added to cart!`);
    }
    updateCartUI();
    
    // Animation feedback on button
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => { btn.innerHTML = originalText; }, 1500);
    }
    
    // Open cart sidebar
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('active');
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-heart' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #ff69b4, #db7093)' : 'linear-gradient(135deg, #ff6b6b, #ff4444)'};
        color: white;
        padding: 12px 20px;
        border-radius: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        font-size: 0.9rem;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Checkout - WhatsApp Receipt with Order History
function generateReceiptAndSend() {
    if (cart.length === 0) {
        showNotification("Your cart is empty. Add some products first!");
        return;
    }
    
    // Check if user is logged in
    if (!auth.isLoggedIn()) {
        showNotification('Please login to checkout!', 'error');
        if (typeof showAuthModal === 'function') showAuthModal();
        return;
    }
    
    let receiptText = "🛍️ *BONO BEAUTYSKIN ORDER* 🛍️%0A%0A";
    receiptText += `👤 *Customer:* ${auth.currentUser.name}%0A`;
    receiptText += `📧 *Email:* ${auth.currentUser.email}%0A`;
    receiptText += `📞 *Phone:* ${auth.currentUser.phone}%0A`;
    receiptText += "━━━━━━━━━━━━━━━━━━%0A";
    let total = 0;
    const orderItems = [];
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        orderItems.push({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        });
        receiptText += `✨ ${item.name}%0A`;
        receiptText += `   ×${item.quantity} @ R${item.price} = R${subtotal}%0A`;
    });
    
    receiptText += "━━━━━━━━━━━━━━━━━━%0A";
    receiptText += `📦 *TOTAL: R${total}*%0A%0A`;
    receiptText += `📞 Contact us for payment & delivery confirmation.%0A`;
    receiptText += `💝 Thank you for choosing Bono BeautySkin!%0A`;
    receiptText += `🌸 Your skin, our passion.`;
    
    // Save order to user history
    const order = {
        items: orderItems,
        total: total,
        orderDate: new Date().toISOString()
    };
    
    if (typeof saveOrderToHistory === 'function') {
        saveOrderToHistory(order);
    }
    
    const phone = "27662523100";
    const whatsappUrl = `https://wa.me/${phone}?text=${receiptText}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after sending
    cart = [];
    updateCartUI();
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
    showNotification('Order sent! We will contact you shortly 💖');
}

// Clear Cart
function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
    showNotification('Cart cleared');
}

// Cart Sidebar Toggle
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
    });
}
if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    });
}
if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    });
}
if (checkoutBtn) checkoutBtn.addEventListener('click', generateReceiptAndSend);
if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

// Product Modal with Recommendations
const modal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalProductContent = document.getElementById('modalProductContent');

function openProductModal(productId) {
    const product = productsData[productId];
    if (!product) return;
    
    const recommendations = Object.values(productsData).filter(p => p.id !== productId).slice(0, 3);
    
    modalProductContent.innerHTML = `
        <div class="modal-product-detail">
            <div class="modal-product-image" style="background-image: url('${product.img}');"></div>
            <div class="modal-product-info">
                <h2>${product.name}</h2>
                <div class="modal-price">R${product.price}</div>
                <div class="product-description">
                    <p>${product.desc}</p>
                </div>
                <div class="product-benefits">
                    <h4><i class="fas fa-star"></i> Benefits</h4>
                    <p>${product.benefits}</p>
                </div>
                <div class="product-how-to">
                    <h4><i class="fas fa-hand-sparkles"></i> How to Use</h4>
                    <p>${product.howToUse}</p>
                </div>
                <button class="btn btn-primary add-to-cart-modal" onclick="addToCartFromModal(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <div class="recommended-section">
                    <h4>✨ You May Also Like</h4>
                    <div class="recommended-grid">
                        ${recommendations.map(rec => `
                            <div class="recommend-item" onclick="openProductModal(${rec.id})">
                                <div class="recommend-img" style="background-image: url('${rec.img}');"></div>
                                <p>${rec.name}</p>
                                <small>R${rec.price}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

window.addToCartFromModal = (id) => {
    addToCart(id);
    closeModal();
};

function closeModal() {
    modal.classList.remove('active');
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Attach product card events
function attachProductEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.getAttribute('data-id');
        if (productId) {
            const imgDiv = card.querySelector('.product-image');
            if (imgDiv) {
                imgDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openProductModal(parseInt(productId));
                });
            }
            const addBtn = card.querySelector('.add-to-cart-btn');
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(parseInt(productId));
                });
            }
            const quickViewBtn = card.querySelector('.quick-view');
            if (quickViewBtn) {
                quickViewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openProductModal(parseInt(productId));
                });
            }
        }
    });
}

// Load Cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('beautyCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCartUI();
        } catch(e) { cart = []; }
    }
}

// Sticky Header & Animations
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(255, 105, 180, 0.2)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.boxShadow = '';
            header.style.background = '';
            header.style.backdropFilter = '';
        }
    }
});

// Intersection Observer for scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .stat-item, .contact-card, .value-item, .transformation-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add auth styles to existing CSS
const authStyles = document.createElement('style');
authStyles.textContent = `
    .user-controls {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .user-icon {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 15px;
        border-radius: 30px;
        background: var(--soft-pink);
        transition: all 0.3s ease;
    }
    
    .user-icon:hover {
        background: var(--primary-pink);
        color: white;
    }
    
    .user-icon i {
        font-size: 1.2rem;
    }
    
    .user-icon span {
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .user-menu {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 280px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 1500;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .user-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .user-menu-header {
        padding: 20px;
        background: linear-gradient(135deg, var(--primary-pink), var(--dark-pink));
        color: white;
        border-radius: 20px 20px 0 0;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .user-menu-header i {
        font-size: 2.5rem;
    }
    
    .user-menu-header h4 {
        margin: 0;
        font-size: 1rem;
    }
    
    .user-menu-header p {
        margin: 5px 0 0;
        font-size: 0.8rem;
        opacity: 0.9;
    }
    
    .user-menu-items {
        padding: 10px;
    }
    
    .user-menu-items a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        color: var(--text-dark);
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .user-menu-items a:hover {
        background: var(--soft-pink);
        color: var(--primary-pink);
    }
    
    .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .auth-modal.active {
        visibility: visible;
        opacity: 1;
    }
    
    .auth-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
    }
    
    .auth-container {
        position: relative;
        background: white;
        max-width: 450px;
        width: 90%;
        border-radius: 30px;
        padding: 40px;
        animation: modalZoom 0.4s ease;
    }
    
    .auth-close {
        position: absolute;
        top: 20px;
        right: 25px;
        background: var(--soft-pink);
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        color: var(--primary-pink);
        transition: all 0.3s ease;
    }
    
    .auth-close:hover {
        background: var(--primary-pink);
        color: white;
        transform: rotate(90deg);
    }
    
    .auth-form {
        display: none;
    }
    
    .auth-form.active {
        display: block;
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .auth-header h2 {
        color: var(--primary-pink);
        margin-bottom: 10px;
    }
    
    .auth-header p {
        color: var(--text-light);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-dark);
    }
    
    .form-group label i {
        margin-right: 8px;
        color: var(--primary-pink);
    }
    
    .form-group input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid var(--medium-gray);
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--primary-pink);
    }
    
    .auth-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, var(--primary-pink), var(--dark-pink));
        color: white;
        border: none;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .auth-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
    }
    
    .auth-footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--medium-gray);
    }
    
    .auth-footer a {
        color: var(--primary-pink);
        text-decoration: none;
        font-weight: 600;
    }
    
    .auth-footer a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(authStyles);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    attachProductEvents();
    const currentYear = document.getElementById('currentYear');
    if (currentYear) currentYear.textContent = new Date().getFullYear();
    console.log('Bono BeautySkin with Auth System Ready!');
});