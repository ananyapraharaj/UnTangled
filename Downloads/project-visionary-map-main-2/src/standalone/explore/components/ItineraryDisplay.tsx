
import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import WeatherInfo from './WeatherInfo';

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
  const formatItinerary = (text: string) => {
    // Convert markdown-style bold to HTML
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Trip to {city}</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onCreatePin}
          >
            <Bookmark className="mr-2 h-4 w-4" />
            Create Pin
          </Button>
          <Button 
            variant="outline" 
            onClick={onNewPlan}
          >
            New Plan
          </Button>
        </div>
      </div>
      
      {weatherInfo && <WeatherInfo weatherInfo={weatherInfo} />}
      
      <Card>
        <CardContent className="p-6">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatItinerary(itinerary) }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryDisplay;
