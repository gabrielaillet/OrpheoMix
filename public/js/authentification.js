document
  .getElementById("signupForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const pseudo = document.getElementById("pseudoSignup").value;
    const password = document.getElementById("passwordSignup").value;

    const response = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo, password }),
    });
    console.log(JSON.stringify({ pseudo, password }),)
    const message = await response.text();
    alert(message);
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const pseudo = document.getElementById("pseudoLogin").value;
    const password = document.getElementById("passwordLogin").value;

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pseudo, password }),
      //body: JSON.stringify({ password})
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid credentials");
        }
      })
      .then((data) => {
        console.log(data.message);

        
        // Stocker l'indicateur d'authentification
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", data.userId);

        // Redirection si l'authentification est réussie
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Login failed: Invalid credentials");
      });
    //const message = await response.text();
    //alert(message);
  });
