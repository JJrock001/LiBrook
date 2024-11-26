const USERNAME = "admin";
const PASSWORD = "password123";

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Reset the error message
  errorMessage.style.display = "none";

  if (username === USERNAME && password === PASSWORD) {
    alert("Login successful!");
    window.location.href = "reservation.html";
  } else {
    errorMessage.style.display = "block";
  }
}
