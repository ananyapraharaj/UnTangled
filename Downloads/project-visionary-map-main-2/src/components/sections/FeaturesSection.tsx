
import { 
  Sparkles, 
  CloudSun, 
  MessageSquare, 
  Share2, 
  WifiOff, 
  Clock 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description: "Our ML algorithms create personalized itineraries based on your preferences, budget and travel style."
  },
  {
    icon: CloudSun,
    title: "Real-Time Adjustments",
    description: "Automatically adapts your plans based on weather forecasts, traffic conditions, and venue availability."
  },
  {
    icon: MessageSquare,
    title: "Travel Assistant",
    description: "Chat with our AI to answer travel questions, get recommendations, or adjust your itinerary on the fly."
  },
  {
    icon: Share2,
    title: "Community Sharing",
    description: "Browse and share itineraries with a global community of travelers for inspiration and tips."
  },
  {
    icon: WifiOff,
    title: "Offline Access",
    description: "Download your plans for offline access while traveling, with all details available without internet."
  },
  {
    icon: Clock,
    title: "Time Optimization",
    description: "Intelligently schedules activities to minimize wait times and maximize experiences."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Smart Features for Smarter Travel
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI-powered platform takes care of all the planning details so you can focus on enjoying your journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
