
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TravelForm from "@/components/travel/TravelForm";
import ItineraryDisplay from "@/components/travel/ItineraryDisplay";
import { generateItinerary } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TravelPlanner = () => {
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
    
    toast({
      title: "Pin created!",
      description: `Your itinerary for ${city} has been saved.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Travel Planner</h1>
        <p className="text-center text-muted-foreground mb-8">
          Plan your perfect trip with our AI-powered travel assistant
        </p>
        
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
      </main>
      
      <Footer />
    </div>
  );
};

export default TravelPlanner;
