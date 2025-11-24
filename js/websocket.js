// Simula un servidor WebSocket real (puedes cambiar la URL cuando tengas backend)
const WS_URL = 'wss://websocket-revista-demo.glitch.me';

let socket;
let reconnectAttempts = 0;
const maxReconnect = 10;

function connectWebSocket() {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('WebSocket conectado');
    document.getElementById('connection-status').textContent = 'Online';
    document.getElementById('connection-status').className = 'online';
    reconnectAttempts = 0;
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'nueva-revista') {
      agregarRevistaCard(data.revista);
      mostrarNotificacionPush(data.revista);
    }
  };

  socket.onclose = () => {
    document.getElementById('connection-status').textContent = 'Desconectado';
    document.getElementById('connection-status').className = 'offline';
    if (reconnectAttempts < maxReconnect) {
      setTimeout(connectWebSocket, 3000 * (reconnectAttempts + 1));
      reconnectAttempts++;
    }
  };

  socket.onerror = (err) => console.error('WebSocket error:', err);
}

function enviarNuevaRevista(revista) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'nueva-revista', revista }));
  }
}

// Notificación push local (cuando no hay permiso aún)
function mostrarNotificacionPush(revista) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('¡Nueva revista!', {
      body: revista.titulo,
      icon: revista.portada
    });
  }
}

connectWebSocket();