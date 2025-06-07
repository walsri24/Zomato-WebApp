import modelbit
import base64
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from PIL import Image

# Define your categories
category = {
    0: ['burger', 'Burger'], 1: ['butter_naan', 'Butter Naan'], 2: ['chai', 'Chai'],
    3: ['chapati', 'Chapati'], 4: ['chole_bhature', 'Chole Bhature'], 5: ['dal_makhani', 'Dal Makhani'],
    6: ['dhokla', 'Dhokla'], 7: ['fried_rice', 'Fried Rice'], 8: ['idli', 'Idli'], 9: ['jalegi', 'Jalebi'],
    10: ['kathi_rolls', 'Kaathi Rolls'], 11: ['kadai_paneer', 'Kadai Paneer'], 12: ['kulfi', 'Kulfi'],
    13: ['masala_dosa', 'Masala Dosa'], 14: ['momos', 'Momos'], 15: ['paani_puri', 'Paani Puri'],
    16: ['pakode', 'Pakode'], 17: ['pav_bhaji', 'Pav Bhaji'], 18: ['pizza', 'Pizza'], 19: ['samosa', 'Samosa']
}

# Load your model globally
path_to_model = r'C:\Users\Lokesh\Data_Science\zomato\render_food_class\model_v1_inceptionV3.h5'
model = load_model(path_to_model)

# Prediction function
def predict_image(image_base64: str):
    # Decode the base64 image
    img_bytes = base64.b64decode(image_base64)
    img = Image.open(BytesIO(img_bytes))
    
    # Preprocess the image
    img = img.resize((299, 299))  # Resize to the required input size
    img_array = image.img_to_array(img)
    img_processed = np.expand_dims(img_array, axis=0)
    img_processed /= 255.

    # Make a prediction
    prediction = model.predict(img_processed)
    index = np.argmax(prediction)
    
    # Return the predicted category name
    return category[index][1]

# Deploy the function using Modelbit
modelbit.deploy(predict_image)
