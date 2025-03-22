import os

class Config:
    # MongoDB connection URI. Update as needed.
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://shadow:shadow1234@sssss.zk9wl.mongodb.net/?retryWrites=true&w=majority&appName=sssss")
