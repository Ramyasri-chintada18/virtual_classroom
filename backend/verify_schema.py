from app.schemas.auth_schema import RegisterRequest
import json

try:
    schema = RegisterRequest.model_json_schema()
    print("✅ Schema generated successfully.")
    
    # Check for example
    if "example" in schema:
        print("✅ 'example' found in schema (deprecated location but okay).")
    elif "example" in schema.get("properties", {}).get("email", {}):
         print("✅ Field-level example found.")
    else:
        # Pydantic v2 usually puts config examples in a separate place or under 'examples'
        # But ConfigDict json_schema_extra should put it in the top level if configured right.
        print(f"Schema keys: {schema.keys()}")
        
    print(json.dumps(schema, indent=2))
    
except Exception as e:
    print(f"❌ Failed to generate schema: {e}")
