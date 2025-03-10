document.addEventListener('DOMContentLoaded', () => {

  // --- Tus definiciones existentes del mapa (sin cambios) ---
  const swCorner = [39.893197406527605, -0.15901372034693395];
  const neCorner = [39.968255173674294, -0.04690904165661891];
  const map = L.map('map', {
    minZoom: 14,
    maxZoom: 18,
    maxBounds: [swCorner, neCorner],
    maxBoundsViscosity: 1.0
  });
  map.removeControl(map.zoomControl);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  map.fitBounds([swCorner, neCorner]);

  // --- Elementos existentes del panel lateral (sin cambios) ---
  const sidepanel = document.getElementById('sidepanel');
  const closePanelBtn = document.getElementById('close-panel');
  const sidepanelImg = document.getElementById('sidepanel-img');
  const sidepanelTitle = document.getElementById('sidepanel-title');
  const sidepanelDesc = document.getElementById('sidepanel-desc');
  const modal = document.getElementById('myModal');
  const modalImage = document.getElementById('modal-image');
  const zoomImageBtn = document.getElementById('zoom-image-btn');

  closePanelBtn.addEventListener('click', () => sidepanel.classList.remove('open'));
  zoomImageBtn.addEventListener('click', () => {
    modalImage.src = sidepanelImg.src;
    modal.style.display = 'flex';
  });

  document.querySelector(".modal-close").addEventListener("click", () => {
    modal.style.display = 'none';
  });

  // --- Array global para marcadores ---
  let allMarkers = [];

  // --- Variables globales para filtros ---
  let categoriaActual = 'todas';
  let minYearActual = 1900;
  let maxYearActual = 1950;

  // --- Función unificada de filtrado ---
function aplicarFiltros() {
  allMarkers.forEach(obj => map.removeLayer(obj.marker));

  allMarkers.forEach(obj => {
    const fotoYear = obj.foto.year;
    const fotoCategoria = obj.foto.categoria;

    const coincideYear = (fotoYear >= minYearActual && fotoYear <= maxYearActual);
    const coincideCategoria = (categoriaActual === 'todas' || categoriaActual === 'Totes' || !categoriaActual || fotoCategoria === categoriaActual);

    if (coincideYear && coincideCategoria) {
      map.addLayer(obj.marker);
    }
  });
}


  // --- Cargar datos desde JSON ---
  fetch('data.json')
    .then(response => response.json())
    .then(fotos => {
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
      aplicarFiltros();  // mostrar marcadores inicialmente
    })
    .catch(error => console.error('Error al cargar data.json:', error));

  // --- Slider rango años existente ---
  const sliderRange = document.getElementById('slider-range');
  noUiSlider.create(sliderRange, {
    start: [minYearActual, maxYearActual],
    connect: true,
    step: 1,
    range: { min: 1900, max: 1950 }
  });

  const minYearDisplay = document.getElementById('min-year-display');
  const maxYearDisplay = document.getElementById('max-year-display');

  sliderRange.noUiSlider.on('update', function (values) {
    minYearActual = Math.round(values[0]);
    maxYearActual = Math.round(values[1]);
    minYearDisplay.textContent = minYearActual;
    maxYearDisplay.textContent = maxYearActual;
    aplicarFiltros();
  });

  // --- NUEVO: Menú desplegable categoría ---
  const categoriaSelect = document.getElementById('categoriaSelect');
  categoriaSelect.addEventListener('change', (event) => {
    categoriaActual = event.target.value;
    aplicarFiltros();
  });

});
