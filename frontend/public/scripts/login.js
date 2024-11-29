document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from submitting traditionally

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Input validation (ensure email and password are provided)
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  const data = {
    email: email,
    password: password,
  };

  try {
    // Make a POST request to the backend to authenticate the user
    const response = await fetch("http://54.85.236.167:3222/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is successful (status 200-299)
    if (response.ok) {
      // Parse the response from the backend
      const result = await response.json();

      // Debugging - Log the result to see what you get
      console.log(result);

      // Check if the result contains a token
      if (result.token) {
        // Store the JWT token and user info in sessionStorage
        localStorage.setItem("token", result.token);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("isLogin", true);  // Mark the user as logged in
        alert("Logged in successfully!");
        window.location.href = "reservation.html"; // Redirect to the reservation page
      } else {
        alert("Login failed. Invalid credentials.");
      }
    } else {
      const errorData = await response.json();
      console.log(errorData); // Log error data for debugging
      alert(errorData.message || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again later.");
  }
});
