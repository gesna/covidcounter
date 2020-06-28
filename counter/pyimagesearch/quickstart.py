from azure.cognitiveservices.vision.computervision import ComputerVisionClient
# from azure.cognitiveservices.vision.computervision.models import TextOperationStatusCodes
# from azure.cognitiveservices.vision.computervision.models import TextRecognitionMode
# from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
import requests
from array import array
import os
from PIL import Image
import sys
import time
import math
import json

# Go get the values from .env file
from dotenv import load_dotenv
load_dotenv()


def get_centroid(rect):
    return rect['x'] + rect['w'] / 2, rect['y'] + rect['h'] / 2

print("e")
# Add your Computer Vision subscription key to your environment variables.
if 'COMPUTER_VISION_SUBSCRIPTION_KEY' in os.environ:
    subscription_key = os.environ['COMPUTER_VISION_SUBSCRIPTION_KEY']
else:
    print("\nSet the COMPUTER_VISION_SUBSCRIPTION_KEY environment variable.\n**Restart your shell or IDE for changes to take effect.**")
    sys.exit()
# Add your Computer Vision endpoint to your environment variables.
if 'COMPUTER_VISION_ENDPOINT' in os.environ:
    endpoint = os.environ['COMPUTER_VISION_ENDPOINT']
else:
    print("\nSet the COMPUTER_VISION_ENDPOINT environment variable.\n**Restart your shell or IDE for changes to take effect.**")
    sys.exit()



computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))


'''
Detect Objects - remote
This example detects different kinds of objects with bounding boxes in a remote image.
'''
print("===== Detect Objects - remote =====")
# Get URL image with different objects
remote_image_url_objects = "https://www.vishopper.com/images/products/maxxmax/PE/4602_cut-out-crowd-seen-from-above.jpg"
# Call API with URL

image_path = r"C:\Users\t-otsmit\Downloads\ppl.jpg"

# Read the image into a byte array
image_data = open(image_path, "rb").read()

analyze_url = endpoint + "vision/v3.0/analyze"

# Read the image into a byte array
headers = {'Ocp-Apim-Subscription-Key': subscription_key,
           'Content-Type': 'application/octet-stream'}
params = {'visualFeatures': 'objects'}
response = requests.post(
    analyze_url, headers=headers, params=params, data=image_data)
response.raise_for_status()
analyzed = response.json()
print(analyzed['objects'])



# Print detected objects results with bounding boxes
print("Detecting objects in remote image:")
if len(analyzed['objects']) == 0:
    print("No objects detected.")
else:
    for object in analyzed['objects']:
        
        if(object['object'] == "person"):
            print("Object at location {}, {}, {}, {}, centroid at {}".format( \
            object['rectangle']['x'], object['rectangle']['x'] + object['rectangle']['w'], \
            object['rectangle']['y'], object['rectangle']['y'] + object['rectangle']['h'], get_centroid(object['rectangle'])))
        else:
            print(object['object'])


