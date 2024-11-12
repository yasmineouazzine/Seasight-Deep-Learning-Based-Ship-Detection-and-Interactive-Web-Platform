from flask import Flask, request, render_template, jsonify, url_for, redirect, flash
from PIL import Image
import numpy as np
from keras.models import load_model
from keras.preprocessing import image as keras_image
import os
import smtplib
import logging
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
model = load_model('path_to_your_model/ship_classifier_model.h5')

# Set a secret key for the Flask application
app.secret_key = os.urandom(24).hex()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/myjourney')
def myjourney():
    return render_template('myjourney.html')

@app.route('/classifier')
def classifier():
    return render_template('classifier.html')

@app.route('/Contact', methods=['GET', 'POST'])
def Contact():
    if request.method == 'POST':
        # Handle form submission
        first_name = request.form['firstName']
        last_name = request.form['lastName']
        email = request.form['email']
        phone = request.form['phone']
        mail_type = request.form['mailType']
        rating = request.form['rating']
        description = request.form['description']
        
        # Send email
        success, message = send_email(first_name, last_name, email, phone, mail_type, rating, description)
        
        if success:
            flash('Your message has been sent successfully!', 'success')
        else:
            flash(f'There was an error sending your message: {message}. Please try again later.', 'error')
        
        # Redirect back to the Contact page
        return redirect(url_for('Contact'))
    
    return render_template('Contact.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded!'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected!'})

    try:
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(img_path)

        # Perform prediction
        img = keras_image.load_img(img_path, target_size=(80, 80))
        img_array = keras_image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        logger.info(f"Image array shape: {img_array.shape}")

        prediction = model.predict(img_array)

        logger.info(f"Model prediction: {prediction}")

        result = "Not a Ship" if prediction[0][0] > 0.5 else "Ship"

        logger.info(f"Prediction result: {result}")

        return jsonify({'prediction': result, 'image_url': url_for('static', filename='uploads/' + file.filename)})
    except Exception as e:
        logger.error(f"Error processing the image: {e}")
        return jsonify({'error': 'Error processing the image'})

def send_email(first_name, last_name, email, phone, mail_type, rating, description):
    your_email = "yasmineouazzine@gmail.com"
    smtp_server = "smtp.gmail.com"
    port = 587
    password = "inqi exly owrt ekef"  # Make sure this is correct

    subject = f"New {mail_type.capitalize()} from {first_name} {last_name}"
    body = f"""
    From: {email}
    Name: {first_name} {last_name}
    Phone: {phone}
    Type: {mail_type}
    Rating: {rating}
    
    Message:
    {description}
    """

    message = f"From: {your_email}\nReply-To: {email}\nTo: {your_email}\nSubject: {subject}\n\n{body}"

    try:
        logger.info(f"Attempting to connect to SMTP server: {smtp_server}:{port}")
        with smtplib.SMTP(smtp_server, port) as server:
            logger.info("Connected to SMTP server. Initiating TLS...")
            server.starttls()
            logger.info("TLS initiated. Attempting to login...")
            server.login(your_email, password)
            logger.info("Login successful. Sending email...")
            server.sendmail(your_email, your_email, message.encode('utf-8'))
            logger.info(f"Email sent successfully from {email}")
        return True, "Email sent successfully"
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication Error: {str(e)}")
        return False, "Failed to authenticate with the SMTP server. Please check your email and app password."
    except smtplib.SMTPException as e:
        logger.error(f"SMTP Error: {str(e)}")
        return False, f"An error occurred while sending the email: {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return False, f"An unexpected error occurred: {str(e)}"

@app.route('/test_email')
def test_email():
    success, message = send_email(
        "Test", "User", "test@example.com", "1234567890", 
        "Test", "5", "This is a test email."
    )
    if success:
        return "Test email sent successfully. Check your inbox and spam folder."
    else:
        return f"Failed to send test email. Error: {message}"

if __name__ == '__main__':
    app.run(debug=True)