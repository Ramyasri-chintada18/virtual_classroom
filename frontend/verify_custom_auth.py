import asyncio
import httpx

BASE_URL = "http://localhost:8000/api/v1"

async def test_custom_auth():
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 0. Test Connection
        print("Testing root connection...")
        try:
            root_resp = await client.get("http://localhost:8000/")
            print(f"Root Status: {root_resp.status_code}")
        except Exception as e:
            print(f"Connection Failed: {e}")
            return

        # 1. Clean up (Actually we don't need to clean up here if we cleared it before)
        test_user_id = "TEST-ID-001"
        test_email = "test@example.com"

        # 2. Test Registration
        print(f"\n[TEST] Registering user_id: {test_user_id}")
        reg_resp = await client.post(f"{BASE_URL}/auth/register", json={
            "full_name": "Test User",
            "user_id": test_user_id,
            "email": test_email,
            "role": "student"
        })
        print(f"Status: {reg_resp.status_code}")
        assert reg_resp.status_code == 200

        # 3. Test Login (Success: password must equal user_id)
        print(f"\n[TEST] Logging in with correct credentials (password == user_id)")
        login_success = await client.post(f"{BASE_URL}/auth/login", json={
            "user_id": test_user_id,
            "password": test_user_id
        })
        print(f"Status: {login_success.status_code}")
        assert login_success.status_code == 200
        assert "access_token" in login_success.json()

        # 4. Test Login (Failure: Invalid ID or Password)
        print(f"\n[TEST] Logging in with incorrect password")
        login_fail = await client.post(f"{BASE_URL}/auth/login", json={
            "user_id": test_user_id,
            "password": "wrong-password"
        })
        print(f"Status: {login_fail.status_code}")
        assert login_fail.status_code == 401
        assert "Invalid ID or Password" in login_fail.text

        # 5. Test Login (Failure: User not registered)
        print(f"\n[TEST] Logging in with non-existent ID")
        login_no_user = await client.post(f"{BASE_URL}/auth/login", json={
            "user_id": "NON-EXISTENT-ID",
            "password": "any"
        })
        print(f"Status: {login_no_user.status_code}")
        assert login_no_user.status_code == 404
        assert "User not registered" in login_no_user.text

        print("\n✅ ALL TESTS PASSED!")

        # 4. Test Duplicate Registration (user_id)
        print(f"\n[TEST] Registering with same user_id: {test_user_id}")
        reg_dup_id = await client.post(f"{BASE_URL}/auth/register", json={
            "full_name": "Another User",
            "user_id": test_user_id,
            "email": "different@example.com",
            "role": "student"
        })
        print(f"Status: {reg_dup_id.status_code}")
        print(f"Response: {reg_dup_id.text}")
        assert reg_dup_id.status_code == 400

        # 5. Test Login (Success: password must equal user_id)
        print(f"\n[TEST] Logging in with correct credentials (password == user_id)")
        login_success = await client.post(f"{BASE_URL}/auth/login", json={
            "user_id": test_user_id,
            "password": test_user_id
        })
        print(f"Status: {login_success.status_code}")
        print(f"Response: {login_success.text}")
        assert login_success.status_code == 200

        # 6. Test Login (Failure: Invalid ID or Password)
        print(f"\n[TEST] Logging in with incorrect password")
        login_fail_pass = await client.post(f"{BASE_URL}/auth/login", json={
            "user_id": test_user_id,
            "password": "wrongpassword"
        })
        print(f"Status: {login_fail_pass.status_code}")
        print(f"Response: {login_fail_pass.text}")
        assert login_fail_pass.status_code == 401
        assert "Invalid ID or Password" in login_fail_pass.text

        # 7. Test Login (Failure: User not registered)
        print(f"\n[TEST] Logging in with non-existent user_id")
        login_fail_user = await client.post(f"{BASE_URL}/auth/login", json={
            "user_id": "NON-EXISTENT",
            "password": "any"
        })
        print(f"Status: {login_fail_user.status_code}")
        print(f"Response: {login_fail_user.text}")
        assert login_fail_user.status_code == 404
        assert "User not registered" in login_fail_user.text

        print("\n✅ ALL TESTS PASSED!")

if __name__ == "__main__":
    asyncio.run(test_custom_auth())
