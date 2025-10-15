document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const data = { nombre, fecha: new Date().toISOString() };

  if (navigator.onLine) {
    enviarAlServidor(data);
  } else {
    await guardarPendiente(data);
    document.getElementById('estado').textContent = "Sin conexión, guardado localmente.";
  }

  document.getElementById('form').reset();
});

async function enviarAlServidor(data) {
  try {
    const response = await fetch('api/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      document.getElementById('estado').textContent = "Guardado en servidor.";
    }
  } catch (err) {
    console.log('Error al enviar, guardando localmente...');
    await guardarPendiente(data);
  }
}

// Cuando vuelve la conexión, sincronizamos
window.addEventListener('online', async () => {
  const db = await openDB();
  const tx = db.transaction('pendientes', 'readonly');
  const store = tx.objectStore('pendientes');
  const pendientes = await store.getAll();

  for (const item of pendientes) {
    await enviarAlServidor(item);
    const tx2 = db.transaction('pendientes', 'readwrite');
    tx2.objectStore('pendientes').delete(item.id);
  }

  console.log('Datos sincronizados con el servidor.');
});
