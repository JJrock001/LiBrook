document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from submitting traditionally

    const email = document.getElementById("email").value.trim();
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
            const result = await response.json();
            console.log("Login Response:", result); // Debugging - Log the result to check token and user data

            // Check if the result contains a token and user data
            if (result.token && result.user) {
                // Store the JWT token in localStorage
                localStorage.setItem("token", result.token);

                // Save user data to sessionStorage
                sessionStorage.setItem("userId", result.user.id); // Corrected Access
                sessionStorage.setItem("name", result.user.username || ""); // Adjusted Access
                sessionStorage.setItem("email", result.user.email || ""); // Adjusted Access
                sessionStorage.setItem("phone", result.user.phone || ""); // Adjusted Access
                sessionStorage.setItem("profileImage", result.user.profileImage || "pic/default-avatar.jpg"); // Adjusted Access
                sessionStorage.setItem("createdAt", result.user.createdAt || ""); // Adjusted Access
                sessionStorage.setItem("isLogin", true);

                alert("Logged in successfully!");
                window.location.href = "reservation.html"; // Redirect to the reservation page
            } else {
                alert("Login failed. Invalid credentials.");
            }
        } else {
            // Log the response body for debugging
            const errorData = await response.json();
            console.log("Login Error Response:", errorData); // Log error data for debugging
            alert(errorData.message || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Login error:", error.message || error); // Log more specific error
        alert("An error occurred. Please try again later.");
    }
});
