// Modal functionality
let activeModal = null;

function initializeModal() {
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeModal) {
            closeRequestModal();
        }
    });
    
    // Prevent body scroll when modal is open
    function toggleBodyScroll(disable) {
        if (disable) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Update modal functions to handle body scroll
    const originalOpenModal = window.openRequestModal;
    const originalCloseModal = window.closeRequestModal;
    
    window.openRequestModal = function() {
        if (originalOpenModal) originalOpenModal();
        toggleBodyScroll(true);
    };
    
    window.closeRequestModal = function(event) {
        if (originalCloseModal) originalCloseModal(event);
        toggleBodyScroll(false);
    };
}

// Open request modal
window.openRequestModal = function() {
    const modal = document.getElementById('requestModal');
    if (modal) {
        activeModal = modal;
        modal.classList.add('active');
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
};

// Close request modal
window.closeRequestModal = function(event) {
    const modal = document.getElementById('requestModal');
    
    // If event is provided, check if it's clicking outside the modal content
    if (event && event.target !== modal) {
        return;
    }
    
    if (modal) {
        modal.classList.remove('active');
        activeModal = null;
        
        // Reset form
        const form = modal.querySelector('.request-form');
        if (form) {
            form.reset();
        }
    }
};

// Form validation
function validateRequestForm(formData) {
    const errors = [];
    
    if (!formData.get('dishName')?.trim()) {
        errors.push('Dish name is required');
    }
    
    if (!formData.get('customerName')?.trim()) {
        errors.push('Your name is required');
    }
    
    if (!formData.get('phone')?.trim()) {
        errors.push('Phone number is required');
    }
    
    if (!formData.get('customerEmail')?.trim()) {
        errors.push('Email is required');
    }
    
    const email = formData.get('customerEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    return errors;
}

// Enhanced form submission with validation
window.submitRequestForm = function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    const errors = validateRequestForm(formData);
    if (errors.length > 0) {
        showErrorMessage(errors.join(', '));
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessMessage('Your dish request has been submitted! We\'ll contact you soon.');
        form.reset();
        closeRequestModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
};

function showErrorMessage(message) {
    // Remove existing message
    const existing = document.querySelector('.error-message');
    if (existing) {
        existing.remove();
    }
    
    // Create error message
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message error-message';
    messageEl.style.backgroundColor = '#dc3545';
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // Show message
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 100);
    
    // Hide message after 4 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, 4000);
}

// Modal accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('requestModal');
    
    if (modal) {
        // Trap focus within modal
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
});