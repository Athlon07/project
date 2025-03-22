from flask import Flask
from flask_cors import CORS
from app.config import Config
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(app)
    
    # Setup MongoDB connection using pymongo
    uri = app.config["MONGO_URI"]
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command('ping')
        print("MongoDB connection successful!")
    except Exception as e:
        print("Error connecting to MongoDB:", e)
    
    # Attach the MongoDB client and database to the app config
    app.config['MONGO_CLIENT'] = client
    # The database name is taken from the URI if provided
    app.config['MONGO_DB'] = client.get_database('myDatabase') 
    
    # Register blueprints
    from app.routes import admin_bp
    from app.auth import auth_bp
    from app.booking import booking_bp
    from app.wallet import wallet_bp
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(booking_bp, url_prefix="/api/booking")
    app.register_blueprint(wallet_bp, url_prefix="/api/wallet")
    
    return app
