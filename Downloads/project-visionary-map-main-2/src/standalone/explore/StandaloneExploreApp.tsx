
import React, { useState } from 'react';
import { useToast } from './hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { generateItinerary } from './api';
import AppLayout from './components/AppLayout';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';

const StandaloneExploreApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const { toast } = useToast();

  const handleFormSubmit = async (formData: {
    city: string;
    interests: string[];
    budget: string;
    people: string;
    fromDate: string;
    toDate: string;
    comments: string;
  }) => {
    if (!formData.city || !formData.fromDate || !formData.toDate || !formData.budget) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setCity(formData.city);
    
    try {
      const result = await generateItinerary({
        city: formData.city,
        interests: formData.interests,
        budget: formData.budget,
        people: formData.people,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        comments: formData.comments
      });
      
      setGeneratedItinerary(result.itinerary);
      setWeatherInfo(result.weather);
      
      toast({
        title: "Itinerary generated!",
        description: `Your trip to ${formData.city} has been planned.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please make sure your Flask API is running at http://127.0.0.1:5000",
        variant: "destructive"
      });
      console.error("API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePin = () => {
    if (!generatedItinerary) return;
    
    // Here you would save the pin to your system
    toast({
      title: "Pin created!",
      description: `Your itinerary for ${city} has been saved.`,
    });
  };
  
  return (
    <AppLayout 
      title="Travel Explorer" 
      description="Generate personalized travel itineraries and save your favorite destinations"
    >
      {!generatedItinerary ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Your Travel Plan</CardTitle>
            <CardDescription>
              Tell us about your trip and our AI will generate a personalized itinerary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      ) : (
        <ItineraryDisplay 
          city={city}
          itinerary={generatedItinerary}
          weatherInfo={weatherInfo}
          onCreatePin={handleCreatePin}
          onNewPlan={() => setGeneratedItinerary(null)}
        />
      )}
    </AppLayout>
  );
};

export default StandaloneExploreApp;
