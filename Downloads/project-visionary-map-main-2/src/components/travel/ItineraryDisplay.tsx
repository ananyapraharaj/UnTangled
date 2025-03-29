
import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Share2, 
  Download, 
  MessageSquare,
  CloudSun,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ChatAssistant from "@/components/itinerary/ChatAssistant";

interface ItineraryDisplayProps {
  city: string;
  itinerary: string;
  weatherInfo: string | null;
  onCreatePin: () => void;
  onNewPlan: () => void;
}

const ItineraryDisplay = ({ 
  city, 
  itinerary, 
  weatherInfo, 
  onCreatePin, 
  onNewPlan 
}: ItineraryDisplayProps) => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onNewPlan} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Create Another Itinerary
      </Button>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{city} Itinerary</h2>
        <Button onClick={onCreatePin} variant="outline" size="sm">
          Save Itinerary
        </Button>
      </div>
      
      {weatherInfo && (
        <WeatherInfo weatherInfo={weatherInfo} />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Your Personalized Travel Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatItinerary(itinerary) }} 
          />
        </CardContent>
      </Card>
      
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Local Tips</AlertTitle>
        <AlertDescription>
          Ask our AI assistant for more details about specific locations, local customs, or transportation options.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button onClick={() => setChatOpen(true)} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Ask Questions
        </Button>
      </div>
      
      {chatOpen && (
        <ChatAssistant
          destination={city}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

// Helper function to format the itinerary text with HTML
const formatItinerary = (text: string): string => {
  // Convert markdown-style bold to HTML bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert line breaks to HTML breaks
  formatted = formatted.replace(/\n/g, '<br />');
  
  return formatted;
};

// Weather Info Component
const WeatherInfo = ({ weatherInfo }: { weatherInfo: string }) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center">
        <CloudSun className="h-5 w-5 mr-3 text-blue-500" />
        <div>
          <h3 className="font-medium text-sm">Weather Information</h3>
          <p className="text-sm text-muted-foreground">{weatherInfo}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryDisplay;
