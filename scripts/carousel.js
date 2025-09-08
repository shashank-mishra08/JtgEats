// Carousel functionality
let currentSlide = 0;
const visibleItems = 3;
let totalSlides = 0;
let carouselTrack = null;
let carouselItems = [];
let isTransitioning = false;
let autoScrollInterval = null;

function initializeCarousel() {
    carouselTrack = document.getElementById('popularCarousel');
    if (!carouselTrack) return;

    carouselItems = Array.from(carouselTrack.children);
    totalSlides = carouselItems.length;

    if (totalSlides <= visibleItems) {
        // Not enough items to loop, so disable buttons
        document.querySelector('.carousel-prev').style.display = 'none';
        document.querySelector('.carousel-next').style.display = 'none';
        return;
    }

    // Clone items for the infinite loop effect
    const itemsToClone = visibleItems;

    for (let i = 0; i < itemsToClone; i++) {
        const clone = carouselItems[i].cloneNode(true);
        carouselTrack.appendChild(clone);
    }
    for (let i = totalSlides - 1; i >= totalSlides - itemsToClone; i--) {
        const clone = carouselItems[i].cloneNode(true);
        carouselTrack.insertBefore(clone, carouselItems[0]);
    }

    // Update items array with clones
    carouselItems = Array.from(carouselTrack.children);
    totalSlides = carouselItems.length;

    // Set initial position to show the first "real" items
    currentSlide = itemsToClone;
    updateCarouselPosition(false); // No transition for initial setup

    // Add event listener for when transition ends
    carouselTrack.addEventListener('transitionend', handleTransitionEnd);
    
    // Add touch/swipe support for mobile
    addTouchSupport();

    // Start auto-scroll
    startAutoScroll();

    // Pause auto-scroll on hover
    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    carouselTrack.addEventListener('mouseleave', startAutoScroll);
}

function slideCarousel(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentSlide += direction;
    updateCarouselPosition(true);
}

function updateCarouselPosition(transition = true) {
    const itemWidth = 277; // Width of each carousel item
    const gap = 24; // Gap between items
    const slideWidth = itemWidth + gap;
    
    if (transition) {
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    } else {
        carouselTrack.style.transition = 'none';
    }

    const translateX = -(currentSlide * slideWidth);
    carouselTrack.style.transform = `translateX(${translateX}px)`;
}

function handleTransitionEnd() {
    isTransitioning = false;
    const itemsToClone = visibleItems;

    // If we are at the first set of clones (pre-pended)
    if (currentSlide < itemsToClone) {
        currentSlide = carouselItems.length - (2 * itemsToClone) + currentSlide;
        updateCarouselPosition(false);
    }

    // If we are at the last set of clones (appended)
    if (currentSlide >= carouselItems.length - itemsToClone) {
        currentSlide = currentSlide - (carouselItems.length - 2 * itemsToClone);
        updateCarouselPosition(false);
    }
}

function addTouchSupport() {
    if (!carouselTrack) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        if (isTransitioning) return;
        startX = e.touches[0].clientX;
        isDragging = true;
        carouselTrack.style.transition = 'none';
        clearInterval(autoScrollInterval);
    });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        
        const itemWidth = 277;
        const gap = 24;
        const slideWidth = itemWidth + gap;
        const translateX = -(currentSlide * slideWidth) + diffX;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        const diffX = currentX - startX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                slideCarousel(-1); // Swipe right
            } else {
                slideCarousel(1); // Swipe left
            }
        } else {
            updateCarouselPosition(true); // Snap back
        }
        startAutoScroll();
    });
}

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        slideCarousel(1);
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        slideCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        slideCarousel(1);
    }
});

// Initialize carousel when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeCarousel);