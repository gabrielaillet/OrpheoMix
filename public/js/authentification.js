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
    console.log(JSON.stringify({ pseudo, password }));
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
        console.log(data.id);

        // Redirection if authentication succeeded
        localStorage.setItem("userId", data.id);

        window.location.href = "/main";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Login failed: Invalid credentials");
      });
    //const message = await response.text();
    //alert(message);
  });
