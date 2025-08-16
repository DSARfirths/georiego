document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIÓN PARA CARGAR HTML (HEADER Y FOOTER) ---
    const loadHTML = (selector, filePath) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(filePath)
                .then(response => response.ok ? response.text() : Promise.reject('File not found'))
                .then(data => {
                    element.innerHTML = data;
                    // Volvemos a ejecutar funciones que dependen del header/footer cargado
                    initializeMenu(); 
                })
                .catch(error => console.error(`Error loading ${filePath}:`, error));
        }
    };

    // Cargar header y footer desde archivos externos
    loadHTML('header-placeholder', '/header.html');
    loadHTML('footer-placeholder', '/footer.html');

    // --- FUNCIÓN PARA EL MENÚ MÓVIL ---
    // La movemos a una función para que se active DESPUÉS de cargar el header
    const initializeMenu = () => {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    };
    
    // --- FUNCIONALIDAD DEL CARRUSEL DE INICIO ---
    const slides = document.querySelectorAll('.header-carousel .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        slides[0].classList.add('active');
        const slideInterval = setInterval(nextSlide, 5000);

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }

    // --- FUNCIONALIDAD DE VIDEO SHOWCASE (CONTROLES) ---
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const control = card.querySelector('.video-controls i');

        if (video && control) {
            control.addEventListener('click', () => {
                video.muted = !video.muted;
                if (!video.muted) {
                    video.play();
                    control.classList.remove('fa-volume-mute');
                    control.classList.add('fa-volume-up');
                } else {
                    control.classList.remove('fa-volume-up');
                    control.classList.add('fa-volume-mute');
                }
            });
        }
    });

    // --- FUNCIONALIDAD DE LIGHTBOX PARA LA GALERÍA ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                lightboxImg.src = imgSrc;
                lightbox.style.display = 'flex';
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    }

    // --- LÓGICA PARA EL NUEVO CARRUSEL DE VIDEOS ---
    const videoCarousel = document.querySelector('.carousel-container');
    if (videoCarousel) {
        const track = videoCarousel.querySelector('.video-track');
        const slides = Array.from(track.children);
        const nextButton = videoCarousel.querySelector('.next');
        const prevButton = videoCarousel.querySelector('.prev');

        const getSlidesVisible = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        };

        let slidesVisible = getSlidesVisible();
        const slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            const amountToMove = targetIndex * slideWidth;
            track.style.transform = 'translateX(-' + amountToMove + 'px)';
            currentIndex = targetIndex;
            updateNavButtons();
        };

        const updateNavButtons = () => {
            if (!prevButton || !nextButton) return;
            prevButton.style.display = (currentIndex === 0) ? 'none' : 'block';
            const lastPossibleIndex = slides.length - slidesVisible;
            nextButton.style.display = (currentIndex >= lastPossibleIndex) ? 'none' : 'block';
        };

        nextButton.addEventListener('click', () => {
            const lastPossibleIndex = slides.length - slidesVisible;
            if (currentIndex < lastPossibleIndex) {
                moveToSlide(currentIndex + 1);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });
        
        window.addEventListener('resize', () => {
            slidesVisible = getSlidesVisible();
            moveToSlide(0);
        });

        updateNavButtons();
    }
});