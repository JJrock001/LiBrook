const USERNAME = "admin";
const PASSWORD = "password123";

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Reset the error message
  errorMessage.style.display = "none";

  // Prepare the data to send to the backend
  const loginData = {
    username: username,
    password: password,
  };

  // Make an API call to check the credentials
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        
        alert("Login successful!");
        window.location.href = "reservation.html";
      } else {
        // Show error message if login failed
        errorMessage.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      errorMessage.style.display = "block";
    });
}
