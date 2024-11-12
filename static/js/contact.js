// Star rating system
const starRating = document.getElementById('starRating');
let rating = 0;

for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.innerHTML = '☆';
    star.addEventListener('click', () => {
        rating = i;
        updateStars();
    });
    starRating.appendChild(star);
}

function updateStars() {
    const stars = starRating.children;
    for (let i = 0; i < stars.length; i++) {
        stars[i].innerHTML = i < rating ? '★' : '☆';
    }
}

// Form validation
document.getElementById('contactForm').addEventListener('submit', function(event) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const description = document.getElementById('description').value;

    if (!firstName || !lastName || !email || !phone || !description) {
        alert('Please fill in all fields');
        event.preventDefault();
        return;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        event.preventDefault();
        return;
    }

    // Validate phone number (simple check for digits only)
    if (!/^\d+$/.test(phone)) {
        alert('Please enter a valid phone number (digits only)');
        event.preventDefault();
        return;
    }

    // Add the rating to the form data
    const ratingInput = document.createElement('input');
    ratingInput.type = 'hidden';
    ratingInput.name = 'rating';
    ratingInput.value = rating;
    this.appendChild(ratingInput);
});