# Image Search Functionality

For the image search functionality, I trained a model on a dataset available [here](https://www.kaggle.com/datasets/harishkumardatalab/food-image-classification-dataset).

## Model Details
- **Accuracy**: 92%
- **Number of Labels**: 34

## Deployment
I deployed this model on ModelBit and utilized its API to classify food images.

## Integration
I created a route in my Flask API to handle image search. This route:
1. Calls the ModelBit API to get the classification result.
2. Maps the output from the ModelBit API to the appropriate cuisine.
3. Searches for the cuisine in the database.
4. Response goes to the frontend.

## Code
The curl command for the following deployment is:

```bash
curl -X POST "https://prajwalswaroopsrivastava.ap-south-1.modelbit.com/v1/predict_image/latest" -d "{\"data\": image_base64}"
```

The image provided first needs to be encoded to base64 and then feeded into the model using the API.


## Note
I couldn't upload the model (.h5 file) as it exceeds the 100 MB file storage criteria.
For further understanding, check the Image Processing folder.