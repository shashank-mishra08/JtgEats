// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeCarousel();
    initializeModal();
    initializeVideo();
    initializeForms();
    initializeNavigation();
    initializeQuantityControls(); // New function call
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add cart functionality
    initializeCart();
}

// New function to initialize quantity controls visibility
function initializeQuantityControls() {
    document.querySelectorAll('.quantity-controls').forEach(controls => {
        const quantityEl = controls.querySelector('.quantity');
        const minusBtn = controls.querySelector('.quantity-btn.minus');

        if (quantityEl && minusBtn) {
            const currentQuantity = parseInt(quantityEl.textContent);
            if (currentQuantity === 0) {
                minusBtn.style.display = 'none';
                quantityEl.style.display = 'none';
            } else {
                minusBtn.style.display = 'flex';
                quantityEl.style.display = 'block';
            }
        }
    });
}

function initializeNavigation() {
    // Mobile menu toggle (if needed)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
}

function initializeCart() {
    let cartItems = [];
    let cartCount = 2; // Initial count as shown in design
    
    // Update cart badge
    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = cartCount;
        }
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.food-card');
            const itemData = card ? JSON.parse(card.dataset.item || '{}') : {};
            
            // Add item to cart
            cartItems.push(itemData);
            cartCount++;
            updateCartBadge();
            
            // Show feedback
            showSuccessMessage('Item added to cart!');
            
            // Add visual feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.textContent = '+';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Cart button click
    document.querySelector('.cart-btn')?.addEventListener('click', function() {
        showSuccessMessage(`You have ${cartCount} items in your cart`);
    });
}

function initializeForms() {
    // Contact form submission
    window.submitContactForm = function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showSuccessMessage('Thank you for your message! We\'ll get back to you within 48 hours.');
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    };
    
    // Request form submission
    window.submitRequestForm = function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showSuccessMessage('Your dish request has been submitted! We\'ll contact you soon.');
            form.reset();
            closeRequestModal();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    };
}

function showSuccessMessage(message) {
    // Remove existing message
    const existing = document.querySelector('.success-message');
    if (existing) {
        existing.remove();
    }
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // Show message
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 100);
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 3000);
}

// Quantity controls for popular items
window.updateQuantity = function(itemId, change) {
    const quantityEl = document.getElementById(`quantity-${itemId}`);
    if (quantityEl) {
        let currentQuantity = parseInt(quantityEl.textContent);
        currentQuantity = Math.max(0, currentQuantity + change);
        quantityEl.textContent = currentQuantity;

        const quantityControls = quantityEl.closest('.quantity-controls');
        if (quantityControls) {
            const minusBtn = quantityControls.querySelector('.quantity-btn.minus');
            const quantitySpan = quantityControls.querySelector('.quantity');

            if (currentQuantity === 0) {
                if (minusBtn) minusBtn.style.display = 'none';
                if (quantitySpan) quantitySpan.style.display = 'none';
            } else {
                if (minusBtn) minusBtn.style.display = 'flex'; // Restore display for flex item
                if (quantitySpan) quantitySpan.style.display = 'block'; // Restore display for block item
            }
        }

        // Update cart if quantity changes
        if (change > 0) {
            showSuccessMessage('Quantity updated!');
        }
    }
};

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = document.querySelectorAll('.search-input');
    const searchButtons = document.querySelectorAll('.search-button, .search-btn');
    
    searchButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const searchInput = this.previousElementSibling || document.querySelector('.search-input');
            const query = searchInput?.value.trim();
            
            if (query) {
                showSuccessMessage(`Searching for "${query}"...`);
                // Here you would implement actual search functionality
            }
        });
    });
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    showSuccessMessage(`Searching for "${query}"...`);
                    // Here you would implement actual search functionality
                }
            }
        });
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.food-card, .section-header, .contact-text');
    animatedElements.forEach(el => observer.observe(el));
});