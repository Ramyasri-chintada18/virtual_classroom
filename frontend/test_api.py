import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000/api/v1"

async def test_registration():
    async with httpx.AsyncClient() as client:
        # User 1
        print("Registering User 1 (ramya1@test.com)...")
        resp1 = await client.post(f"{BASE_URL}/auth/register", json={
            "email": "ramya1@test.com",
            "password": "password123",
            "full_name": "Ramya One",
            "role": "student"
        })
        print(f"User 1 Status: {resp1.status_code}")
        print(f"User 1 Response: {resp1.text}")

        # User 2
        print("\nRegistering User 2 (ramya2@test.com)...")
        resp2 = await client.post(f"{BASE_URL}/auth/register", json={
            "email": "ramya2@test.com",
            "password": "password123",
            "full_name": "Ramya Two",
            "role": "teacher" # Trying different role
        })
        print(f"User 2 Status: {resp2.status_code}")
        print(f"User 2 Response: {resp2.text}")
        
        # User 1 Retry (Should fail)
        print("\nRegistering User 1 AGAIN (Should ensure unique email check works)...")
        resp3 = await client.post(f"{BASE_URL}/auth/register", json={
            "email": "ramya1@test.com",
            "password": "password123",
            "full_name": "Ramya Duplicate",
            "role": "student"
        })
        print(f"User 1 Retry Status: {resp3.status_code} (Expected 400)")

if __name__ == "__main__":
    asyncio.run(test_registration())
