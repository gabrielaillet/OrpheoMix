const DB_NAME = "MusicCache";
const DB_VERSION = 1; // Increment this version if you need to update the schema
const STORE_NAME = "songs";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function storeSongInIndexedDB(songId, songUrl) {
  const db = await openDatabase();

  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the MP3 file as a Blob
      const response = await fetch(songUrl);
      const blob = await response.blob();

      // Add the song to the IndexedDB
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      store.put({ id: songId, blob: blob });

      transaction.oncomplete = () => {
        console.log(`Song ${songId} stored in IndexedDB.`);
        resolve();
      };

      transaction.onerror = (event) => {
        console.error("Error storing song in IndexedDB:", event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      console.error("Error fetching/storing song:", error);
      reject(error);
    }
  });
}

async function loadSongFromIndexedDB(songId) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(songId);

    request.onsuccess = (event) => {
      const result = event.target.result;

      if (result) {
        console.log(`Song ${songId} retrieved from IndexedDB.`);

        // Create a URL for the Blob and set it as the audio source
        const audioPlayer = document.getElementById("audioPlayer");
        const audioURL = URL.createObjectURL(result.blob);
        audioPlayer.src = audioURL;
        audioPlayer.play();

        resolve(result.blob);
      } else {
        console.warn(`Song ${songId} not found in IndexedDB.`);
        reject("Not found");
      }
    };

    request.onerror = (event) => {
      console.error(
        "Error retrieving song from IndexedDB:",
        event.target.error
      );
      reject(event.target.error);
    };
  });
}

async function deleteOldSongs() {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      console.log(`Deleting song ${cursor.key} from IndexedDB.`);
      cursor.delete();
      cursor.continue();
    }
  };
}
