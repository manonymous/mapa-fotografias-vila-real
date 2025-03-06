document.addEventListener('DOMContentLoaded', () => {
  // 1. Crear el mapa
// 1. Define las esquinas SW y NE (lon, lat -> lat, lon)
const swCorner = [39.893197406527605, -0.15901372034693395];
const neCorner = [39.968255173674294, -0.04690904165661891];

// 2. Crear el mapa limitando la navegación
const map = L.map('map', {
  // Puedes definir minZoom, maxZoom si lo deseas
  minZoom: 14,
  maxZoom: 18,
  maxBounds: [swCorner, neCorner],
  maxBoundsViscosity: 1.0
});


// O elimina zoom
map.removeControl(map.zoomControl);

// 3. Añadir la capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 4. Ajustar la vista para que encaje en el rectángulo
map.fitBounds([swCorner, neCorner]);


  // 2. Elementos del panel lateral
 // Referencias a elementos del DOM
const sidepanel = document.getElementById('sidepanel');
const closePanelBtn = document.getElementById('close-panel');
const sidepanelImg = document.getElementById('sidepanel-img');
const sidepanelTitle = document.getElementById('sidepanel-title');
const sidepanelDesc = document.getElementById('sidepanel-desc');

const modal = document.getElementById('myModal');
const modalImage = document.getElementById('modal-image');

// Ejemplo: función para abrir el panel
function abrirPanel(titulo, imgSrc, descripcion) {
  sidepanelTitle.textContent = titulo;
  sidepanelImg.src = imgSrc;
  sidepanelDesc.textContent = descripcion;

  // Mostrar panel
  sidepanel.classList.add('open');
}

// Cerrar panel
closePanelBtn.addEventListener('click', () => {
  sidepanel.classList.remove('open');
});

// Función para abrir el modal con la imagen
function abrirModalImagen() {
  modalImage.src = sidepanelImg.src;
  modal.style.display = 'flex';
}


// Asignar la función al botón de la lupa
const zoomImageBtn = document.getElementById('zoom-image-btn');
zoomImageBtn.addEventListener('click', abrirModalImagen);

// Cerrar modal
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".modal-close");
  closeBtn.addEventListener("click", cerrarModalImagen);
});

//cerrar pinchando fuera


  // 3. Array para guardar todos los marcadores
  let allMarkers = [];

  // 4. Función para filtrar marcadores según rango de años
  function renderMarkersByYearRange(minYear, maxYear) {
    // 1. Quitar todos los marcadores del mapa
    allMarkers.forEach(obj => {
      map.removeLayer(obj.marker);
    });

    // 2. Añadir solo los que cumplen el rango
    allMarkers.forEach(obj => {
      const fotoYear = obj.foto.year;
      if (fotoYear >= minYear && fotoYear <= maxYear) {
        map.addLayer(obj.marker);
      }
    });
  }

  // 5. Cargar datos desde data.json
  fetch('data.json')
    .then(response => response.json())
    .then(fotos => {
      // Crear marcadores y guardarlos
      fotos.forEach(foto => {
        const marker = L.marker([foto.lat, foto.lon]);

        marker.on('click', () => {
          sidepanel.classList.add('open');
          sidepanelTitle.innerText = foto.titulo;
          sidepanelImg.src = 'img/' + foto.img;
          sidepanelDesc.innerText = foto.desc;
        });

        allMarkers.push({ marker, foto });
      });

      // Mostrar inicialmente todos
      renderMarkersByYearRange(1900, 1950);
    })
    .catch(error => console.error('Error al cargar data.json:', error));

  // 6. Crear el slider doble con noUiSlider
  const sliderRange = document.getElementById('slider-range');
  noUiSlider.create(sliderRange, {
    start: [1900, 1950],   // valores iniciales
    connect: true,         // "true" para una barra continua entre manijas
    step: 1,               // avanza de 1 en 1
    range: {
      min: 1900,
      max: 1950
    }
  });

  // 7. Mostrar valores en <span> y filtrar al mover el slider
  const minYearDisplay = document.getElementById('min-year-display');
  const maxYearDisplay = document.getElementById('max-year-display');

  sliderRange.noUiSlider.on('update', function (values, handle) {
    // values es un array con [valorMin, valorMax]
    const minYear = Math.round(values[0]);
    const maxYear = Math.round(values[1]);

    // Mostrar los valores en pantalla
    minYearDisplay.textContent = minYear;
    maxYearDisplay.textContent = maxYear;

    // Llamar a la función de filtrado
    renderMarkersByYearRange(minYear, maxYear);
  });
});
