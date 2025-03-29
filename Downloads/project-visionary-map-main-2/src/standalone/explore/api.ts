
interface GenerateItineraryParams {
  city: string;
  interests: string[];
  budget: string;
  people: string;
  from_date: string;
  to_date: string;
  comments?: string;
}

export async function generateItinerary(params: GenerateItineraryParams) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}

export async function chatWithAssistant(message: string, itinerary: string) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, itinerary }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error chatting with assistant:', error);
    throw error;
  }
}
