import pandas as pd
import numpy as np
from pymongo import MongoClient
from pprint import pprint
import json
import warnings
warnings.filterwarnings("ignore")


with open("config/config.json", "r") as f:
    con = json.load(f)
    
uri = con['mongodb']['uri']
client = MongoClient(uri)
db = client['Zomato']
collection = db['Encoded Data']

# filtered_doc = list(collection.find({
#     "$or": [
#         # {"book_url": np.nan},
#         {"Restaurant ID": 312345}
#     ]
# }))

# for doc in filtered_doc:
#     pprint(doc)
#     print("---------")
#     print(doc.get("Restaurant ID"))
#     print()

country_id = 1
query = {
    'Country Code': country_id
}

results = collection.find(query).limit(10)
for i in results:
    pprint(i)
    print()
    print()
    
    
collection.create_index([("location", "2dsphere")])