from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
import warnings
import math
from geopy.distance import great_circle
from PIL import Image
from io import BytesIO
import base64
import os
from werkzeug.utils import secure_filename
import requests
warnings.filterwarnings("ignore")


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

with open("config\config.json", "r") as f:
    con = json.load(f)
    
uri = con['mongodb']['uri']
client = MongoClient(uri)
db = client['Zomato']
collection = db['Encoded Data']



UPLOAD_FOLDER = 'Zomato WebApp Backend/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_restaurants_by_cuisine(cuisine):
    
    query = {"Cuisines": {"$regex": f".*{cuisine}.*", "$options": "i"}}
    restaurants = list(collection.find(query))

    if restaurants:
        for restaurant in restaurants:
            restaurant['_id'] = str(restaurant['_id']) 
        return restaurants
    else:
        return None


def haversine_distance(coords1, coords2):
    return great_circle((coords1['lat'], coords1['lng']), (coords2['lat'], coords2['lng'])).meters

def serialize_doc(doc):
    if doc is not None:
        doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
    return doc

@app.route('/restaurant/<restaurant_ID>', methods=['GET'])
def get_restaurant_by_id(restaurant_ID):
    # Try to cast the Restaurant ID to an integer if it's stored as a number
    try:
        restaurant_ID = int(restaurant_ID)
    except ValueError:
        pass  # If it's not a number, leave it as a string

    # Query the collection using the Restaurant ID
    restaurant = collection.find_one({
        "Restaurant ID": restaurant_ID
    })

    if restaurant:
        # Convert ObjectId to string for JSON serialization
        restaurant['_id'] = str(restaurant['_id'])
        restaurant['Restaurant ID'] = str(restaurant.get('Restaurant ID'))
        return jsonify(restaurant), 200
    else:
        return jsonify({"error": f"restaurant not found for ID {restaurant_ID}"}), 404
    
@app.route('/restaurants', methods=['GET'])
def get_list_of_restaurants():
    try:
        page = int(request.args.get('page',1))
        per_page = int(request.args.get('per_page',10))
        
        skip = (page-1)*per_page
        
        restaurants = collection.find().skip(skip).limit(per_page)
        restaurants_list = [serialize_doc(restaurant) for restaurant in restaurants]
        # print(restaurants_list)
        
        return jsonify(restaurants_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/restaurants/near", methods=["GET"])
def get_nearby_restaurants():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')

    if not lat or not lng or not radius:
        return jsonify({"error": "Please provide latitude, longitude, and radius"}), 400

    latitude = float(lat)
    longitude = float(lng)
    radius_in_meters = float(radius) * 1000

    try:
        all_restaurants = collection.find()

        restaurants_within_radius = []
        for restaurant in all_restaurants:
            if 'Latitude' in restaurant and 'Longitude' in restaurant:
                distance = haversine_distance(
                    {'lat': latitude, 'lng': longitude},
                    {'lat': restaurant['Latitude'], 'lng': restaurant['Longitude']}
                )

                if distance <= radius_in_meters:
                    # Convert ObjectId to string for JSON serialization
                    restaurant['_id'] = str(restaurant['_id'])
                    restaurants_within_radius.append(restaurant)

        if not restaurants_within_radius:
            return jsonify({"message": "No restaurants found within this range"}), 404

        return jsonify(restaurants_within_radius), 200
    except Exception as error:
        return jsonify({"error": "Server error", "details": str(error)}), 500




@app.route('/restaurants/image-upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image = request.files['image']
    
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        image.save(filepath)

        with open(filepath, "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        data = {"data": img_base64}

        # Send image to external model API
        response = requests.post('https://iiitstudent.ap-south-1.modelbit.com/v1/predict_image/latest', headers=headers, data=json.dumps(data))

        # Check if response is valid and does not contain NaN values
        if response.status_code == 200:
            try:
                arr = response.json()
                food = arr['data'][0]
                cuisine = arr['data'][1]
                
                rest = get_restaurants_by_cuisine(cuisine)
                
                if rest is None:
                    return jsonify({"error": "No restaurants found for the detected cuisine"}), 404
                
                # Ensure that no invalid values (NaN, undefined) are in the response
                valid_restaurants = []
                for restaurant in rest:
                    if not any(math.isnan(value) for value in restaurant.values() if isinstance(value, (float, int))):
                        valid_restaurants.append(restaurant)
                
                return jsonify(valid_restaurants[:10]), 200
            except (ValueError, KeyError) as e:
                return jsonify({"error": "Invalid response from image prediction service", "details": str(e)}), 500
        else:
            return jsonify({"error": "Failed to get a valid response from external model API"}), 500
    else:
        return jsonify({"error": "Invalid file type. Only png, jpg, jpeg, and webp are allowed."}), 400


if __name__ == "__main__":
    app.run(debug=True)
