import os
import requests
from dotenv import load_dotenv
from datetime import datetime
from typing import TypedDict, Annotated, List
from flask import Flask, request, jsonify
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = Flask(__name__)

# Define State Structure
class PlannerState(TypedDict):
    messages: Annotated[List[HumanMessage | AIMessage], "the messages in the conversation"]
    city: str
    interests: List[str]
    budget: int
    people: int
    from_date: str
    to_date: str
    weather: str
    itinerary: str
    comments: str

# Initialize LLM securely
llm = ChatGroq(
    temperature=0,
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
)

# Prompt Template
itinerary_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful travel assistant. Create a travel itinerary for {city} based on "
            "the user's interests: {interests}. The user has a budget of {budget} INR each for {people} people, "
            "traveling from {from_date} to {to_date}. Provide a structured plan including recommended places, "
            "food options, and local experiences. If available, consider the weather: {weather}. "
            "Include transportation details too. Consider additional comments: {comments}"
        ),
        ("human", "Create an itinerary for my trip."),
    ]
)

# Fetch Weather for Trip Duration
def fetch_weather(city: str, from_date: str) -> str:
    try:
        today = datetime.today().date()
        trip_start = datetime.strptime(from_date, "%Y-%m-%d").date()
        is_within_7_days = (trip_start - today).days <= 7

        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
        geo_response = requests.get(geo_url, timeout=5)
        geo_data = geo_response.json()

        if "results" in geo_data and geo_data["results"]:
            lat, lon = geo_data["results"][0]["latitude"], geo_data["results"][0]["longitude"]

            if is_within_7_days:
                url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
            else:
                last_year_date = trip_start.replace(year=trip_start.year - 1)
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

@app.route("/generate", methods=["POST"])
def generate_itinerary():
    data = request.json
    weather = fetch_weather(data["city"], data["from_date"])
    
    response = llm.invoke(
        itinerary_prompt.format_messages(
            city=data["city"],
            interests=", ".join(data["interests"]),
            budget=data["budget"],
            people=data["people"],
            from_date=data["from_date"],
            to_date=data["to_date"],
            weather=weather or "N/A",
            comments=data.get("comments", "")
        )
    )
    return jsonify({"itinerary": response.content})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    chat_response = llm.invoke(f"Previous itinerary: {data['itinerary']}\nUser query: {data['message']}")
    return jsonify({"response": chat_response.content})

if __name__ == "__main__":
    app.run(debug=True)
