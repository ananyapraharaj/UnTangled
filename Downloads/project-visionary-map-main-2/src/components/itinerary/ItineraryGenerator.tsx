import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Heart, 
  Users, 
  Send,
  Loader2,
  LocateFixed,
  Sparkle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ItineraryResult from "./ItineraryResult";

type FormValues = {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string;
  additionalInfo: string;
};

const ItineraryGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      travelers: "2",
      interests: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      setIsGenerating(false);
      
      // Mock data for demo purposes
      setGeneratedItinerary({
        destination: data.destination,
        dates: {
          start: data.startDate,
          end: data.endDate,
        },
        travelers: parseInt(data.travelers),
        totalBudget: `$${parseInt(data.budget) * parseInt(data.travelers)}`,
        dailyBudget: `$${Math.round(parseInt(data.budget) / ((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)))}`,
        weather: {
          forecast: "Mostly sunny, 70-80°F",
          rainyDays: 1,
        },
        days: [
          {
            date: data.startDate,
            weather: "Sunny, 75°F",
            activities: [
              {
                time: "09:00 AM",
                name: "Arrive at destination",
                location: "Airport",
                notes: "Check in at hotel first",
                cost: "$0",
                weatherSensitive: false,
              },
              {
                time: "12:00 PM",
                name: "Lunch at local restaurant",
                location: "Downtown",
                notes: "Highly rated on TripAdvisor",
                cost: "$30 per person",
                weatherSensitive: false,
              },
              {
                time: "02:00 PM",
                name: "Visit main attractions",
                location: "City center",
                notes: "Guided tour available",
                cost: "$25 per person",
                weatherSensitive: true,
              },
            ],
          },
          {
            date: new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)).toISOString().split('T')[0],
            weather: "Partly cloudy, 72°F",
            activities: [
              {
                time: "10:00 AM",
                name: "Outdoor activity",
                location: "Nature park",
                notes: "Bring comfortable shoes",
                cost: "$15 per person",
                weatherSensitive: true,
              },
              {
                time: "01:00 PM",
                name: "Lunch at cafe",
                location: "Historic district",
                notes: "",
                cost: "$20 per person",
                weatherSensitive: false,
              },
              {
                time: "03:00 PM",
                name: "Museum visit",
                location: "Cultural district",
                notes: "Last entry at 4:30 PM",
                cost: "$18 per person",
                weatherSensitive: false,
              },
            ],
          }
        ]
      });
      
      toast({
        title: "Itinerary generated!",
        description: `Your trip to ${data.destination} has been planned.`,
      });
    }, 3000);
  };

  const handleUseCurrentLocation = () => {
    toast({
      title: "Using current location",
      description: "Getting your current location...",
      duration: 2000,
    });
    
    // In a real app, you would use the Geolocation API and then reverse geocode
    setTimeout(() => {
      form.setValue("destination", "San Francisco, CA");
      toast({
        title: "Location detected",
        description: "San Francisco, CA has been set as your destination.",
      });
    }, 1500);
  };

  return (
    <div className="container max-w-6xl mx-auto">
      {!generatedItinerary ? (
        <Card className="w-full shadow-elegant">
          <CardHeader>
            <CardTitle>Create Your Travel Plan</CardTitle>
            <CardDescription>
              Tell us about your trip and our AI will generate a personalized itinerary
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <input
                              placeholder="City, Country"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={handleUseCurrentLocation}
                          >
                            <LocateFixed className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription>
                          Where would you like to go?
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <input
                              type="date"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <input
                              type="date"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget per Person</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <input
                              type="number"
                              placeholder="1000"
                              className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <FormDescription>
                          Your total budget for the trip (per person)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Travelers</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <input
                              type="number"
                              placeholder="2"
                              min="1"
                              className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <input
                            placeholder="Nature, History, Food, Adventure..."
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <FormDescription>
                        What types of activities do you enjoy?
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific preferences, dietary restrictions, accessibility needs, or special occasions?"
                          className="min-h-24 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating your itinerary...
                    </>
                  ) : (
                    <>
                      <Sparkle className="mr-2 h-4 w-4" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Trip to {generatedItinerary.destination}</h2>
            <Button 
              variant="outline" 
              onClick={() => setGeneratedItinerary(null)}
            >
              Create New Plan
            </Button>
          </div>
          <ItineraryResult itinerary={generatedItinerary} />
        </div>
      )}
    </div>
  );
};

export default ItineraryGenerator;
