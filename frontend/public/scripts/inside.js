// Function to get query parameter by name (e.g., 'type')
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the room type from the URL parameter 'type'
const roomType = getQueryParam('type');
const roomInfo = document.getElementById('roomInfo');

// Define room information based on room type
let roomDetails = {};

// Change room info based on the 'type' parameter
if (roomType == 1) {
    roomDetails = {
        name: "Library Room 1",
        description: "A quiet space for some rest",
        img: "pic/room1.jpg"
    };
} else if (roomType == 2) {
    roomDetails = {
        name: "Library Room 2",
        description: "A place for teamwork",
        img: "pic/room2.jpg"
    };
} else if (roomType == 3) {
    roomDetails = {
        name: "Library Room 3",
        description: "A place for learning",
        img: "pic/room3.jpg"
    };
}

// Display room details dynamically based on room type
roomInfo.innerHTML = `
    <h2 class="room-name">${roomDetails.name}</h2>
    <img src="${roomDetails.img}" alt="${roomDetails.name}" class="room-image">
    <p class="room-description">${roomDetails.description}</p>
`;

// Get current time (for today) in hours and minutes
const currentTime = new Date();
const currentHour = currentTime.getHours();
const currentMinute = currentTime.getMinutes();

// Function to populate time options when the page loads
async function populateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');

    try {
        // Fetch the booked slots for the room
        const bookedSlots = await getBookedSlots(roomDetails.name);

        if (!bookedSlots) {
            console.error("No booked slots received");
            return;
        }

        // Loop through the time range and populate options
        for (let hour = 8; hour <= 20; hour++) {
            const optionText = (hour < 10 ? '0' : '') + hour + ':00';
            const optionValue = hour;

            // Check if the time slot is already booked
            const isBooked = bookedSlots.some(slot => slot.startTime <= hour && slot.endTime > hour);

            // Create start time options
            const startOption = document.createElement('option');
            startOption.value = optionValue;
            startOption.text = optionText;
            if (hour < currentHour || (hour === currentHour && currentMinute >= 0)) {
                startOption.disabled = true; // Disable past time options
            }
            if (isBooked) {
                startOption.text = `${optionText} (Booked)`; // Append "(Booked)" if the slot is booked
                startOption.disabled = true; // Disable booking if already booked
            }
            startTimeSelect.appendChild(startOption);

            // Create end time options (same logic as start time)
            const endOption = document.createElement('option');
            endOption.value = optionValue;
            endOption.text = optionText;
            if (hour < currentHour || (hour === currentHour && currentMinute >= 0)) {
                endOption.disabled = true; // Disable past time options
            }
            if (isBooked) {
                endOption.text = `${optionText} (Booked)`; // Append "(Booked)" if the slot is booked
                endOption.disabled = true; // Disable booking if already booked
            }
            endTimeSelect.appendChild(endOption);
        }
    } catch (error) {
        console.error("Error populating time options:", error);
    }
}

// Function to get booked slots from the backend
async function getBookedSlots(roomName) {
    try {
        const response = await fetch(`http://54.85.236.167:3222/api/reservation/check-availability?roomName=${encodeURIComponent(roomName)}&startTime=8&endTime=20`);
        const data = await response.json();

        // Check if bookedSlots is returned
        if (!data || !Array.isArray(data.bookedSlots)) {
            console.error("Invalid response format:", data);
            return [];
        }

        return data.bookedSlots;  // Return booked slots
    } catch (error) {
        console.error("Error fetching booked slots:", error);
        return [];
    }
}

// Call function to populate time options on page load
populateTimeOptions();

// Function to check room availability (for individual slot checks)
async function checkRoomAvailability(roomName, startTime, endTime) {
    const response = await fetch(`http://54.85.236.167:3222/api/reservation/check-availability?roomName=${encodeURIComponent(roomName)}&startTime=${startTime}&endTime=${endTime}`);
    const data = await response.json();
    return data.isBooked; // Return true if the room is booked, false if available
}

// Handle the reservation
const reserveButton = document.getElementById('reserveButton');

reserveButton.addEventListener('click', async function () {
    const startTime = parseInt(document.getElementById('startTime').value);
    const endTime = parseInt(document.getElementById('endTime').value);
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
        alert("You must log in to make a reservation.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    if (startTime && endTime) {
        if (startTime < endTime) {
            try {
                // First, check if the room is available
                const isBooked = await checkRoomAvailability(roomDetails.name, startTime, endTime);

                if (isBooked) {
                    alert(`Sorry, ${roomDetails.name} is already booked for the selected time.`);
                    return; // Stop further execution if the room is booked
                }

                // Room is available, proceed with reservation
                const response = await fetch('http://54.85.236.167:3222/api/reservation/reservations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add token for authentication
                    },
                    body: JSON.stringify({
                        startTime,
                        endTime,
                        roomName: roomDetails.name, // Corrected
                        roomType: roomType, // Passed roomType from URL parameter
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Reservation made for ${roomDetails.name} from ${startTime}:00 to ${endTime}:00`);
                    // Optionally, refresh the booked slots
                    populateTimeOptions();
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || "Failed to make reservation.");
                }
            } catch (error) {
                console.error("Error while making reservation:", error);
                alert("An error occurred. Please try again later.");
            }
        } else {
            alert("End time must be later than start time.");
        }
    } else {
        alert("Please select both start and end time for reservation.");
    }
});
