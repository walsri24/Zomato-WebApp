import requests
import base64
import json
def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        # Read the image and encode it in base64
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return encoded_string

# Example usage:
image_path = r'Zomato WebApp Backend\Image Processing\idli.jpg'
image_base64 = image_to_base64(image_path)

import requests

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
}

data = {"data": image_base64}

response = requests.post('https://iiitstudent.ap-south-1.modelbit.com/v1/predict_image/latest', headers=headers, data=json.dumps(data))
print(response.json())

arr = response.json()

for i in arr['data']:
    print(i)