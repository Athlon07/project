from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Replace the connection string with your actual URI.
uri = "mongodb+srv://shadow:shadow1234@sssss.zk9wl.mongodb.net/myDatabase?retryWrites=true&w=majority&authSource=admin&appName=sssss"
client = MongoClient(uri, server_api=ServerApi('1'))

# Select the target database and collection.
db = client.get_database("myDatabase")
routes_collection = db.routes

# Define 20 demo route documents.
routes = [
    {
        "name": "Morning Route A",
        "stops": [
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Sports Complex", "lat": 12.3470, "lng": 65.4300},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290}
        ],
        "schedule": "07:00 AM - 09:00 AM"
    },
    {
        "name": "Morning Route B",
        "stops": [
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Science Building", "lat": 12.3475, "lng": 65.4305},
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295}
        ],
        "schedule": "07:00 AM - 09:00 AM"
    },
    {
        "name": "Evening Route A",
        "stops": [
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280},
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321}
        ],
        "schedule": "05:00 PM - 07:00 PM"
    },
    {
        "name": "Evening Route B",
        "stops": [
            {"name": "Sports Complex", "lat": 12.3470, "lng": 65.4300},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280},
            {"name": "Parking Lot", "lat": 12.3500, "lng": 65.4270}
        ],
        "schedule": "05:00 PM - 07:00 PM"
    },
    {
        "name": "Midday Route A",
        "stops": [
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Science Building", "lat": 12.3475, "lng": 65.4305},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290}
        ],
        "schedule": "11:00 AM - 01:00 PM"
    },
    {
        "name": "Midday Route B",
        "stops": [
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280}
        ],
        "schedule": "11:00 AM - 01:00 PM"
    },
    {
        "name": "Night Route A",
        "stops": [
            {"name": "Parking Lot", "lat": 12.3500, "lng": 65.4270},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321}
        ],
        "schedule": "09:00 PM - 11:00 PM"
    },
    {
        "name": "Night Route B",
        "stops": [
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290},
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Parking Lot", "lat": 12.3500, "lng": 65.4270}
        ],
        "schedule": "09:00 PM - 11:00 PM"
    },
    {
        "name": "Express Route 1",
        "stops": [
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280}
        ],
        "schedule": "08:00 AM - 10:00 AM"
    },
    {
        "name": "Express Route 2",
        "stops": [
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Science Building", "lat": 12.3475, "lng": 65.4305}
        ],
        "schedule": "12:00 PM - 02:00 PM"
    },
    {
        "name": "Campus Loop",
        "stops": [
            {"name": "Parking Lot", "lat": 12.3500, "lng": 65.4270},
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290}
        ],
        "schedule": "07:00 AM - 07:00 PM"
    },
    {
        "name": "City Connector",
        "stops": [
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280},
            {"name": "Sports Complex", "lat": 12.3470, "lng": 65.4300}
        ],
        "schedule": "06:00 AM - 10:00 PM"
    },
    {
        "name": "Route 11",
        "stops": [
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310}
        ],
        "schedule": "07:00 AM - 09:00 AM"
    },
    {
        "name": "Route 12",
        "stops": [
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280}
        ],
        "schedule": "12:00 PM - 02:00 PM"
    },
    {
        "name": "Route 13",
        "stops": [
            {"name": "Sports Complex", "lat": 12.3470, "lng": 65.4300},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321}
        ],
        "schedule": "06:00 PM - 08:00 PM"
    },
    {
        "name": "Route 14",
        "stops": [
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280}
        ],
        "schedule": "08:00 AM - 10:00 AM"
    },
    {
        "name": "Route 15",
        "stops": [
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321},
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315}
        ],
        "schedule": "09:00 AM - 11:00 AM"
    },
    {
        "name": "Route 16",
        "stops": [
            {"name": "Parking Lot", "lat": 12.3500, "lng": 65.4270},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280},
            {"name": "Science Building", "lat": 12.3475, "lng": 65.4305}
        ],
        "schedule": "01:00 PM - 03:00 PM"
    },
    {
        "name": "Route 17",
        "stops": [
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290},
            {"name": "Sports Complex", "lat": 12.3470, "lng": 65.4300},
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295}
        ],
        "schedule": "02:00 PM - 04:00 PM"
    },
    {
        "name": "Route 18",
        "stops": [
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Library Stop", "lat": 12.3460, "lng": 65.4310},
            {"name": "Dormitory", "lat": 12.3456, "lng": 65.4321}
        ],
        "schedule": "03:00 PM - 05:00 PM"
    },
    {
        "name": "Route 19",
        "stops": [
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280},
            {"name": "Academic Building", "lat": 12.3480, "lng": 65.4290},
            {"name": "Sports Complex", "lat": 12.3470, "lng": 65.4300}
        ],
        "schedule": "04:00 PM - 06:00 PM"
    },
    {
        "name": "Route 20",
        "stops": [
            {"name": "Cafeteria", "lat": 12.3485, "lng": 65.4295},
            {"name": "Main Gate", "lat": 12.3465, "lng": 65.4315},
            {"name": "Student Center", "lat": 12.3490, "lng": 65.4280}
        ],
        "schedule": "05:00 PM - 07:00 PM"
    }
]

# Insert the demo routes into the collection
result = routes_collection.insert_many(routes)
print("Inserted route IDs:")
for route_id in result.inserted_ids:
    print(route_id)
