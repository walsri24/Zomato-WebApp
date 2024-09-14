import pandas as pd
from pymongo import MongoClient
import os
import warnings
import json
warnings.filterwarnings("ignore")

csv_file = "Dataset/updated_data_encoded.csv"
df = pd.read_csv(os.path.join(csv_file))


with open("config/config.json", "r") as f:
    con = json.load(f)
    
uri = con['mongodb']['uri']
client = MongoClient(uri)
# db = client['Zomato']
# collection = db['Data']

# data = df.to_dict(orient='records')
# collection.insert_many(data)

db2 = client['Zomato']
collection2 = db2['Encoded Data']
data = df.to_dict(orient='records')
collection2.insert_many(data)

print(f"Data from {csv_file} inserted into MongoDB succesfully!!")
