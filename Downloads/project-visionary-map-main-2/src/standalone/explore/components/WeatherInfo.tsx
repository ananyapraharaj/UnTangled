
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface WeatherInfoProps {
  weatherInfo: string;
}

const WeatherInfo = ({ weatherInfo }: WeatherInfoProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="mr-2 p-2 bg-blue-100 rounded-full">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800">Weather Forecast</h3>
            <p className="text-sm text-blue-600">{weatherInfo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
