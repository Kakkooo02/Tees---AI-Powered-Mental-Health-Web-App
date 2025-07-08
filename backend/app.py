from datetime import datetime
from flask import Flask, request, jsonify, session, Blueprint
from flask_cors import CORS
import bcrypt
import uuid
import os
import time
from azure.cosmos import CosmosClient
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

app = Flask(__name__)
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True  # Recommended for production

# Allowed origins for both local development and production
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://malstees-hackathon-stg-uaen-02-hqd6d9cgangcgteg.uaenorth-01.azurewebsites.net"
]

# Allow credentials and origins
CORS(app, supports_credentials=True, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_default_secret_key")

# Cosmos DB Setup
COSMOS_URL = os.getenv("COSMOS_DB_URL")
COSMOS_KEY = os.getenv("COSMOS_DB_KEY")
DATABASE_NAME = os.getenv("COSMOS_DB_DATABASE")
USER_CONTAINER_NAME = os.getenv("COSMOS_DB_CONTAINER")
CHAT_CONTAINER_NAME = os.getenv("COSMOS_CHAT_CONTAINER")
MOOD_CONTAINER_NAME = "MoodEntries"

DATABASE_NAME1 = "fitnessDB"  # Database for workouts
CONTAINER_NAME1 = "workouts"
DATABASE_NAME2 = "userDB"  # Database for additional users
CONTAINER_NAME2 = "Users"

if not all([COSMOS_URL, COSMOS_KEY, DATABASE_NAME, USER_CONTAINER_NAME, CHAT_CONTAINER_NAME]):
    raise ValueError("Missing required environment variables for Cosmos DB.")

# Initialize Cosmos client and containers
cosmos_client = CosmosClient(COSMOS_URL, credential=COSMOS_KEY)

database = cosmos_client.get_database_client(DATABASE_NAME)
user_container = database.get_container_client(USER_CONTAINER_NAME)
chat_container = database.get_container_client(CHAT_CONTAINER_NAME)

db1 = cosmos_client.get_database_client(DATABASE_NAME1)
container1 = db1.get_container_client(CONTAINER_NAME1)

db2 = cosmos_client.get_database_client(DATABASE_NAME2)
container2 = db2.get_container_client(CONTAINER_NAME2)

# Azure OpenAI Setup
openai_client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2025-01-01-preview"
)

@app.route("/")
def home():
    return "Flask is running smoothly!"

# Global after_request to add CORS headers dynamically
@app.after_request
def after_request(response):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
    else:
        # Fallback if origin is missing or not allowed:
        response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGINS[1]
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route("/signup", methods=["POST"])  # Add OPTIONS handling similar to others if needed
def signup():
    data = request.get_json()
    name, email, password = data.get("name"), data.get("email"), data.get("password")

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    query = "SELECT * FROM c WHERE c.email = @email"
    parameters = [{"name": "@email", "value": email}]
    existing_users = list(user_container.query_items(query, parameters=parameters, enable_cross_partition_query=True))

    if existing_users:
        return jsonify({"error": "Email already in use"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    new_user = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "password": hashed_password.decode("utf-8")
    }
    user_container.create_item(body=new_user)
    return jsonify({"message": "User registered successfully!"}), 201

@app.route("/signin", methods=["OPTIONS", "POST"])
def signin():
    if request.method == "OPTIONS":
        # Handle preflight for /signin
        response = jsonify({"message": "Preflight successful"})
        origin = request.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGINS[1]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response, 200

    data = request.get_json()
    email, password = data.get("email"), data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password are required"}), 400

    query = "SELECT * FROM c WHERE c.email = @email"
    parameters = [{"name": "@email", "value": email}]
    users = list(user_container.query_items(query, parameters=parameters, enable_cross_partition_query=True))

    if not users:
        return jsonify({"error": "User not found"}), 404

    user = users[0]
    if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        session["email"] = email
        return jsonify({"message": "Login successful!"}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/update_name", methods=["POST"])  # Add OPTIONS handling if needed
def update_name():
    current_email = session.get("email")
    if not current_email:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"error": "New name is required"}), 400

    query = "SELECT * FROM c WHERE c.email = @email"
    parameters = [{"name": "@email", "value": current_email}]
    users = list(user_container.query_items(query, parameters=parameters, enable_cross_partition_query=True))

    if not users:
        return jsonify({"error": "User not found"}), 404

    user = users[0]
    user["name"] = new_name
    user_container.replace_item(item=user["id"], body=user)
    return jsonify({"message": "Name updated successfully!"}), 200

