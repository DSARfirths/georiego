// assets/js/main.js

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
      if (selector === '#header-placeholder') {
        console.log('Header cargado, iniciando setup del menú...');
        setupMobileMenu();
      }
    })
    .catch(error => console.error(`Error en loadComponent:`, error));
};

const setupMobileMenu = () => {
  console.log('Buscando elementos del menú...');
  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const openIcon = document.getElementById('menu-open-icon');
  const closeIcon = document.getElementById('menu-close-icon');

  // --> NUESTRO PRIMER DETECTIVE: ¿Encontramos los elementos?
  console.log('Botón del menú encontrado:', hamburgerButton);
  console.log('Panel del menú encontrado:', mobileMenu);

  if (hamburgerButton && mobileMenu) {
    console.log('Elementos encontrados, añadiendo el listener de clic.');
    hamburgerButton.addEventListener('click', () => {
      // --> NUESTRO SEGUNDO DETECTIVE: ¿Funciona el clic?
      console.log('¡Botón clickeado!');
      
      mobileMenu.classList.toggle('hidden');
      openIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });
  } else {
    console.error('No se pudieron encontrar los elementos del menú. Revisa los IDs en header.html.');
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM cargado. Iniciando carga de componentes.');
  loadComponent('#header-placeholder', '/partials/header.html');
  loadComponent('#footer-placeholder', '/partials/footer.html');
});

// AÑADIMOS UNA NUEVA FUNCIÓN PARA LAS ANIMACIONES AL HACER SCROLL
const setupScrollAnimations = () => {
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Para que la animación ocurra solo una vez
      }
    });
  }, {
    threshold: 0.1 // La animación se activa cuando el 10% del elemento es visible
  });

  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
};

// Y LLAMAR A LA FUNCIÓN DENTRO DEL EVENTO DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadComponent('#header-placeholder', '/partials/header.html');
  loadComponent('#footer-placeholder', '/partials/footer.html');
  setupScrollAnimations(); // <-- AÑADIR ESTA LÍNEA
});

// AÑADIR ESTA FUNCIÓN A main.js

const setupServiceFilters = () => {
  const filterContainer = document.querySelector('.filters');
  if (!filterContainer) return; // Si no hay filtros en la página, no hace nada

  const filterButtons = filterContainer.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Manejar el estilo del botón activo
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      // Mostrar/ocultar tarjetas de servicio
      serviceCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
};


// Y LLAMAR A LA FUNCIÓN DENTRO DEL EVENTO DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadComponent('#header-placeholder', '/partials/header.html');
  loadComponent('#footer-placeholder', '/partials/footer.html');
  setupScrollAnimations();
  setupServiceFilters(); // <-- AÑADIR ESTA LÍNEA
});

// AÑADIR ESTA FUNCIÓN A main.js

const setupLightbox = () => {
  const gallery = document.querySelector('#service-gallery');
  if (!gallery) return;

  gallery.addEventListener('click', function(event) {
    const galleryLink = event.target.closest('.gallery-card');
    
    if (galleryLink) {
      event.preventDefault();
      
      const imageUrl = galleryLink.href;
      const projectTitle = galleryLink.dataset.title || 'este proyecto';
      const phoneNumber = '51999888777'; // <-- Reemplaza con tu número de WhatsApp

      const message = encodeURIComponent(`Hola Georiego, vi el proyecto "${projectTitle}" en su web y estoy interesado/a en una cotización.`);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

      // Contenido del lightbox con el nuevo SVG
      const lightboxContent = `
        <div class="lightbox-container">
          <img src="${imageUrl}" alt="${projectTitle}">
          <div class="lightbox-caption">
            <a href="${whatsappUrl}" target="_blank" class="whatsapp-cta-button">
              <svg class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.8-27.2l-6.9-4.1-72.7 19.1L45 351.5l-4.5-7.3c-18.9-30.7-28.8-66.1-28.8-102.7 0-110.2 89.9-199.9 200.1-199.9 54.1 0 104.4 21.1 141.4 58.1s58.1 87.3 58.1 141.4-21.1 104.4-58.1 141.4c-37 37-87.3 58.1-141.5 58.1zM325.3 303c-.6-1.3-2.2-2.1-4.7-3.5-2.5-1.4-14.8-7.3-17.1-8.1-2.3-.8-3.9-1.3-5.5 1.3s-6.5 8.1-7.9 9.7c-1.4 1.6-2.8 1.8-5.3 1.2-2.5-.6-10.5-3.9-19.9-12.3-7.4-6.6-12.3-14.8-13.8-17.3s-.1-3.9 1.2-5.2c1.2-1.2 2.5-3.1 3.7-4.5s1.6-2.5 2.5-4.1c.8-1.6 1.2-2.8 1.8-4.7s.1-3.5-.6-5.2c-.6-1.6-5.5-13.2-7.6-18s-4.1-4-5.5-4.1c-1.4-.1-3 .1-4.7 .1s-4.1 1.8-6.1 3.9c-2 2.1-7.6 7.5-7.6 18s7.8 20.9 8.8 22.5c1.1 1.6 15.3 23.4 37.5 33 5.3 2.3 9.4 3.6 12.6 4.6 3.1 1 5.8 1.5 8.2 1.3 2.8-.2 8.9-3.6 10.1-7.1.6-1.8 1.2-3.5 1.2-7.1.1-1.3 0-2.8-.6-3.9z"/></svg>
              <span>Cotizar Proyecto Similar</span>
            </a>
          </div>
        </div>
      `;
      
      basicLightbox.create(lightboxContent).show();
    }
  });
};


// Y LLAMAR A LA FUNCIÓN DENTRO DEL EVENTO DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadComponent('#header-placeholder', '/partials/header.html');
  loadComponent('#footer-placeholder', '/partials/footer.html');
  setupScrollAnimations();
  setupServiceFilters();
  setupLightbox(); // <-- AÑADIR ESTA LÍNEA
});