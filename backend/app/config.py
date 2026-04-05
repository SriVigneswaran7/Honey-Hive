import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_env(name: str, default: str) -> str:
   return os.getenv(name, default)

APP_NAME = get_env("APP_NAME", "Honey-Hive (DB)")
ENV = get_env("ENV", "dev")

# This ensures the DB is always in the 'backend' folder
SQLITE_PATH = os.path.join(BASE_DIR, "honeyhive.db")