from app.schemas.user_schema import UserResponse
from beanie import PydanticObjectId
from bson import ObjectId

try:
    # Create a dummy user object with an ObjectId
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "role": "student",
        "is_active": True,
        "id": PydanticObjectId()
    }
    
    # Try to validate it with UserResponse
    response = UserResponse.model_validate(user_data)
    print("✅ UserResponse validated PydanticObjectId successfully.")
    print(f"Serialized ID: {response.id}")
    
    # Test with string representation
    user_data_str = {
        "email": "test@example.com",
        "full_name": "Test User",
        "role": "student",
        "is_active": True,
        "id": str(ObjectId())
    }
    response_str = UserResponse.model_validate(user_data_str)
    print("✅ UserResponse validated string ObjectId successfully.")

except Exception as e:
    print(f"❌ Validation failed: {e}")
