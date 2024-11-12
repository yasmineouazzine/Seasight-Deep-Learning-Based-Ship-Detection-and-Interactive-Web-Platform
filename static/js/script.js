let images = null;
let descriptions = null;
let classImage = ".image";
let classDesc = ".desc";
let currentObj = 0;
let newObj = 0;
let size = 0;
let transitionLeft = "left";
let transitionRight = "right";
let animate = "transition";
let start = "Start";
let end = "End";

function transition() {
    images.forEach((image, indx) => {
        image.style.transform = `translateX(${100 * (indx - currentObj)}%)`;
    });
    descriptions.forEach((desc, indx) => {
        desc.style.transform = `translateX(${100 * (indx - currentObj)}%)`;
    });
}

function move(direction) {
    if (direction == transitionLeft) {
        currentObj--;
        if (currentObj < 0) {
            currentObj = size - 1;
        }
    } else if (direction == transitionRight) {
        currentObj++;
        if (currentObj >= size) {
            currentObj = 0;
        }
    } else {
        console.log("Wrong direction parameter. Carousel won't move.");
        return;
    }
    transition();
}

window.onload = function () {
    // Check if the user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        // Show the cookie consent popup
        document.getElementById('cookieConsent').style.display = 'block';
    }

    // Add click event listener to the "OK" button
    document.getElementById('acceptCookie').addEventListener('click', function () {
        // Hide the popup
        document.getElementById('cookieConsent').style.display = 'none';
        // Store a flag in localStorage to remember the user's consent
        localStorage.setItem('cookiesAccepted', 'true');
    });
};

document.addEventListener("DOMContentLoaded", function () {
    // TEMPORARY: Clear the localStorage for testing
    localStorage.removeItem('cookiesAccepted'); // For testing, comment or remove after use

    const cookieConsent = document.getElementById("cookieConsent");
    const acceptButton = document.getElementById("acceptCookie");

    // Check if the user has already accepted cookies
    if (!localStorage.getItem("cookiesAccepted")) {
        cookieConsent.style.display = "block"; // Show the popup
    }

    // Handle the 'OK' button click
    acceptButton.addEventListener("click", function () {
        cookieConsent.style.display = "none"; // Hide the popup
        localStorage.setItem("cookiesAccepted", "true"); // Save consent in localStorage
    });
});

function init() {
    images = document.querySelectorAll(classImage);
    descriptions = document.querySelectorAll(classDesc);
    size = images.length;

    currentObj = 0;
    transition();
}
