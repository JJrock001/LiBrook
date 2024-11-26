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

// Create function to populate the time options and disable past times
function populateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');

    // Loop from 8:00 AM to 8:00 PM
    for (let hour = 8; hour <= 20; hour++) {
        // Convert hour to a formatted string (e.g., 08:00)
        const optionText = (hour < 10 ? '0' : '') + hour + ':00';
        const optionValue = hour;

        // Create start time options
        const startOption = document.createElement('option');
        startOption.value = optionValue;
        startOption.text = optionText;
        if (hour < currentHour || (hour === currentHour && currentMinute >= 0)) {
            startOption.disabled = true; // Disable past time options
        }
        startTimeSelect.appendChild(startOption);

        // Create end time options
        const endOption = document.createElement('option');
        endOption.value = optionValue;
        endOption.text = optionText;
        if (hour < currentHour || (hour === currentHour && currentMinute >= 0)) {
            endOption.disabled = true; // Disable past time options
        }
        endTimeSelect.appendChild(endOption);
    }
}

// Call function to populate time options on page load
populateTimeOptions();

// Handle the reservation
const reserveButton = document.getElementById('reserveButton');
reserveButton.addEventListener('click', function () {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (startTime && endTime) {
        if (parseInt(startTime) < parseInt(endTime)) {
            // Here, you can make an API request to reserve the room or update the database.
            // For this example, we’ll just show an alert.
            alert(`Reservation made for ${roomDetails.name} from ${startTime}:00 to ${endTime}:00`);
            
            // Optionally, you can redirect the user after successful reservation
            // window.location.href = "confirmation.html";
        } else {
            alert("End time must be later than start time.");
        }
    } else {
        alert("Please select both start and end time for reservation.");
    }
});