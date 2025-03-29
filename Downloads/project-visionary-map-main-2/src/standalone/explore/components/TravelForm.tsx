import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Heart, 
  Send,
  Loader2
} from 'lucide-react';

interface TravelFormProps {
  onSubmit: (formData: {
    city: string;
    interests: string[];
    budget: string;
    people: string;
    fromDate: string;
    toDate: string;
    comments: string;
  }) => void;
  isLoading: boolean;
}

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('2');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      city,
      interests: interests.split(',').map(i => i.trim()),
      budget,
      people,
      fromDate,
      toDate,
      comments
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="City, Country"
              className="w-full pl-10 py-2 px-3 border rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 py-2 px-3 border rounded-md"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 py-2 px-3 border rounded-md"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget per Person (INR)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              placeholder="30000"
              className="w-full pl-10 py-2 px-3 border rounded-md"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Travelers</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              placeholder="2"
              min="1"
              className="w-full pl-10 py-2 px-3 border rounded-md"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Interests</label>
        <div className="relative">
          <Heart className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Nature, History, Food, Adventure..."
            className="w-full pl-10 py-2 px-3 border rounded-md"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">Separate interests with commas</p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Information</label>
        <textarea
          placeholder="Any specific preferences, dietary restrictions, accessibility needs, or special occasions?"
          className="w-full min-h-24 py-2 px-3 border rounded-md resize-none"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating your itinerary...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Generate Itinerary
          </>
        )}
      </Button>
    </form>
  );
};

export default TravelForm;
