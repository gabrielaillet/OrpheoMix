<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Add Song - Admin</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container">
      <h1>Add a Song</h1>
      <form id="add-song-form">
        <div class="form-group">
          <label f or="title">Song Title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div class="form-group">
          <label for="artist">Artist</label>
          <input type="text" id="artist" name="artist" required />
        </div>
        <div class="form-group">
          <label for="genre">Genre</label>
          <input type="text" id="genre" name="genre" required />
        </div>
        <div class="form-group">
          <label for="cover">Cover Image</label>
          <input type="file" id="cover" name="cover" accept="image/*" />
        </div>
        <div class="form-group">
          <label for="song">Song File</label>
          <input type="file" id="song" name="song" accept="audio/*" required />
        </div>
        <button type="button" id="submit-button">Add Song</button>
      </form>
    </div>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Arial, sans-serif;
        background-color: #f0f4f7;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .container {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 400px;
        text-align: center;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 20px;
      }

      .form-group {
        margin-bottom: 15px;
        text-align: left;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
      }

      .form-group input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      button {
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      button:hover {
        background-color: #0056b3;
      }
    </style>
    <script>
      const API_BASE_URL = "http://localhost:8000";

      document
        .getElementById("submit-button")
        .addEventListener("click", async () => {
          const form = document.getElementById("add-song-form");
          const formData = new FormData(form);

          const title = formData.get("title");
          const artist = formData.get("artist");
          const genre = formData.get("genre");

          // Convert files to Base64
          const coverFile = formData.get("cover");
          const songFile = formData.get("song");

          const coverBase64 = coverFile ? await fileToBase64(coverFile) : null;
          const songBase64 = await fileToBase64(songFile);

          // Send the data to the server as JSON
          const payload = {
            title,
            artist,
            genre,
            cover: coverBase64, // Base64-encoded string
            song: songBase64, // Base64-encoded string
          };
          try {
            const response = await fetch(`${API_BASE_URL}/addMusic`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Set the Content-Type header
              },
              body: JSON.stringify(payload),
            });

            console.log(response);
          } catch (error) {
            console.error("Error:", error);
          }
        });

      // Function to convert a file to Base64
      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      }
    </script>
  </body>
</html>


