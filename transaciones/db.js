// db.js
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('visitasDB', 1);
    request.onupgradeneeded = e => {
      const db = e.target.result;
      db.createObjectStore('pendientes', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e);
  });
}

async function guardarPendiente(data) {
  const db = await openDB();
  const tx = db.transaction('pendientes', 'readwrite');
  tx.objectStore('pendientes').add(data);
  tx.oncomplete = () => console.log('Guardado localmente (offline)');
}
