const id = localStorage.getItem("userId");

if (id) {
  // Display user information on the main page
  document.getElementById("userId").textContent = `Welcome user number, ${id}!`;
} else {
  // Redirect to the login page if no user data is available
  window.location.href = "/";
}