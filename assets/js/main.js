/**
 * Carga un componente HTML desde una ruta y lo inyecta en un selector.
 * @param {string} selector - El selector CSS del elemento contenedor (ej. '#header-placeholder').
 * @param {string} filePath - La ruta al archivo HTML del componente (ej. 'partials/header.html').
 */
const loadComponent = (selector, filePath) => {
  const element = document.querySelector(selector);
  if (!element) return;

  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
      return response.text();
    })
    .then(data => {
      element.innerHTML = data;
      // Si acabamos de cargar el header, activamos su funcionalidad.
      if (selector === '#header-placeholder') {
        setupMobileMenu();
      }
    })
    .catch(error => console.error(`Error en loadComponent:`, error));
};

/**
 * Configura la funcionalidad del menú hamburguesa.
 */
const setupMobileMenu = () => {
  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const openIcon = document.getElementById('menu-open-icon');
  const closeIcon = document.getElementById('menu-close-icon');

  if (hamburgerButton && mobileMenu && openIcon && closeIcon) {
    hamburgerButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
      const isOpen = mobileMenu.classList.contains('is-open');
      openIcon.style.display = isOpen ? 'none' : 'block';
      closeIcon.style.display = isOpen ? 'block' : 'none';
    });
  }
};

/**
 * Configura las animaciones que se activan al hacer scroll.
 */
const setupScrollAnimations = () => {
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  if (elementsToAnimate.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elementsToAnimate.forEach(element => observer.observe(element));
};

/**
 * Configura los filtros interactivos de la página de soluciones.
 */
const setupServiceFilters = () => {
  const filterContainer = document.querySelector('.filters');
  if (!filterContainer) return;

  const filterButtons = filterContainer.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  // Función para activar un filtro
  const activateFilter = (filter) => {
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    serviceCards.forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
    });
  };

  // Añadimos el evento de clic a cada botón
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      activateFilter(filter);
    });
  });

  // ===== LÓGICA NUEVA: Revisar la URL al cargar la página =====
  const currentHash = window.location.hash.substring(1); // Obtiene 'agro' o 'infraestructura'
  if (currentHash === 'agro' || currentHash === 'infraestructura') {
    activateFilter(currentHash);
  } else {
    activateFilter('all'); // Si no hay nada, muestra todo
  }
};

/**
 * Configura la galería de imágenes con lightbox.
 */
const setupLightbox = () => {
    const gallery = document.querySelector('#service-gallery');
    if (!gallery) return;
  
    gallery.addEventListener('click', function(event) {
      const galleryLink = event.target.closest('.gallery-card');
      if (!galleryLink) return;
      
      event.preventDefault();
      const imageUrl = galleryLink.href;
      const projectTitle = galleryLink.dataset.title || 'este proyecto';
      const phoneNumber = '51999888777'; // Reemplaza con tu número
      const message = encodeURIComponent(`Hola Georiego, vi el proyecto "${projectTitle}" en su web y estoy interesado/a en una cotización.`);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      const lightboxContent = `
        <div class="lightbox-container">
          <img src="${imageUrl}" alt="${projectTitle}">
          <div class="lightbox-caption">
            <a href="${whatsappUrl}" target="_blank" class="whatsapp-cta-button">
              <svg class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.8-27.2l-6.9-4.1-72.7 19.1L45 351.5l-4.5-7.3c-18.9-30.7-28.8-66.1-28.8-102.7 0-110.2 89.9-199.9 200.1-199.9 54.1 0 104.4 21.1 141.4 58.1s58.1 87.3 58.1 141.4-21.1 104.4-58.1 141.4c-37 37-87.3 58.1-141.5 58.1zM325.3 303c-.6-1.3-2.2-2.1-4.7-3.5-2.5-1.4-14.8-7.3-17.1-8.1-2.3-.8-3.9-1.3-5.5 1.3s-6.5 8.1-7.9 9.7c-1.4 1.6-2.8 1.8-5.3 1.2-2.5-.6-10.5-3.9-19.9-12.3-7.4-6.6-12.3-14.8-13.8-17.3s-.1-3.9 1.2-5.2c1.2-1.2 2.5-3.1 3.7-4.5s1.6-2.5 2.5-4.1c.8-1.6 1.2-2.8 1.8-4.7s.1-3.5-.6-5.2c-.6-1.6-5.5-13.2-7.6-18s-4.1-4-5.5-4.1c-1.4-.1-3 .1-4.7 .1s-4.1 1.8-6.1 3.9c-2 2.1-7.6 7.5-7.6 18s7.8 20.9 8.8 22.5c1.1 1.6 15.3 23.4 37.5 33 5.3 2.3 9.4 3.6 12.6 4.6 3.1 1 5.8 1.5 8.2 1.3 2.8-.2 8.9-3.6 10.1-7.1.6-1.8 1.2-3.5 1.2-7.1.1-1.3 0-2.8-.6-3.9z"/></svg>
              <span>Cotizar Proyecto Similar</span>
            </a>
          </div>
        </div>`;
      basicLightbox.create(lightboxContent).show();
    });
  };

const setupContactModal = () => {
    const contactModal = document.getElementById('contact-modal');
    if (!contactModal) return;

    const openModalButtons = document.querySelectorAll('.header-cta, .cta-button, .cta-box .cta-button, .mobile-cta');
    const closeModalButton = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    const openModal = () => contactModal.classList.add('is-visible');
    const closeModal = () => contactModal.classList.remove('is-visible');

    openModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Prevenimos la navegación si el href es solo '#'
            if (button.getAttribute('href') === '#') {
                event.preventDefault();
                openModal();
            }
        });
    });

    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
};


/**
 * El bloque ÚNICO que se ejecuta cuando la página está lista.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Usamos las rutas relativas que funcionan en tu entorno de GitHub Pages
  loadComponent('#header-placeholder', 'partials/header.html');
  loadComponent('#footer-placeholder', 'partials/footer.html');
  
  // Llamamos a todas las demás funciones de inicialización
  setupScrollAnimations();
  setupServiceFilters();
  setupLightbox();
  setupContactModal();
});