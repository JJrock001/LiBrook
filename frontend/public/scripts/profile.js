// profile.js

document.addEventListener("DOMContentLoaded", async () => {
    updateNav(); // Update navigation based on login status

    const userId = sessionStorage.getItem("userId"); // Retrieve userId from sessionStorage
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    console.log("Retrieved userId:", userId);
    console.log("Retrieved token:", token);

    if (userId && token) {
        try {
            // Show loading spinner
            document.getElementById("loading").style.display = "block";

            // Fetch user data and reservations
            await getUserData(userId, token);

            // Hide loading spinner
            document.getElementById("loading").style.display = "none";
        } catch (error) {
            console.error("Error during initialization:", error);
            showToast("An error occurred during initialization.");
            document.getElementById("loading").style.display = "none";
        }
    } else {
        showToast("User not authenticated!");
        window.location.href = "login.html";  // Redirect to login page if no userId or token found
    }
});

// Function to check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Function to update navigation based on login status
function updateNav() {
    const signoutBtn = document.getElementById('signoutBtn');

    if (isLoggedIn()) {
        if (signoutBtn) signoutBtn.style.display = 'block';
    } else {
        if (signoutBtn) signoutBtn.style.display = 'none';
    }

    // Add event listener for signoutBtn
    if (signoutBtn) {
        signoutBtn.addEventListener('click', signOut);
    }
}

async function getUserData(userId, token) {
    try {
        const response = await fetch(`http://54.85.236.167:3222/api/auth/${userId}`, { // Corrected endpoint
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token in the request headers
            }
        });

        if (response.ok) {
            const user = await response.json();

            // Update the profile section with the fetched data
            document.getElementById("userName").textContent = user.username || "John Doe";
            document.getElementById("userEmail").textContent = user.email || "john.doe@example.com";
            document.getElementById("userPhone").textContent = user.phone || "No Info";
            document.getElementById("userMemberSince").textContent = new Date(user.createdAt).toLocaleDateString() || "No Info";
            document.getElementById("profile-img").src = user.profileImage || "pic/male.avif";

            // Handle reservations if included
            if (user.reservations && user.reservations.length > 0) {
                const reservationTableBody = document.getElementById("reservationTable").getElementsByTagName('tbody')[0];
                reservationTableBody.innerHTML = ""; // Clear existing rows

                user.reservations.forEach((reservation, index) => {
                    const row = reservationTableBody.insertRow();
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${"12/4/2024"}</td> 
                        <td>${reservation.startTime+'-'+reservation.endTime}</td>
                        <td>${reservation.roomName || "Confirmed"}</td> 
                    `;
                });
            } else {
                const reservationTableBody = document.getElementById("reservationTable").getElementsByTagName('tbody')[0];
                reservationTableBody.innerHTML = ""; // Clear existing rows

                const row = reservationTableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 4; // Adjust based on the number of table columns
                cell.textContent = "No reservations found.";
                cell.style.textAlign = "center";
            }
        } else if (response.status === 403) {
            showToast("Access denied. You do not have permission to view this profile.");
            window.location.href = "index.html";
        } else if (response.status === 404) {
            showToast("User not found.");
        } else {
            const errorData = await response.json();
            showToast(errorData.message || "Failed to fetch user data.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("An error occurred while fetching user data.");
    }
}

// Utility function to format Unix timestamp to readable date only
function formatDateOnly(timestamp) {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

// Utility function to format start and end Unix timestamps to readable time range
function formatTimeRange(startTimestamp, endTimestamp) {
    if (!startTimestamp || !endTimestamp) return "N/A";
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    const options = { hour: '2-digit', minute: '2-digit' };
    return `${start.toLocaleTimeString([], options)} - ${end.toLocaleTimeString([], options)}`;
}

// Logout functionality
function signOut(event) {
    event.preventDefault(); // Prevent default link behavior
    localStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("profileImage");
    sessionStorage.removeItem("createdAt");
    sessionStorage.removeItem("isLogin");
    showToast("You have been signed out!");
    updateNav();
    // Redirect after a short delay to allow toast to display
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

// Toast Notification Function
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Hamburger Menu Toggle Function (If Needed)
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}
