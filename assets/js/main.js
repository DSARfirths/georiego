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
            // Si acabamos de cargar el header o el menú, activamos su funcionalidad.
            // Esto asegura que los botones existan antes de añadirles eventos.
            if (selector === '#header-placeholder') {
                setupMobileMenu(); // Llama a la configuración del menú aquí.
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
    // Los siguientes elementos están en 'mobile-menu.html', por eso es crucial cargarlo.
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeButton = document.getElementById('mobile-menu-close-btn');
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

    if (closeButton) {
        closeButton.addEventListener('click', () => toggleMenu(false));
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
    }, {
        threshold: 0.1
    });

    elementsToAnimate.forEach(element => observer.observe(element));
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
    }, {
        threshold: 0.1
    });

    containersToStagger.forEach(container => {
        Array.from(container.children).forEach(child => {
            child.classList.add('stagger-item');
        });
        observer.observe(container);
    });
};

/**
 * Configura los filtros interactivos de la página de soluciones.
 */
const setupServiceFilters = () => {
    const filterContainer = document.querySelector('.filters');
    if (!filterContainer) return;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    const activateFilter = (filter) => {
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        serviceCards.forEach(card => {
            card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => activateFilter(button.dataset.filter));
    });

    const currentHash = window.location.hash.substring(1);
    if (currentHash === 'agro' || currentHash === 'infraestructura') {
        activateFilter(currentHash);
    } else {
        activateFilter('all');
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
        const phoneNumber = '51993813122'; // Tu número de WhatsApp
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
        // Asumo que tienes la librería basicLightbox, si no, este paso fallará.
        if (window.basicLightbox) {
            basicLightbox.create(lightboxContent).show();
        }
    });
};

/**
 * Configura el modal de contacto.
 */
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
 * ===================================================================
 * INICIALIZACIÓN GLOBAL
 * ===================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Carga los componentes de la página.
    loadComponent('#header-placeholder', 'partials/header.html');
    loadComponent('#mobile-menu-placeholder', 'partials/mobile-menu.html'); // <-- LÍNEA CORREGIDA
    loadComponent('#footer-placeholder', 'partials/footer.html');

    // 2. Inicializa todas las demás funcionalidades.
    // La configuración del menú y del modal se llama dentro de loadComponent para evitar errores.
    setupStaggeredAnimations();
    setupScrollAnimations();
    setupServiceFilters();
    setupLightbox();

    // 3. Si estamos en la página de catálogo, inicializa su lógica específica.
    if (document.getElementById('product-catalog')) {
        initCatalogPage();
    }
    
    setupContactForm(); 
});


/**
 * ===================================================================
 * LÓGICA DE LA PÁGINA DE CATÁLOGO DE PRODUCTOS
 * ===================================================================
 */

// NOTA: Asumo que tienes un archivo `products-data.js` o similar donde está definido `georiegoProducts`.
// Si no, el código de abajo no funcionará.

function initCatalogPage() {
    if (typeof georiegoProducts === 'undefined') {
        console.error("La lista de productos (georiegoProducts) no está definida.");
        return;
    }
    renderCategories(georiegoProducts);
    const categoryFromURL = window.location.hash.substring(1);
    if (categoryFromURL) {
        const filteredProducts = georiegoProducts.filter(p => p.categoria === categoryFromURL);
        renderProducts(filteredProducts);
        const filtersContainer = document.getElementById('category-filters');
        const activeButton = filtersContainer.querySelector(`[data-category="${categoryFromURL}"]`);
        filtersContainer.querySelector('.active')?.classList.remove('active');
        if (activeButton) {
            activeButton.classList.add('active');
        }
    } else {
        renderProducts(georiegoProducts);
    }
    setupCategoryFilters();
    setupProductSearch(); // Renombré la función para mayor claridad
}

function renderProducts(productsToRender) {
    const catalogContainer = document.getElementById('product-catalog');
    if (productsToRender.length === 0) {
        catalogContainer.innerHTML = '<p class="catalog-no-results">No se encontraron productos que coincidan con su búsqueda.</p>';
        return;
    }
    const productsHTML = productsToRender.map(createProductCardHTML).join('');
    catalogContainer.innerHTML = productsHTML;
}

function createProductCardHTML(product) {
    const message = encodeURIComponent(`Hola Georiego, estoy interesado/a en el producto "${product.nombre}". ¿Podrían darme más información?`);
    const whatsappURL = `https://wa.me/51993813122?text=${message}`;
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

function setupCategoryFilters() {
    const filtersContainer = document.getElementById('category-filters');
    filtersContainer.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON') return;
        filtersContainer.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');
        const selectedCategory = event.target.dataset.category;
        const filteredProducts = selectedCategory === 'all' ?
            georiegoProducts :
            georiegoProducts.filter(p => p.categoria === selectedCategory);
        renderProducts(filteredProducts);
    });
}

function setupProductSearch() {
    const openBtn = document.getElementById('open-search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeBtn = document.getElementById('search-close-btn');
    const overlay = document.getElementById('search-modal-overlay');
    const modalInput = document.getElementById('search-input');
    const staticInput = document.getElementById('static-search-input');

    const toggleSearchModal = (show) => {
        if (searchModal) searchModal.classList.toggle('is-visible', show);
    };

    if (openBtn) openBtn.addEventListener('click', () => toggleSearchModal(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleSearchModal(false));
    if (overlay) overlay.addEventListener('click', () => toggleSearchModal(false));

    const handleSearch = (searchTerm) => {
        const lowerCaseTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = georiegoProducts.filter(product =>
            product.nombre.toLowerCase().includes(lowerCaseTerm) ||
            product.descripcion.toLowerCase().includes(lowerCaseTerm)
        );
        renderProducts(filteredProducts);
        const activeFilter = document.querySelector('#category-filters .active');
        if (activeFilter) activeFilter.classList.remove('active');
        const allButton = document.querySelector('#category-filters .filter-btn[data-category="all"]');
        if (allButton && searchTerm !== '') allButton.classList.add('active');
    };

    if (modalInput) {
        modalInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            if (staticInput) staticInput.value = searchTerm;
            handleSearch(searchTerm);
        });
    }

    if (staticInput) {
        staticInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            if (modalInput) modalInput.value = searchTerm;
            handleSearch(searchTerm);
        });
    }
}

/**
 * Configura el formulario de contacto para enviarlo con AJAX sin recargar la página.
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const closeConfirmationBtn = document.getElementById('close-confirmation-btn');
    const whatsappNotifyBtn = document.getElementById('whatsapp-notify-btn');

    if (!form) return; // No hacer nada si el formulario no está en la página actual

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // <-- Esto evita la redirección a Formspree

        const formData = new FormData(form);
        const formAction = form.action;

        fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // 1. Mostrar el mensaje de confirmación
                confirmationMessage.classList.add('is-visible');

                // 2. Preparar el botón de WhatsApp
                const nombre = formData.get('name') || 'un cliente';
                const message = encodeURIComponent(`¡Hola Georiego! Soy ${nombre} y les acabo de enviar una cotización formal desde la web.`);
                whatsappNotifyBtn.href = `https://wa.me/51993813122?text=${message}`; // <-- Usa tu número de WhatsApp aquí

                // 3. Limpiar el formulario
                form.reset();
            } else {
                alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
            }
        }).catch(error => {
            alert('Hubo un error de red. Por favor, revisa tu conexión e inténtalo de nuevo.');
        });
    });

    // Lógica para cerrar el mensaje de confirmación
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', () => {
            confirmationMessage.classList.remove('is-visible');
        });
    }
}