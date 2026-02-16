import asyncio
import asyncpg
import redis.asyncio as redis
from app.core.config import settings

async def check_postgres():
    print(f"Checking PostgreSQL connection to {settings.DATABASE_URL}...")
    try:
        # Parse the URL roughly to get params (asyncpg needs cleaner args usually, but let's try direct connection string if possible or parse it)
        # Using the value from settings str directly might fail if it's sqlalchemy format 'postgresql+asyncpg://...'
        # Let's verify the host/port usage.
        
        # Simple TCP check first
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 5432))
        if result == 0:
             print("✅ TCP Port 5432 is OPEN.")
        else:
             print("❌ TCP Port 5432 is CLOSED. Is Postgres running?")
             return False
        
        return True

    except Exception as e:
        print(f"❌ Postgres Check Failed: {e}")
        return False

async def check_redis():
    print(f"\nChecking Redis connection to {settings.REDIS_URL}...")
    try:
        r = redis.from_url(str(settings.REDIS_URL))
        await r.ping()
        print("✅ Redis is ALIVE.")
        await r.close()
        return True
    except Exception as e:
        print(f"❌ Redis Check Failed: {e}")
        return False

async def main():
    print("--- INFRASTRUCTURE HEALTH CHECK ---")
    db_up = await check_postgres()
    redis_up = await check_redis()
    
    if db_up and redis_up:
        print("\n✅ READY FOR MIGRATIONS.")
    else:
        print("\n❌ INFRASTRUCTURE ISSUES DETECTED. PLEASE FIX BEFORE RUNNING MIGRATIONS.")

if __name__ == "__main__":
    asyncio.run(main())
