import os
import requests
from dotenv import load_dotenv  # Import dotenv
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
    groq_api_key=GROQ_API_KEY,  # Uses environment variable
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


# 1️⃣ Get City Input
def input_city(state: PlannerState) -> PlannerState:
    city = input("Enter the city you want to visit: ")
    return {
        **state,
        "city": city.strip(),
        "messages": state["messages"] + [HumanMessage(content=f"City: {city}")],
    }


# 2️⃣ Get Interests
def input_interest(state: PlannerState) -> PlannerState:
    interests = input(f"Enter your interests for {state['city']} (comma-separated): ")
    return {
        **state,
        "interests": [interest.strip() for interest in interests.split(",")],
        "messages": state["messages"]
        + [HumanMessage(content=f"Interests: {interests}")],
    }


# 3️⃣ Get Budget, People, From Date, To Date
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


# 4️⃣ Fetch Weather for Trip Duration
def fetch_weather(state: PlannerState) -> PlannerState:
    print(
        f"Fetching weather details for {state['city']} from {state['from_date']} to {state['to_date']}..."
    )

    try:
        # Get city coordinates
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={state['city']}&count=1"
        geo_response = requests.get(geo_url, timeout=5)
        geo_data = geo_response.json()

        if "results" in geo_data and len(geo_data["results"]) > 0:
            lat = geo_data["results"][0]["latitude"]
            lon = geo_data["results"][0]["longitude"]

            # Fetch weather data for the trip duration
            url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={state['from_date']}&end_date={state['to_date']}&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
            response = requests.get(url, timeout=5)
            data = response.json()

            if "daily" in data:
                max_temps = data["daily"]["temperature_2m_max"]
                min_temps = data["daily"]["temperature_2m_min"]

                avg_max_temp = round(sum(max_temps) / len(max_temps), 1)
                avg_min_temp = round(sum(min_temps) / len(min_temps), 1)

                weather_info = (
                    f"Avg Max Temp: {avg_max_temp}°C, Avg Min Temp: {avg_min_temp}°C"
                )
            else:
                weather_info = ""

        else:
            weather_info = ""

    except (requests.RequestException, KeyError, ValueError):
        print("⚠️ Weather API failed. Skipping weather data.")
        weather_info = ""

    if weather_info:
        print(
            f"🌤 Weather for {state['city']} from {state['from_date']} to {state['to_date']}: {weather_info}"
        )

    return {
        **state,
        "weather": weather_info,
        "messages": state["messages"]
        + ([HumanMessage(content=f"Weather: {weather_info}")] if weather_info else []),
    }


# 5️⃣ Generate Itinerary
def create_itinerary(state: PlannerState) -> PlannerState:
    print(
        f"Generating an itinerary for {state['city']} with interests: {', '.join(state['interests'])}, "
        f"budget: {state['budget']} INR, for {state['people']} people, from {state['from_date']} to {state['to_date']}."
    )

    response = llm.invoke(
        itinerary_prompt.format_messages(
            city=state["city"],
            interests=", ".join(state["interests"]),
            budget=state["budget"],
            people=state["people"],
            from_date=state["from_date"],
            to_date=state["to_date"],
            weather=state["weather"] if state["weather"] else "N/A",
        )
    )

    print("\n📝 Final Itinerary:\n")
    print(response.content)

    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=response.content)],
        "itinerary": response.content,
    }


# 🚀 Define Workflow
workflow = StateGraph(PlannerState)

workflow.add_node("input_city", input_city)
workflow.add_node("input_interest", input_interest)
workflow.add_node("input_details", input_details)
workflow.add_node("fetch_weather", fetch_weather)
workflow.add_node("create_itinerary", create_itinerary)

workflow.set_entry_point("input_city")
workflow.add_edge("input_city", "input_interest")
workflow.add_edge("input_interest", "input_details")
workflow.add_edge("input_details", "fetch_weather")
workflow.add_edge("fetch_weather", "create_itinerary")
workflow.add_edge("create_itinerary", END)

app = workflow.compile()


# Function to Run Travel Planner
def travel_planner():
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
    for output in app.stream(state):
        pass


# 🎯 Run the Travel Planner
if __name__ == "__main__":
    travel_planner()
