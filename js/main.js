document.addEventListener("DOMContentLoaded", function() {

    // --- Reusable Component Loader ---
    // This function fetches HTML content and injects it into a placeholder element.
    const loadComponent = async (element, url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
            const text = await response.text();
            element.innerHTML = text;
            // After loading, run any scripts specific to that component if needed
            element.querySelectorAll("script").forEach(script => eval(script.textContent));
            // Special handling for footer to update the year
            if (url.includes('footer.html')) {
                const yearSpan = document.querySelector('#copyright-year');
                if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            }
            // After loading header, attach hamburger menu logic
            if (url.includes('header.html')) {
                attachHamburgerLogic();
            }
        } catch (error) {
            console.error(`Error loading component from ${url}:`, error);
            element.textContent = `Error loading content.`;
        }
    };

    // Define custom elements to act as placeholders
    class HeaderPlaceholder extends HTMLElement {
        connectedCallback() {
            loadComponent(this, '/header.html');
        }
    }

    class FooterPlaceholder extends HTMLElement {
        connectedCallback() {
            loadComponent(this, '/footer.html');
        }
    }

    // Register the custom elements if they haven't been registered yet
    if (!customElements.get('header-placeholder')) {
        customElements.define('header-placeholder', HeaderPlaceholder);
    }
    if (!customElements.get('footer-placeholder')) {
        customElements.define('footer-placeholder', FooterPlaceholder);
    }

    // --- Page-Specific Logic ---

    // Hamburger Menu (logic is attached after header loads)
    function attachHamburgerLogic() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }

    // Header Carousel on index.html
    const headerCarousel = document.querySelector('.header-carousel');
    if (headerCarousel) {
        const slides = headerCarousel.querySelectorAll('.slide');
        if (slides.length > 1) {
            let currentSlide = 0;
            slides[currentSlide].classList.add('active');
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    }

    // Video Showcase Carousel on index.html
    const videoContainer = document.querySelector('.carousel-videos');
    if (videoContainer) {
        const videos = videoContainer.querySelectorAll('.video-card');
        videos.forEach(card => {
            const video = card.querySelector('video');
            const controls = card.querySelector('.video-controls i');

            card.addEventListener('mouseenter', () => video.play().catch(e => console.error("Video play failed", e)));
            card.addEventListener('mouseleave', () => video.pause());

            if (controls) {
                controls.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card mouse events from firing
                    e.preventDefault();
                    video.muted = !video.muted;
                    controls.classList.toggle('fa-volume-mute', video.muted);
                    controls.classList.toggle('fa-volume-up', !video.muted);
                });
            }
        });
        // Note: The next/prev button logic for the video carousel is not implemented here
        // as it requires more complex state management. This script enables hover-to-play.
    }
});