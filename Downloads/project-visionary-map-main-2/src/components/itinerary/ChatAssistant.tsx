
import { useState, useRef, useEffect } from "react";
import { X, Send, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ChatAssistantProps {
  destination: string;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatAssistant = ({ destination, onClose }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! I'm your AI travel assistant for your trip to ${destination}. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        "restaurant": `Based on your preferences, I recommend trying these restaurants in ${destination}:
1. The Local Kitchen - Farm-to-table cuisine with great reviews
2. Seaside Terrace - Beautiful ocean views and fresh seafood
3. Cafe Central - Perfect for breakfast or lunch, known for pastries`,
        "weather": `The weather forecast for ${destination} shows mostly sunny days with temperatures between 70-80°F. There's a slight chance of rain (20%) on the second day of your trip, so you might want to pack a light jacket.`,
        "museum": `${destination} has several excellent museums:
- The National Gallery (open 9am-5pm, $15 entry)
- Modern Art Museum (open 10am-6pm, free on Thursdays)
- Natural History Center (great for families, includes interactive exhibits)`,
        "beach": `The best beaches in ${destination} are:
1. Golden Sands - Perfect for swimming and sunbathing
2. Rocky Point - Great for tide pools and sunset views
3. Hidden Cove - Less crowded, requires a short hike to access`,
        "transport": `Getting around ${destination} is easy with:
- Metro system (runs 5am-midnight, $2.50 per ride)
- City bikes available for rent ($10/day)
- Ridesharing services are widely available
- Walking is pleasant in the downtown area`,
      };

      let response = `I'd be happy to help you with your question about ${destination}! `;
      
      // Check if any keywords match
      const userQuestion = inputValue.toLowerCase();
      for (const [keyword, answer] of Object.entries(aiResponses)) {
        if (userQuestion.includes(keyword)) {
          response = answer;
          break;
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="fixed inset-x-4 bottom-4 md:inset-auto md:bottom-6 md:right-6 md:w-96 h-[500px] max-h-[80vh] shadow-elegant z-50 flex flex-col">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          Travel Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === "assistant" ? (
                    <Bot className="h-3 w-3 mr-1" />
                  ) : (
                    <User className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === "user" ? "You" : "Assistant"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <Bot className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Assistant</span>
                </div>
                <div className="h-6 flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your trip..."
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatAssistant;
