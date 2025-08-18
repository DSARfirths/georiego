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
        setupContactModal();
      }
    })
    .catch(error => console.error(`Error en loadComponent:`, error));
};

/**
 * Configura la funcionalidad del menú lateral (Off-Canvas).
 */
const setupMobileMenu = () => {
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeButton = document.getElementById('mobile-menu-close-btn'); // <-- AÑADIDO
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');

    const toggleMenu = (isOpen) => {
        document.body.classList.toggle('mobile-menu-is-open', isOpen);
        if (openIcon && closeIcon) {
            openIcon.style.display = isOpen ? 'none' : 'block';
            closeIcon.style.display = isOpen ? 'block' : 'none';
        }
    };

    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', () => {
            const isMenuOpen = document.body.classList.contains('mobile-menu-is-open');
            toggleMenu(!isMenuOpen);
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => toggleMenu(false));
    }

    if (closeButton) { // <-- AÑADIDO
        closeButton.addEventListener('click', () => toggleMenu(false));
    }
};

/**
 * El bloque ÚNICO que se ejecuta cuando la página está lista.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Usamos las rutas relativas
    loadComponent('#header-placeholder', 'partials/header.html');
    loadComponent('#mobile-menu-placeholder', 'partials/mobile-menu.html'); // <-- AÑADE ESTA LÍNEA
    loadComponent('#footer-placeholder', 'partials/footer.html');
    
    // Llamamos a todas las demás funciones de inicialización
    setupScrollAnimations();
    setupServiceFilters();
    setupLightbox();
    // La llamada a setupContactModal y setupMobileMenu se hace dentro de loadComponent
});

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
 * Configura animaciones escalonadas para elementos dentro de un contenedor.
 */
const setupStaggeredAnimations = () => {
    const containersToStagger = document.querySelectorAll('.divisions-grid, .why-us-grid, .products-grid, .solutions-grid, .team-grid, .gallery-grid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elements = entry.target.children;
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.transitionDelay = `${i * 100}ms`; // 100ms de retraso entre cada item
                    elements[i].classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    containersToStagger.forEach(container => {
        // Ocultamos los hijos inicialmente
        Array.from(container.children).forEach(child => {
            child.classList.add('stagger-item');
        });
        observer.observe(container);
    });
};

/**
 * El bloque ÚNICO que se ejecuta cuando la página está lista.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Usamos las rutas relativas que funcionan en tu entorno de GitHub Pages
  loadComponent('#header-placeholder', 'partials/header.html');
  loadComponent('#footer-placeholder', 'partials/footer.html');
  
  // Llamamos a todas las demás funciones de inicialización
  setupStaggeredAnimations();
  setupScrollAnimations();
  setupServiceFilters();
  setupLightbox();
  setupContactModal();
});

/**
 * ===================================================================
 * LÓGICA DE LA PÁGINA DE PRODUCTOS
 * ===================================================================
 */

// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecuta el código del catálogo si estamos en la página de productos
    if (document.getElementById('product-catalog')) {
        initCatalogPage();
    }
});

// Función principal para inicializar la página del catálogo
function initCatalogPage() {
    // 1. Dibuja los botones de categoría primero, siempre.
    renderCategories(georiegoProducts);

    // 2. Revisa si hay una categoría en la URL (ej. #tuberias)
    const categoryFromURL = window.location.hash.substring(1);

    if (categoryFromURL) {
        // 3a. Si existe, filtra los productos según esa categoría.
        const filteredProducts = georiegoProducts.filter(p => p.categoria === categoryFromURL);
        renderProducts(filteredProducts);

        // 3b. Actualiza el botón de filtro para que se vea activo.
        const filtersContainer = document.getElementById('category-filters');
        const activeButton = filtersContainer.querySelector(`[data-category="${categoryFromURL}"]`);
        
        // Quita la clase 'active' del botón por defecto ("Ver Todo")
        filtersContainer.querySelector('.active')?.classList.remove('active');
        // Añade la clase 'active' al botón correcto si lo encuentra
        if (activeButton) {
            activeButton.classList.add('active');
        }

    } else {
        // 4. Si no hay categoría en la URL, muestra todos los productos.
        renderProducts(georiegoProducts);
    }

    // 5. Finalmente, configura los filtros y el buscador para futuros clics.
    setupCategoryFilters();
    setupFloatingSearch();
}

/**
 * Dibuja las tarjetas de producto en el DOM.
 * @param {Array} productsToRender - El array de productos a mostrar.
 */
