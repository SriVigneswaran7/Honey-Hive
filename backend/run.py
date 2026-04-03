import uvicorn
import os

if __name__ == "__main__":
    # Automatically detects if it's in the cloud (Render) or local
    port = int(os.environ.get("PORT", 8000))
    is_dev = os.environ.get("ENV") != "production"

    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=is_dev
    )