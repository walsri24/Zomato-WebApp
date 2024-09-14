from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
import warnings
import math
from geopy.distance import great_circle
warnings.filterwarnings("ignore")


app = Flask(__name__)

with open("Zomato WebApp Backend\config\config.json", "r") as f:
    con = json.load(f)
    
uri = con['mongodb']['uri']
client = MongoClient(uri)
db = client['Zomato']
collection = db['Encoded Data']



def haversine_distance(coords1, coords2):
    return great_circle((coords1['lat'], coords1['lng']), (coords2['lat'], coords2['lng'])).meters

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format."""
    if doc is not None:
        doc['_id'] = str(doc['_id']) 
    return doc

@app.route('/restaurant/<restaurant_ID>', methods=['GET'])
def get_restaurant_by_id(restaurant_ID):
    try:
        restaurant_ID = int(restaurant_ID)
    except ValueError:
        pass


    restaurant = collection.find_one({
        "Restaurant ID": restaurant_ID
    })

    if restaurant:
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
                    restaurant['_id'] = str(restaurant['_id'])
                    restaurants_within_radius.append(restaurant)

        if not restaurants_within_radius:
            return jsonify({"message": "No restaurants found within this range"}), 404

        return jsonify(restaurants_within_radius), 200
    except Exception as error:
        return jsonify({"error": "Server error", "details": str(error)}), 500


if __name__ == "__main__":
    app.run(debug=True)
