import { enviarNuevaRevista } from './websocket.js';

const form = document.getElementById('revista-form');
const grid = document.getElementById('revistas-grid');
const emptyMsg = document.getElementById('empty-message');

// Cargar revistas guardadas
function cargarRevistas() {
  const revistas = JSON.parse(localStorage.getItem('revistas') || '[]');
  grid.innerHTML = '';
  if (revistas.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';
  revistas.forEach(agregarRevistaCard);
}

function agregarRevistaCard(revista) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${revista.portada}" alt="${revista.titulo}" onerror="this.src='icons/icon-192.png'">
    <div class="card-body">
      <h3>${revista.titulo}</h3>
      ${revista.subtitulo ? `<p><strong>${revista.subtitulo}</strong></p>` : ''}
      <p>${new Date(revista.fecha).toLocaleDateString('es-ES')}</p>
      <p>${revista.descripcion || 'Sin descripción'}</p>
    </div>
  `;
  grid.prepend(card); // la más nueva arriba
}

// Guardar y notificar
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const revista = {
    id: Date.now(),
    titulo: document.getElementById('titulo').value,
    subtitulo: document.getElementById('subtitulo').value,
    fecha: document.getElementById('fecha').value,
    portada: document.getElementById('portada').value,
    descripcion: document.getElementById('descripcion').value
  };

 5;

  // Guardar localmente
  const revistas = JSON.parse(localStorage.getItem('revistas') || '[]');
  revistas.unshift(revista);
  localStorage.setItem('revistas', JSON.stringify(revistas));

  // Mostrar inmediatamente
  agregarRevistaCard(revista);

  // Enviar por WebSocket (otros dispositivos verán en tiempo real)
  enviarNuevaRevista(revista);

  form.reset();
});

// Registrar Service Worker y pedir notificaciones
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => {
      console.log('SW registrado');
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('TU_VAPID_PUBLIC_KEY_AQUI')
      });
    })
    .catch(err => console.log('SW error:', err));
}

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

cargarRevistas();

// Función auxiliar para VAPID (cuando tengas backend real)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}