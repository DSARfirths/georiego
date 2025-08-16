document.addEventListener('DOMContentLoaded', () => {
    // --- INYECCIÓN DE ELEMENTOS GLOBALES ---
    const headerPlaceholder = document.querySelector('header-placeholder');
    const footerPlaceholder = document.querySelector('footer-placeholder');

    const headerHTML = `
        <header class="main-header">
            <div class="container">
                <a href="/index.html" class="logo">Georiego</a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="/index.html">Inicio</a></li>
                        <li><a href="/nosotros.html">Nosotros</a></li>
                        <li><a href="/productos.html">Productos</a></li>
                        <li class="dropdown">
                            <a href="#">Servicios <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-content">
                                <li><a href="/servicios/construccion-de-reservorios.html">Construcción de reservorios</a></li>
                                <li><a href="/servicios/instalacion-de-geosinteticos.html">Instalación de Geosintéticos</a></li>
                                <li><a href="/servicios/fabricacion-de-geotanques.html">Fabricación de Geotanques</a></li>
                                <li><a href="/servicios/instalacion-riego-tecnificado.html">Instalación de Riego Tecnificado</a></li>
                                <li><a href="/servicios/diseno-riego-tecnificado.html">Diseño de Riego Tecnificado</a></li>
                            </ul>
                        </li>
                        <li><a href="/proyectos.html">Proyectos</a></li>
                        <li><a href="/index.html#contacto">Contacto</a></li>
                    </ul>
                </nav>
                <div class="hamburger-menu">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </header>
    `;

    // --- FOOTER CON MAPA CORREGIDO Y BOTÓN NUEVO ---
    const footerHTML = `
        <footer class="main-footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-column">
                        <h4>Georiego</h4>
                        <p>Soluciones integrales que optimizan recursos hídricos para el sector agrícola e industrial en todo el Perú.</p>
                        <div class="social-media-links" style="margin-top: 1rem;">
                            <a href="https://facebook.com/georiego" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>
                            <a href="https://tiktok.com/@georiego" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                            <a href="https://api.whatsapp.com/send?phone=51993813122&text=Hola, me gustaría solicitar una cotización." target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>Contacto</h4>
                        <p><i class="fas fa-map-marker-alt"></i> <strong>Dirección:</strong></p>
                        <p>Country 618, Piura 20001, Perú</p>
                        <p style="margin-top:10px;"><i class="fas fa-phone"></i> <strong>Cel:</strong> <a href="tel:+51993813122">993 813 122</a> / <a href="tel:+51966211673">966 211 673</a></p>
                        <p style="margin-top:10px;"><i class="fas fa-envelope"></i> <strong>Email:</strong></p>
                        <p><a href="mailto:ventas@georiego.com">ventas@georiego.com</a></p>
                    </div>
                    <div class="footer-column footer-map">
                        <h4>Ubicación</h4>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.749021203027!2d-80.63441342595919!3d-5.186982652431481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904a1158567584cd%3A0x705c754d9c12b93a!2sCountry%20618%2C%20Piura%2020001%2C%20Per%C3%BA!5e0!3m2!1ses!2spe!4v1723149635957!5m2!1ses!2spe" 
                            width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=-5.186987660884971,-80.6322384997946" class="btn-map" target="_blank">
                            <i class="fas fa-directions"></i> ¿Cómo llegar?
                        </a>
                    </div>
                </div>
                <div class="copyright">
                    <p>© ${new Date().getFullYear()} Georiego. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    `;

    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

    // --- FUNCIONALIDAD DEL MENÚ MÓVIL ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- FUNCIONALIDAD DEL CARRUSEL ---
    const slides = document.querySelectorAll('.header-carousel .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        slides[0].classList.add('active'); // Asegura que el primer slide sea visible
        const slideInterval = setInterval(nextSlide, 5000);

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }

    // --- FUNCIONALIDAD DE VIDEO SHOWCASE ---
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const control = card.querySelector('.video-controls i');

        if(video && control) {
            control.addEventListener('click', () => {
                video.muted = !video.muted;
                if (!video.muted) {
                    video.play(); // Asegura la reproducción en móviles al interactuar
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
            lightboxClose.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
});