function renderProducts(productsToRender) {
    const catalogContainer = document.getElementById('product-catalog');
    
    if (productsToRender.length === 0) {
        catalogContainer.innerHTML = '<p class="catalog-no-results">No se encontraron productos que coincidan con su búsqueda.</p>';
        return;
    }

    const productsHTML = productsToRender.map(product => createProductCardHTML(product)).join('');
    catalogContainer.innerHTML = productsHTML;
}

/**
 * Crea el string HTML para una sola tarjeta de producto.
 * @param {Object} product - El objeto del producto.
 * @returns {string} El HTML de la tarjeta.
 */
function createProductCardHTML(product) {
    const message = encodeURIComponent(`Hola Georiego, estoy interesado/a en el producto "${product.nombre}". ¿Podrían darme más información?`);
    const whatsappURL = `https://wa.me/51993813122?text=${message}`; // Usa tu número de WhatsApp aquí

    return `
        <div class="product-card-catalog" data-category="${product.categoria}">
            <div class="product-card-image">
                <img src="${product.imagen}" alt="${product.nombre}">
            </div>
            <div class="product-card-content">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <a href="${whatsappURL}" target="_blank" class="product-cta-button">
                    <i class="fa-brands fa-whatsapp"></i>
                    <span>Consultar Precio</span>
                </a>
            </div>
        </div>
    `;
}

/**
 * Genera y muestra los botones de filtro de categoría.
 * @param {Array} allProducts - El array completo de todos los productos.
 */
function renderCategories(allProducts) {
    const filtersContainer = document.getElementById('category-filters');
    const categories = ['all', ...new Set(allProducts.map(p => p.categoria))];

    const categoriesHTML = categories.map(category => {
        const isActive = category === 'all' ? 'active' : '';
        const categoryName = category === 'all' ? 'Ver Todo' : category.charAt(0).toUpperCase() + category.slice(1);
        return `<button class="filter-btn ${isActive}" data-category="${category}">${categoryName}</button>`;
    }).join('');

    filtersContainer.innerHTML = categoriesHTML;
}

/**
 * Configura los event listeners para los botones de filtro.
 */
function setupCategoryFilters() {
    const filtersContainer = document.getElementById('category-filters');

    filtersContainer.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON') return;

        // Manejar clase activa
        filtersContainer.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');
        
        // Filtrar y renderizar
        const selectedCategory = event.target.dataset.category;
        const filteredProducts = selectedCategory === 'all' 
            ? georiegoProducts 
            : georiegoProducts.filter(p => p.categoria === selectedCategory);
        
        renderProducts(filteredProducts);
    });
}

/**
 * Configura la funcionalidad de AMBOS buscadores (flotante y estático).
 */
function setupFloatingSearch() {
    // Selectores para todos los elementos de búsqueda
    const openBtn = document.getElementById('open-search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeBtn = document.getElementById('search-close-btn');
    const overlay = document.getElementById('search-modal-overlay');
    const modalInput = document.getElementById('search-input');
    const staticInput = document.getElementById('static-search-input');

    // Función para abrir/cerrar el modal
    const toggleSearchModal = (show) => {
        searchModal.classList.toggle('is-visible', show);
    };

    // Eventos para el modal
    openBtn.addEventListener('click', () => toggleSearchModal(true));
    closeBtn.addEventListener('click', () => toggleSearchModal(false));
    overlay.addEventListener('click', () => toggleSearchModal(false));

    // Función reutilizable para manejar la búsqueda
    const handleSearch = (searchTerm) => {
        const lowerCaseTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = georiegoProducts.filter(product =>
            product.nombre.toLowerCase().includes(lowerCaseTerm) ||
            product.descripcion.toLowerCase().includes(lowerCaseTerm)
        );
        renderProducts(filteredProducts);

        // Desactiva los filtros de categoría cuando se busca
        const activeFilter = document.querySelector('#category-filters .active');
        if (activeFilter) activeFilter.classList.remove('active');
        // Coloca un "placeholder" o estado neutro si existe un botón "Ver Todo"
        const allButton = document.querySelector('#category-filters .filter-btn[data-category="all"]');
        if(allButton && searchTerm !== '') allButton.classList.add('active');
    };

    // Sincronizar y buscar desde el input del MODAL
    modalInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        staticInput.value = searchTerm; // Sincroniza
        handleSearch(searchTerm);
    });

    // Sincronizar y buscar desde el input ESTÁTICO
    staticInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        modalInput.value = searchTerm; // Sincroniza
        handleSearch(searchTerm);
    });
}