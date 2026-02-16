import secrets

def generate_keys():
    print("Generating secure keys for production...")
    print("-" * 50)
    print(f"SECRET_KEY={secrets.token_urlsafe(64)}")
    print(f"JWT_SECRET={secrets.token_urlsafe(64)}")
    print("-" * 50)
    print("Copy these into your .env file or environment variables.")

if __name__ == "__main__":
    generate_keys()
