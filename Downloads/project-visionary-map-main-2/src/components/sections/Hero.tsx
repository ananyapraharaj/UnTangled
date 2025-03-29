
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/10 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent opacity-70"></div>
      </div>
      
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              AI-Powered Travel Planning
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Your Perfect Trip, <span className="text-primary">Planned by AI</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              Create personalized travel itineraries with AI that adapts to weather, 
              traffic, and your preferences in real-time.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2">
                Plan Your Trip <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline">
                Explore Ideas
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">Any destination</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">Custom duration</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">Real-time updates</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 bg-white rounded-xl shadow-elegant p-6 max-w-md mx-auto">
              <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                AI Powered
              </div>
              
              <h3 className="font-semibold text-lg mb-4">Paris Weekend Getaway</h3>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3 flex items-start">
                  <div className="bg-primary/10 rounded-md p-1.5 mr-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Friday, May 24</h4>
                    <p className="text-sm text-muted-foreground">
                      Arrive at Charles de Gaulle Airport
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Weather forecast: 72°F, Sunny
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 flex items-start">
                  <div className="bg-primary/10 rounded-md p-1.5 mr-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Eiffel Tower</h4>
                    <p className="text-sm text-muted-foreground">
                      Skip the line tickets reserved for 2pm
                    </p>
                    <p className="text-xs text-primary mt-1">
                      Best time to visit: Low crowds expected
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 flex items-start">
                  <div className="bg-primary/10 rounded-md p-1.5 mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Dinner at Le Jules Verne</h4>
                    <p className="text-sm text-muted-foreground">
                      Reservation confirmed for 8:30pm
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      €€€ · French cuisine with Eiffel Tower views
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated budget</p>
                  <p className="font-medium">€450 / day</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  View Full Itinerary
                </Button>
              </div>
            </div>
            
            <div className="absolute -z-10 w-full h-full -right-6 top-6 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
