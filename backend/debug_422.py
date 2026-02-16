import requests
import json

url = "http://127.0.0.1:8000/api/v1/auth/register"

payload = {
    "email": "test_422@example.com",
    "password": "password123",
    "full_name": "Test User 422",
    "role": "student"
}

print(f"Sending POST to {url} with payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except:
        print("Response Text:")
        print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
