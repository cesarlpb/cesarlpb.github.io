// Importar los módulos
import { bio } from './bio.js';
import { experiencia } from './experiencia.js';
import { proyectos } from './proyectos.js';
import { translations } from './translations.js';

// Función para obtener el idioma de la URL o del navegador
function getLanguageFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  // Si hay un parámetro de idioma en la URL, usarlo
  if (langParam === 'es') {
    return 'es';
  } else if (langParam === 'en') {
    return 'en';
  }
  
  // Si no hay parámetro de idioma, usar el del navegador
  const userLang = navigator.language || navigator.userLanguage;
  return userLang.startsWith('es') ? 'es' : 'en';
}

// Función para detectar el idioma (por compatibilidad)
function detectLanguage() {
  return getLanguageFromUrl();
}

// Función para cargar la biografía
function loadBio() {
  const lang = localStorage.getItem('preferredLanguage') || detectLanguage();
  const bioElement = document.getElementById('bio');
  if (bioElement) {
    bioElement.innerHTML = bio[lang];
    // After setting the HTML, we need to re-run the translation for the dynamic content
    updateUITexts(lang);
  }
}

// Función para cargar la experiencia
function loadExperiencia() {
  const lang = localStorage.getItem('preferredLanguage') || detectLanguage();
  const experienciaContainer = document.getElementById('experiencia');
  
  if (!experienciaContainer) return;
  
  let html = '';

  if (experiencia && experiencia[lang]) {
    experiencia[lang].forEach(exp => {
      html += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${exp.cargo} - ${exp.empresa}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${exp.periodo}</h6>
            <div class="card-text">${exp.descripcion}</div>
            <div class="mt-2">
              ${exp.tags ? exp.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('') : ''}
            </div>
          </div>
        </div>
      `;
    });
  } else {
    html = '<p>No se pudo cargar la experiencia.</p>';
  }

  experienciaContainer.innerHTML = html;
}

// Función para cargar los proyectos
function loadProyectos() {
  const lang = localStorage.getItem('preferredLanguage') || detectLanguage();
  const proyectosContainer = document.getElementById('proyectos');
  
  if (!proyectosContainer) return;
  
  let html = '<div class="row">';

  if (proyectos && proyectos[lang]) {
    proyectos[lang].forEach(proyecto => {
      if (!proyecto) return;
      
      const title = proyecto.titulo || 'Proyecto sin título';
      const description = proyecto.descripcion || '';
      const url = proyecto.url || '#';
      const tags = proyecto.tags || [];
      
      const viewProjectText = translations[lang]?.view_project || 'View project';
      
      html += `
        <div class="col-12 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${description}</p>
              ${url !== '#' ? `<a href="${url}" target="_blank" class="btn btn-sm btn-outline-primary">${viewProjectText}</a>` : ''}
            </div>
            ${tags.length > 0 ? `
            <div class="card-footer bg-transparent">
              ${tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
            </div>` : ''}
          </div>
        </div>
      `;
    });
  } else {
    html = '<div class="col-12"><p>No se pudieron cargar los proyectos.</p></div>';
  }

  html += '</div>';
  proyectosContainer.innerHTML = html;
}

// Función para actualizar los textos de la interfaz según el idioma
function updateUITexts(lang) {
  // Actualizar todos los elementos con el atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
}

// Función para actualizar el botón de idioma activo
function updateActiveLanguageButton(lang) {
  document.querySelectorAll('.language-switcher a[data-lang]').forEach(link => {
    if (link.getAttribute('data-lang') === lang) {
      link.classList.add('active');
      link.classList.remove('btn-outline-secondary');
      link.classList.add('btn-primary');
    } else {
      link.classList.remove('active');
      link.classList.add('btn-outline-secondary');
      link.classList.remove('btn-primary');
    }
  });
}

// Función para cambiar el idioma
function changeLanguage(lang) {
  // Guardar preferencia de idioma
  localStorage.setItem('preferredLanguage', lang);
  
  // Actualizar los textos de la interfaz
  updateUITexts(lang);
  
  // Recargar el contenido dinámico
  loadBio();
  loadExperiencia();
  loadProyectos();
  
  // Actualizar el botón de idioma activo
  updateActiveLanguageButton(lang);
}

// Cargar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el selector de idioma
  const languageSwitcher = document.querySelector('.language-switcher');
  if (languageSwitcher) {
    // Añadir manejadores de clic a los enlaces de idioma
    languageSwitcher.querySelectorAll('a[data-lang]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = link.getAttribute('data-lang');
        changeLanguage(lang);
        
        // Actualizar la URL sin recargar la página
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url);
        
        // Actualizar el estado de los botones
        updateActiveLanguageButton(lang);
      });
    });
  }
  
  // Obtener el idioma de la URL, luego del localStorage, o usar inglés por defecto
  const urlLang = getLanguageFromUrl();
  const savedLang = localStorage.getItem('preferredLanguage');
  
  // Priorizar el idioma de la URL sobre el guardado
  const langToUse = urlLang || savedLang || 'en';
  
  // Si hay un idioma en la URL, actualizamos el localStorage
  if (urlLang) {
    localStorage.setItem('preferredLanguage', urlLang);
  }
  
  // Cargar el contenido con el idioma seleccionado
  changeLanguage(langToUse);
  
  // Actualizar los enlaces de cambio de idioma para mantener los parámetros de la URL
  updateLanguageLinks();
  
  // Manejar el evento de navegación hacia atrás/adelante
  window.addEventListener('popstate', () => {
    const currentLang = getLanguageFromUrl();
    changeLanguage(currentLang);
  });
});

function updateLanguageLinks() {
  // Obtener los parámetros actuales de la URL
  const urlParams = new URLSearchParams(window.location.search);
  
  // Actualizar los botones de cambio de idioma
  document.querySelectorAll('.language-switcher button[data-lang]').forEach(button => {
    const lang = button.getAttribute('data-lang');
    // Actualizar el parámetro de idioma en la URL
    urlParams.set('lang', lang);
    // Crear la nueva URL
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    // Actualizar el atributo data-href del botón
    button.setAttribute('data-href', newUrl);
    
    // Añadir manejador de clics para navegar a la nueva URL
    button.onclick = (e) => {
      e.preventDefault();
      window.location.href = newUrl;
    };
  });
  
  // Actualizar los enlaces de idioma en el pie de página (si existen)
  document.querySelectorAll('a[data-lang]').forEach(link => {
    const lang = link.getAttribute('data-lang');
    urlParams.set('lang', lang);
    link.href = `${window.location.pathname}?${urlParams.toString()}`;
  });
}
