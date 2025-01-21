import { insertSong, closeDatabase } from "./insertMusic.js";

// Insert a single song
async function addNewSong() {
  try {
    await insertSong(
      "Timeless",
      "The Weeknd",
      "Rap",
      "./songs/Timeless.mp3",
      "./covers/Timeless.jpg",
      240
    );
  } catch (error) {
    console.error("Failed to insert song:", error);
  } finally {
    closeDatabase();
  }
}

// Insert multiple songs
async function addMultipleSongs() {
  const songs = [
    {
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      genre: "Pop",
      audioPath: "./songs/BirdsOfAFeather.mp3",
      coverPath: "./covers/BirdsOfAFeather.jpg",
      duration: 180,
    },
    {
      title: "92i Veyron",
      artist: "Booba",
      genre: "Rap",
      audioPath: "./songs/92iVeyron.mp3",
      coverPath: "./covers/92iVeyron.jpg",
      duration: 200,
    },
  ];

  try {
    for (const song of songs) {
      await insertSong(
        song.title,
        song.artist,
        song.genre,
        song.audioPath,
        song.coverPath,
        song.duration
      );
    }
  } catch (error) {
    console.error("Failed to insert songs:", error);
  } finally {
    closeDatabase();
  }
}

addNewSong();
addMultipleSongs();