# --- Chatbot Blueprint setup ---
chatbot_bp = Blueprint("chatbot", __name__)

base_system_message = {
    "role": "system",
    "content": (
        "You are an AI mentor designed to support teenagers in emotional well-being, "
        "personal growth, and motivation. Your role is to be an approachable, insightful, "
        "and engaging guide, helping teens navigate challenges like stress, self-confidence, "
        "relationships, and future goals. Your personality is warm, friendly, and relatable—"
        "balancing humor, empathy, and real-world advice. You adapt responses based on sentiment analysis, "
        "ensuring each interaction feels thoughtful, uplifting, and conversational. Deliver guidance step by step—"
        "never overwhelm the user with too much information in one response. After each message, ask a simple follow-up "
        "question or provide a small action for the user to take. if they say anything other than about their feelings, say you are here to help and support you emotional and cannot provide an answer about whatever they asked. "
        "Also, when you think the person needs to exercise, demanding on what they are feeling recommend them to go the exercise section and choose the excerises from yoga, cardio, stretching, meditation and strenght training."
    )
}

def chat_with_mentor(user_input):
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[base_system_message, {"role": "user", "content": user_input}],
            temperature=0.8,
            max_tokens=800,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I'm sorry, I'm having trouble responding right now."

def store_chat_message(user_id, user_input, bot_response):
    chat_record = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "timestamp": time.time(),
        "messages": [
            {"role": "user", "content": user_input},
            {"role": "bot", "content": bot_response}
        ]
    }
    chat_container.create_item(body=chat_record)

@chatbot_bp.route("/chat", methods=["OPTIONS", "POST"])
def chat():
    if request.method == "OPTIONS":
        # Handle preflight for /chat
        response = jsonify({"message": "Preflight successful"})
        origin = request.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGINS[1]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response, 200

    data = request.get_json()
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    bot_response = chat_with_mentor(user_input)
    # Save chat message only if the user is logged in
    user_id = session.get("email")
    if user_id:
        store_chat_message(user_id, user_input, bot_response)

    return jsonify({"reply": bot_response})

app.register_blueprint(chatbot_bp)

@app.route('/workouts', methods=['GET'])
def get_workouts():
    workouts = list(container1.read_all_items())
    return jsonify(workouts)

@app.route('/workouts', methods=['POST'])
def create_workout():
    workout = request.json
    container1.create_item(body=workout)
    return jsonify({"message": "Workout created successfully!"}), 201

@app.route('/Users', methods=['GET'])
def get_users():
    users = list(container2.read_all_items())
    return jsonify(users)

@app.route('/Users', methods=['POST'])
def create_user():
    user = request.json
    container2.create_item(body=user)
    return jsonify({"message": "User created successfully!"}), 201

# @app.route("/submit_mood", methods=["POST"])
# def submit_mood():
#     data = request.json
#     user_id = data.get("userId")
#     email = data.get("email")
#     emoji = data.get("emoji")
#     explanation = data.get("explanation")
#     timestamp = datetime.utcnow().isoformat()

#     if not user_id or not email or not emoji or not explanation:
#         return jsonify({"error": "Missing required fields"}), 400

#     mood_entry = {
#         "id": str(uuid.uuid4()),
#         "userId": user_id,
#         "email": email,
#         "emoji": emoji,
#         "explanation": explanation,
#         "timestamp": timestamp
#     }

#     mood_container.upsert_item(mood_entry)
#     return jsonify({"message": "Mood entry submitted successfully!"}), 201

# # --- Mood Tracker: Get Moods ---
# @app.route("/get_moods", methods=["GET"])
# def get_moods():
#     user_id = request.args.get("userId")
#     if not user_id:
#         return jsonify({"error": "Missing userId parameter"}), 400

#     query = f"SELECT * FROM c WHERE c.userId = '{user_id}' ORDER BY c.timestamp DESC"
#     items = list(mood_container.query_items(query=query, enable_cross_partition_query=True))
#     return jsonify(items), 200//

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
