# from flask import Flask, request, jsonify
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi

# def create_app():
#     app = Flask(__name__)
    
#     # MongoDB connection URI (replace <db_username> and <db_password> with your credentials)
#     uri = "mongodb+srv://shadow:shadow1234@sssss.zk9wl.mongodb.net/?retryWrites=true&w=majority&appName=sssss"
    
#     # Create a new client and connect to the server using the ServerApi version '1'
#     client = MongoClient(uri, server_api=ServerApi('1'))
    
#     # Send a ping to confirm a successful connection
#     try:
#         client.admin.command('ping')
#         print("Pinged your deployment. You successfully connected to MongoDB!")
#     except Exception as e:
#         print("Error connecting to MongoDB:", e)
    
#     # Attach the client and a specific database to the app config
#     # Replace 'myDatabase' with your desired database name
#     app.config['MONGO_CLIENT'] = client
#     app.config['MONGO_DB'] = client.get_database('myDatabase')
    
#     # Example endpoint to store data
#     @app.route('/store', methods=['POST'])
#     def store_data():
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided"}), 400
        
#         db = app.config['MONGO_DB']
#         result = db.mycollection.insert_one(data)
#         return jsonify({
#             "msg": "Data stored successfully",
#             "id": str(result.inserted_id)
#         }), 201
    
#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(debug=True)

from app import create_app
from flask_cors import CORS

app = create_app()
if __name__ == '__main__':
    app.run(debug=True)
