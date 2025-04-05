import React from "react";
import { Card } from "@/components/ui/card";
import { Droplets, Wind, Thermometer } from "lucide-react";
import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

interface WeatherIconProps {
  condition: string;
  className?: string;
  size?: number;
}

export function WeatherIcon({
  condition,
  className,
  size = 40,
}: WeatherIconProps) {
  const iconProps = {
    size: size,
    className: `weather-icon ${className || ""} ${
      condition === "sunny"
        ? "weather-icon-sun"
        : condition === "cloudy"
        ? "weather-icon-cloud"
        : ""
    }`,
  };

  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun {...iconProps} />;
    case "scattered clouds":
      return <Cloud {...iconProps} />;
    case "few clouds":
      return <Cloud {...iconProps} />;
    case "broken clouds":
      return <Cloud {...iconProps} />;
    case "rainy":
      return <CloudRain {...iconProps} />;
    default:
      return <CloudSun {...iconProps} />;
  }
}

interface CurrentWeatherProps {
  city: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  unit: "c" | "f";
}

export function CurrentWeather({
  city,
  temperature,
  condition,
  feelsLike,
  humidity,
  windSpeed,
  unit,
}: CurrentWeatherProps) {
  const getWeatherConditionText = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "Trời nắng";
      case "Clouds":
        return "Nhiều mây";
      case "scattered clouds":
        return "Có mây";
      case "Rain":
        return "Có mưa";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <Card className="weather-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-6 animate-fade-in">
          <WeatherIcon condition={condition} size={84} />
          <h2 className="text-3xl font-bold mt-4">{city}</h2>
          <p className="text-lg text-muted-foreground">
            {getWeatherConditionText(condition)}
          </p>
        </div>

        <div className="flex flex-col justify-center p-6 bg-primary/5 rounded-lg">
          <div className="mb-4">
            <div className="text-6xl font-bold">
              {temperature}°{unit.toUpperCase()}
            </div>
            <div className="text-muted-foreground flex items-center mt-1">
              <Thermometer className="w-4 h-4 mr-1" />
              Cảm giác như {feelsLike}°{unit.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <Droplets className="text-weather-blue mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Độ ẩm</div>
                <div className="font-medium">{humidity}%</div>
              </div>
            </div>

            <div className="flex items-center">
              <Wind className="text-weather-blue mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Gió</div>
                <div className="font-medium">{windSpeed} km/h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
