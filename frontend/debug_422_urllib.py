import urllib.request
import json
import urllib.error

url = "http://127.0.0.1:8000/api/v1/auth/register"

payload = {
    "email": "test_422_v2@example.com",
    "password": "password123",
    "full_name": "Test User 422",
    "role": "Student"
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')

print(f"Sending POST to {url}")
try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"Status Code: {e.code}")
    print("Response Body:")
    print(e.read().decode())
except Exception as e:
    print(f"Request failed: {e}")
