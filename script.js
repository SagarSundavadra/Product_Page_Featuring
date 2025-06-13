let cart = [];
let currentProduct = {
    id: 1,
    name: "Tefnut Beach Vest",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    color: "black",
    size: "M",
    quantity: 1
};
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartContent = document.getElementById('cartContent');
const cartTotal = document.getElementById('cartTotal');
const successPopup = document.getElementById('successPopup');
const popupOverlay = document.getElementById('popupOverlay');
const quantityInput = document.getElementById('quantity');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupEventListeners();
}); 

// Event Listeners Setup
function setupEventListeners() {
    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentProduct.color = this.dataset.color;
            updateMainImageForColor(this.dataset.color);
        });
    });

    // Size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentProduct.size = this.dataset.size;
        });
    });

    // Quantity input change
    quantityInput.addEventListener('change', function() {
        currentProduct.quantity = parseInt(this.value);
    });
}

// Image management
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumbnail.src.replace('w=300', 'w=1000');
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

function updateMainImageForColor(color) {
    const mainImage = document.getElementById('mainImage');
    const colorImages = {
        black: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        white: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        navy: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        olive: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    };
    
    if (colorImages[color]) {
        mainImage.src = colorImages[color];
        currentProduct.image = colorImages[color].replace('w=1000', 'w=300');
    }
}

// Quantity management
function increaseQuantity() {
    const quantity = parseInt(quantityInput.value);
     quantityInput.value = quantity + 1;
        currentProduct.quantity = quantity + 1;
        // if (quantity < 10) {
        //     quantityInput.value = quantity + 1;
        //     currentProduct.quantity = quantity + 1;
        // }
}

function decreaseQuantity() {
    const quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
        currentProduct.quantity = quantity - 1;
    }
}

// Cart management
function addToCart() {
    // Check if item with same properties already exists
    const existingItemIndex = cart.findIndex(item => 
        // item.img === currentProduct.img &&
        item.id === currentProduct.id && 
        item.color === currentProduct.color && 
        item.size === currentProduct.size
    );

    if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart[existingItemIndex].quantity += currentProduct.quantity;
    } else {
        // Add new item to cart
        cart.push({
            ...currentProduct,
            cartId: Date.now() // Unique identifier for cart item
        });
    }

    updateCartDisplay();
    showSuccessPopup();
    
    // Add animation to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.animation = 'bounce 0.6s ease';
    setTimeout(() => {
        cartIcon.style.animation = '';
    }, 600);
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartDisplay();
}

function updateCartItemQuantity(cartId, newQuantity) {
    const item = cart.find(item => item.cartId === cartId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(cartId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart content
    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        cartContent.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                <button class="remove-item" onclick="removeFromCart(${item.cartId})">+</button>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-options">${item.color} • ${item.size}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="cart-qty-btn" onclick="updateCartItemQuantity(${item.cartId}, ${item.quantity - 1})">-</button>
                        <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" readonly>
                        <button class="cart-qty-btn" onclick="updateCartItemQuantity(${item.cartId}, ${item.quantity + 1})">+</button>
                        
                    </div>
                </div>
            </div>
        `).join('');

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

// Cart sidebar management
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    
    // Prevent body scroll when cart is open
    if (cartSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Popup management
function showSuccessPopup() {
    successPopup.classList.add('active');
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Auto close after 3 seconds
    setTimeout(closePopup, 3000);
}

function closePopup() {
    successPopup.classList.remove('active');
    popupOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function viewCart() {
    closePopup();
    toggleCart();
}

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.style.opacity = '0.5';
        this.alt = 'Image not available';
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && cartSidebar.classList.contains('active')) {
        // Ensure cart sidebar is properly positioned on resize
        cartSidebar.style.right = '0';
    }
});

// Form validation
// function validateQuantity() {
//     const quantity = parseInt(quantityInput.value);
//     if (isNaN(quantity) || quantity < 1) {
//         quantityInput.value = 1;
//         currentProduct.quantity = 1;
//     } else if (quantity > 10) {
//         quantityInput.value = 10;
//         currentProduct.quantity = 10;
//     }
// }

// Add input validation
// quantityInput.addEventListener('blur', validateQuantity);
// quantityInput.addEventListener('input', function() {
//     const quantity = parseInt(this.value);
//     if (!isNaN(quantity) && quantity >= 1 && quantity <= 10) {
//         currentProduct.quantity = quantity;
//     }
// });

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
        if (successPopup.classList.contains('active')) {
            closePopup();
        }
    }
    
    // Add to cart with Enter key when quantity input is focused
    if (e.key === 'Enter' && document.activeElement === quantityInput) {
        addToCart();
    }
});