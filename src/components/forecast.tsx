import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "./current-weather";

interface ForecastDayProps {
  date: string;
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  unit: "c" | "f";
}

export function ForecastDay({
  date,
  day,
  condition,
  highTemp,
  lowTemp,
  unit,
}: ForecastDayProps) {
  return (
    <Card className="flex-1 min-w-[120px]">
      <CardContent className="flex flex-col items-center p-3">
        <div className="font-semibold">{day}</div>
        <div className="text-xs text-muted-foreground mb-2">{date}</div>
        <WeatherIcon condition={condition} size={36} className="my-2" />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-md font-medium">{highTemp}°</span>
          <span className="text-sm text-muted-foreground">{lowTemp}°</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ForecastProps {
  forecastData: ForecastDayProps[];
  unit: "c" | "f";
}

export function Forecast({ forecastData, unit }: ForecastProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Dự báo thời tiết</h3>
      <div className="flex overflow-x-auto gap-3 pb-2">
        {forecastData.map((day, index) => (
          <ForecastDay
            key={index}
            date={day.date}
            day={day.day}
            condition={day.condition}
            highTemp={day.highTemp}
            lowTemp={day.lowTemp}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}
