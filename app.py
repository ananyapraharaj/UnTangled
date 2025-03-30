import os
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from flask_cors import CORS

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Flask App
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)  # Enable CORS for frontend communication

# Initialize LLM securely
llm = ChatGroq(
    temperature=0,
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
)

# Prompt Template (updated to cover every day between start and end date, inclusive)
itinerary_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful travel assistant. Create a detailed travel itinerary for {city} "
            "from {from_date} to {to_date} for {people} people with a budget of {budget} INR each. "
            "Make sure to create an itinerary for every day between the start and end dates, including both the start and end dates. "
            "The itinerary should be organized by days with clear time slots. "
            "Format each day like this:\n\n"
            "**Day 1: Monday, June 10**\n"
            "08:00 AM - Breakfast at local cafe\n"
            "10:00 AM - Visit City Museum\n\n"
            "Include transportation details between locations when relevant. "
            "Consider the weather: {weather}. "
            "User interests: {interests}. "
            "Additional comments: {comments}."
        ),
        ("human", "Create an itinerary for my trip."),
    ]
)

replace_activity_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a travel assistant modifying an existing itinerary. The user wants to replace "
            "the activity at {original_time} with '{new_activity}'. If the new_activity value is 'suggest', "
            "please generate a completely new, unique activity suggestion that fits the time slot, matches the user's interests and budget, "
            "and is not already present anywhere in the itinerary. Ensure that the new activity maintains logical flow and does not repeat any other activity. "
            "Return the complete updated itinerary with the same formatting as before."
        ),
        ("human", "Current itinerary:\n{current_itinerary}\n\nPlease make the change."),
    ]
)

# Serve HTML Pages
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/generate-itinerary", methods=["GET"])
def itinerary_page():
    return render_template("generate-itinerary.html")

@app.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")

@app.route("/signup", methods=["GET"])
def signup_page():
    return render_template("signup.html")

# Fetch Weather
def fetch_weather(city, from_date, to_date):
    try:
        today = datetime.today().date()
        trip_start = datetime.strptime(from_date, "%d-%m-%Y").date()
        is_within_7_days = (trip_start - today).days <= 7

        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
        geo_response = requests.get(geo_url, timeout=5)
        geo_data = geo_response.json()

        if "results" in geo_data and geo_data["results"]:
            lat, lon = geo_data["results"][0]["latitude"], geo_data["results"][0]["longitude"]

            if is_within_7_days:
                url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
            else:
                last_year_date = trip_start.replace(year=trip_start.year - 1).strftime("%d-%m-%Y")
                url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={last_year_date}&end_date={last_year_date}&daily=temperature_2m_max,temperature_2m_min&timezone=auto"

            response = requests.get(url, timeout=5)
            data = response.json()

            if "daily" in data:
                avg_max_temp = round(sum(data["daily"]["temperature_2m_max"]) / len(data["daily"]["temperature_2m_max"]), 1)
                avg_min_temp = round(sum(data["daily"]["temperature_2m_min"]) / len(data["daily"]["temperature_2m_min"]), 1)
                return f"Avg Max Temp: {avg_max_temp}°C, Avg Min Temp: {avg_min_temp}°C"
    except:
        print("Weather API failed. Skipping weather data.")
    return ""

# API Endpoint: Generate Itinerary
@app.route("/api/generate-itinerary", methods=["POST"])
def generate_itinerary():
    data = request.json
    city = data["city"]
    interests = ", ".join(data["interests"])
    budget = data["budget"]
    people = data["people"]
    from_date = datetime.strptime(data["from_date"], "%Y-%m-%d").strftime("%d-%m-%Y")
    to_date = datetime.strptime(data["to_date"], "%Y-%m-%d").strftime("%d-%m-%Y")
    comments = data.get("comments", "")

    # Fetch weather data
    weather = fetch_weather(city, from_date, to_date)

    # Generate itinerary
    response = llm.invoke(
        itinerary_prompt.format_messages(
            city=city,
            interests=interests,
            budget=budget,
            people=people,
            from_date=from_date,
            to_date=to_date,
            weather=weather or "N/A",
            comments=comments,
        )
    )

    return jsonify({"itinerary": response.content, "weather": weather})

# API Endpoint: Replace Activity (used for regeneration)
@app.route("/api/replace-activity", methods=["POST"])
def replace_activity():
    data = request.json
    original_time = data["original_time"]
    new_activity = data["new_activity"]
    current_itinerary = data["current_itinerary"]

    response = llm.invoke(
        replace_activity_prompt.format_messages(
            original_time=original_time,
            new_activity=new_activity,
            current_itinerary=current_itinerary
        )
    )

    return jsonify({"new_itinerary": response.content})

# API Endpoint: Chatbot
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data["message"]
    itinerary = data["itinerary"]

    chat_response = llm.invoke(
        f"Previous itinerary: {itinerary}\nUser query: {user_message}"
    )

    return jsonify({"response": chat_response.content})

if __name__ == "__main__":
    app.run(debug=True)
