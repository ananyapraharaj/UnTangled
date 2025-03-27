import os
import requests
from dotenv import load_dotenv
from datetime import datetime
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# Define State Structure
class PlannerState(TypedDict):
    messages: Annotated[
        List[HumanMessage | AIMessage], "the messages in the conversation"
    ]
    city: str
    interests: List[str]
    budget: int
    people: int
    from_date: str
    to_date: str
    weather: str
    itinerary: str


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
            "the user's interests: {interests}. The user has a budget of {budget} INR for {people} people, "
            "traveling from {from_date} to {to_date}. Provide a structured plan including recommended places, "
            "food options, and local experiences. If available, consider the weather: {weather}.",
        ),
        ("human", "Create an itinerary for my trip."),
    ]
)


# Get City Input
def input_city(state: PlannerState) -> PlannerState:
    city = input("Enter the city you want to visit: ")
    return {
        **state,
        "city": city.strip(),
        "messages": state["messages"] + [HumanMessage(content=f"City: {city}")],
    }


# Get Interests
def input_interest(state: PlannerState) -> PlannerState:
    interests = input(f"Enter your interests for {state['city']} (comma-separated): ")
    return {
        **state,
        "interests": [interest.strip() for interest in interests.split(",")],
        "messages": state["messages"]
        + [HumanMessage(content=f"Interests: {interests}")],
    }


# Get Budget, People, From Date, To Date
def input_details(state: PlannerState) -> PlannerState:
    budget = int(input("Enter your budget in INR: "))
    people = int(input("Enter the number of people: "))
    from_date = input("Enter the start date (YYYY-MM-DD): ")
    to_date = input("Enter the end date (YYYY-MM-DD): ")

    return {
        **state,
        "budget": budget,
        "people": people,
        "from_date": from_date,
        "to_date": to_date,
        "messages": state["messages"]
        + [
            HumanMessage(
                content=f"Budget: {budget} INR, People: {people}, From: {from_date}, To: {to_date}"
            )
        ],
    }


# Fetch Weather for Trip Duration
def fetch_weather(state: PlannerState) -> PlannerState:
    print(
        f"Fetching weather details for {state['city']} from {state['from_date']} to {state['to_date']}..."
    )

    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={state['city']}&count=1"
        geo_response = requests.get(geo_url, timeout=5)
        geo_data = geo_response.json()

        if "results" in geo_data and geo_data["results"]:
            lat, lon = (
                geo_data["results"][0]["latitude"],
                geo_data["results"][0]["longitude"],
            )
            url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={state['from_date']}&end_date={state['to_date']}&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
            response = requests.get(url, timeout=5)
            data = response.json()

            if "daily" in data:
                avg_max_temp = round(
                    sum(data["daily"]["temperature_2m_max"])
                    / len(data["daily"]["temperature_2m_max"]),
                    1,
                )
                avg_min_temp = round(
                    sum(data["daily"]["temperature_2m_min"])
                    / len(data["daily"]["temperature_2m_min"]),
                    1,
                )
                weather_info = (
                    f"Avg Max Temp: {avg_max_temp}°C, Avg Min Temp: {avg_min_temp}°C"
                )
            else:
                weather_info = ""
        else:
            weather_info = ""
    except:
        print("⚠️ Weather API failed. Skipping weather data.")
        weather_info = ""

    return {**state, "weather": weather_info}


# Generate Itinerary
def create_itinerary(state: PlannerState) -> PlannerState:
    response = llm.invoke(
        itinerary_prompt.format_messages(
            city=state["city"],
            interests=", ".join(state["interests"]),
            budget=state["budget"],
            people=state["people"],
            from_date=state["from_date"],
            to_date=state["to_date"],
            weather=state["weather"] or "N/A",
        )
    )

    print("\n📝 Final Itinerary:\n", response.content)
    return {**state, "itinerary": response.content}


# Chatbot Function
def chat_with_bot(state: PlannerState) -> None:
    print("\n💬 Chatbot: Ask me anything about your trip! (Type 'exit' to quit)")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        chat_response = llm.invoke(
            f"Previous itinerary: {state['itinerary']}\nUser query: {user_input}"
        )
        print(f"Chatbot: {chat_response.content}")


# Run the program
if __name__ == "__main__":
    state = {
        "messages": [],
        "city": "",
        "interests": [],
        "budget": 0,
        "people": 0,
        "from_date": "",
        "to_date": "",
        "weather": "",
        "itinerary": "",
    }
    state = input_city(state)
    state = input_interest(state)
    state = input_details(state)
    state = fetch_weather(state)
    state = create_itinerary(state)
    chat_with_bot(state)
