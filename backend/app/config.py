import os

def get_env(name: str, default: str) -> str:
   return os.getenv(name, default)

APP_NAME = get_env("APP_NAME", "Honey-Hive (DB)")
ENV = get_env("ENV", "dev")
# SQLite DB file path (relative to .github/backend when you run uvicorn there)
SQLITE_PATH = get_env("SQLITE_PATH", "./honeyhive.db")