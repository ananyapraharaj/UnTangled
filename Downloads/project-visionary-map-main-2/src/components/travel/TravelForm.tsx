
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [city, setCity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("1");
  const [comments, setComments] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      city,
      interests,
      budget,
      people,
      fromDate,
      toDate,
      comments,
    });
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const interestOptions = [
    "History", "Food", "Nature", "Adventure", "Culture", 
    "Relaxation", "Shopping", "Nightlife", "Art", "Sports"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">Destination City *</Label>
          <Input
            id="city"
            placeholder="e.g., Paris, Tokyo, New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="budget">Budget (per person) *</Label>
          <Input
            id="budget"
            placeholder="e.g., 50000"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fromDate">From Date *</Label>
          <Input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="toDate">To Date *</Label>
          <Input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="people">Number of Travelers</Label>
          <Select value={people} onValueChange={setPeople}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of people" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "person" : "people"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {interestOptions.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox 
                id={`interest-${interest}`} 
                checked={interests.includes(interest)}
                onCheckedChange={() => toggleInterest(interest)}
              />
              <Label 
                htmlFor={`interest-${interest}`}
                className="text-sm cursor-pointer"
              >
                {interest}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comments">Additional Comments</Label>
        <Textarea
          id="comments"
          placeholder="Any special requirements or preferences..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Itinerary...
          </>
        ) : (
          "Generate Itinerary"
        )}
      </Button>
    </form>
  );
};

export default TravelForm;
