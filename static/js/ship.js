document.getElementById('testButton').addEventListener('click', function() {
    const infoFrame = document.getElementById('infoFrame');
    const uploadFrame = document.getElementById('uploadFrame');
    infoFrame.style.display = 'none';
    uploadFrame.style.display = 'block';
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const predictionResult = document.getElementById('predictionResult');
    const predictionText = document.getElementById('predictionText');
    const uploadedImage = document.getElementById('uploadedImage');

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            predictionText.textContent = `Error: ${data.error}`;
        } else if (data.prediction) {
            predictionText.textContent = `Prediction: ${data.prediction}`;
            uploadedImage.src = data.image_url;
        } else {
            predictionText.textContent = 'Error: No prediction received.';
        }
        predictionResult.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        predictionText.textContent = 'Error: Could not process the image.';
        predictionResult.style.display = 'block';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const leftButton = document.querySelector(".carousel-button.left");
    const rightButton = document.querySelector(".carousel-button.right");
    const items = document.querySelectorAll(".carousel-item");

    let currentIndex = 0;

    const updateCarousel = () => {
        items.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add("active");
                item.style.display = "block";
            } else {
                item.classList.remove("active");
                item.style.display = "none";
            }
        });
    };

    leftButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    rightButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    updateCarousel();
});
