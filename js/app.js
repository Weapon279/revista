const form = document.getElementById('revista-form');
const grid = document.getElementById('revistas-grid');
const emptyMsg = document.getElementById('empty-message');
const installBtn = document.getElementById('install-btn');
const status = document.getElementById('status');

let deferredPrompt;

// Revistas demo (se cargan solo la primera vez)
const demoRevistas = [
  {titulo:"Revista Ciencia Hoy #45", subtitulo:"Inteligencia Artificial 2025", fecha:"2025-11-01", portada:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", descripcion:"Edición especial sobre IA generativa y ética"},
  {titulo:"Cultura Digital", subtitulo:"Nº 23 - Noviembre", fecha:"2025-11-15", portada:"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800", descripcion:"Arte digital, NFTs y creatividad en la era de la IA"},
  {titulo:"Medicina Moderna", subtitulo:"Avances en biotecnología", fecha:"2025-10-20", portada:"https://images.unsplash.com/photo-1579684453423-5f2c3f4d0a9a?w=800", descripcion:"Nuevos tratamientos contra el cáncer"},
  {titulo:"Tecnología Educativa", subtitulo:"Edición 2025", fecha:"2025-09-10", portada:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", descripcion:"El futuro del aprendizaje con realidad aumentada"},
  {titulo:"Eco Revista", subtitulo:"Cambio climático", fecha:"2025-08-05", portada:"https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800", descripcion:"Soluciones sostenibles para el planeta"}
];

function cargarRevistas() {
  let revistas = JSON.parse(localStorage.getItem('revistas') || '[]');
  
  // Primera vez: cargar demo
  if (revistas.length === 0) {
    revistas = demoRevistas;
    localStorage.setItem('revistas', JSON.stringify(revistas));
  }

  grid.innerHTML = '';
  emptyMsg.style.display = revistas.length ? 'none' : 'block';
  
  revistas.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${r.portada}" alt="${r.titulo}" onerror="this.src='https://via.placeholder.com/400x300/1a1a2e/00d4ff?text=Revista'">
      <div class="card-body">
        <h3>${r.titulo}</h3>
        ${r.subtitulo ? `<p><strong>${r.subtitulo}</strong></p>` : ''}
        <p>${new Date(r.fecha).toLocaleDateString('es-ES')}</p>
        <p>${r.descripcion}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const revista = {
    titulo: document.getElementById('titulo').value,
    subtitulo: document.getElementById('subtitulo').value,
    fecha: document.getElementById('fecha').value,
    portada: document.getElementById('portada').value,
    descripcion: document.getElementById('descripcion').value
  };

  const revistas = JSON.parse(localStorage.getItem('revistas') || '[]');
  revistas.unshift(revista);
  localStorage.setItem('revistas', JSON.stringify(revistas));
  
  cargarRevistas();
  form.reset();
  document.getElementById('portada').value = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800';
  
  status.textContent = '¡Revista publicada!';
  status.className = 'online';
  setTimeout(() => status.textContent = 'Online', 3000);
});

// PWA Install
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      console.log('Instalada');
    }
    deferredPrompt = null;
  });
});

// Estado conexión
window.addEventListener('online', () => status.className = 'online'; status.textContent = 'Online');
window.addEventListener('offline', () => status.className = 'offline'; status.textContent = 'Sin conexión');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/revista-digital-pwa/sw.js');
}

cargarRevistas();
status.textContent = navigator.onLine ? 'Online' : 'Sin conexión';
status.className = navigator.onLine ? 'online' : 'offline';