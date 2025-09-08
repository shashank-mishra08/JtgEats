
// Video functionality
let video = null;
let playBtn = null;
let pauseBtn = null;
let isPlaying = false;

function initializeVideo() {
    video = document.getElementById('cookingVideo');
    playBtn = document.querySelector('.play-btn');
    pauseBtn = document.querySelector('.pause-btn');
    
    if (!video || !playBtn || !pauseBtn) return;

    // Reset video state on load
    video.pause();
    video.currentTime = 0;

    // Disable default controls
    video.controls = false;
    
    // Video event listeners
    video.addEventListener('play', function() {
        isPlaying = true;
        updatePlayButton();
    });
    
    video.addEventListener('pause', function() {
        isPlaying = false;
        updatePlayButton();
    });
    
    video.addEventListener('ended', function() {
        isPlaying = false;
        updatePlayButton();
        video.currentTime = 0;
    });
    
    // Click on video to toggle play/pause
    video.addEventListener('click', function() {
        toggleVideo();
    });
    
    // Keyboard controls
    video.addEventListener('keydown', function(e) {
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                toggleVideo();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                break;
            case 'm':
                e.preventDefault();
                video.muted = !video.muted;
                break;
            case 'f':
                e.preventDefault();
                toggleFullscreen();
                break;
        }
    });
    
    // Make video focusable for keyboard controls
    video.setAttribute('tabindex', '0');
}

// Toggle video play/pause
window.toggleVideo = function() {
    if (!video) return;
    
    try {
        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch((error) => {
                console.error('Error playing video:', error);
                showErrorMessage('Unable to play video. Please try again.');
            });
        }
    } catch (error) {
        console.error('Video toggle error:', error);
        showErrorMessage('Video playback error. Please refresh the page.');
    }
};

function updatePlayButton() {
    if (!playBtn || !pauseBtn) return;
    
    if (isPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    } else {
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    }
}

function toggleFullscreen() {
    if (!video) return;
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        video.requestFullscreen().catch((error) => {
            console.error('Error entering fullscreen:', error);
        });
    }
}

// Initialize video when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeVideo);
