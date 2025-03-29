import React from "react";
import ChatAssistant from "./ChatAssistant";

const ItineraryResult: React.FC<{ itinerary: string }> = ({ itinerary }) => {
  return (
    <div className="itinerary-container">
      <h2>Your Itinerary</h2>
      <pre className="itinerary-content">{itinerary}</pre>
      <ChatAssistant itinerary={itinerary} />
    </div>
  );
};

export default ItineraryResult;
