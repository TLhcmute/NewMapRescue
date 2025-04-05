import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WeatherSidebar } from "@/components/weather-sidebar";
import { CurrentWeather } from "@/components/current-weather";
import { Forecast } from "@/components/forecast";
import { WeatherChart } from "@/components/weather-chart";
import { WeatherMap } from "@/components/weather-map";
import { WeatherStats } from "@/components/weather-stats";
import { Settings } from "@/components/settings";

import { LocationSelector } from "@/components/location-selector";
import { mockWeatherData } from "@/lib/mock-data";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [temperatureUnit, setTemperatureUnit] = useState<"c" | "f">("c");
  const [notifications, setNotifications] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(
    "Địa điểm cần cứu hộ"
  );
  const [locationData, setLocationData] = useState<[number, number] | null>(
    null
  );
  const [address, setAddress] = useState<string>(""); // State để lưu địa chỉ
  const [weatherData, setWeatherData] = useState<any>(null); // Set to null initially to trigger fetching
  const [foreCast, setForeCast] = useState<any>(mockWeatherData.forecast);
  const [hourlyData, setHourlyData] = useState<any>(mockWeatherData.hourlyData);

  const fetchWeatherData1 = async (lat, lon, apiKey) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const data = await response.json();

    // Process the data to match the hourlyData format
    const hourlyData = data.list.slice(0, 40).map((item) => {
      return {
        time: item.dt_txt,
        temperature: Math.round(item.main.temp - 273.15), // Convert Kelvin to Celsius
        humidity: item.main.humidity,
        precipitation: item.rain ? item.rain["3h"] : 0, // If there's no rain data, set it to 0
      };
    });
    return hourlyData;
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    const API_KEY = `db8d96ac81f8c7d85bace0a27b6af71c`;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`; // units=metric để lấy nhiệt độ Celsius

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        const weatherData = {
          temperature: data.main.temp,
          condition: data.weather[0].description,
          feelsLike: data.main.feels_like,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        };

        setWeatherData(weatherData); // Lưu dữ liệu thời tiết vào state
      } else {
        throw new Error("Error fetching weather data");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  const fetchWeatherForecast = async (latitude, longitude, apiKey) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== "200") {
        throw new Error("Error fetching forecast data");
      }

      // Map the API response to the desired forecast format
      const forecast = data.list.slice(0, 5).map((item) => {
        const date = new Date(item.dt * 1000); // Convert UNIX timestamp to JavaScript Date
        const formattedDate =
          date.toISOString().split("T")[0] + " " + date.toLocaleTimeString(); // Format date

        return {
          date: formattedDate,
          condition: item.weather[0].description,
          highTemp: item.main.temp_max,
          lowTemp: item.main.temp_min,
        };
      });

      return forecast;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return [];
    }
  };

  // Example Usage:

  useEffect(() => {
    // Gọi API mỗi khi locationData thay đổi
    if (locationData && locationData.length === 2) {
      setWeatherData(null); // Reset weatherData before making the request
      fetchWeatherData(locationData[0], locationData[1]);
      const apiKey = "db8d96ac81f8c7d85bace0a27b6af71c"; // Replace with your OpenWeatherMap API key
      const latitude = locationData[0]; // Example latitude
      const longitude = locationData[1]; // Example longitude

      fetchWeatherData1(latitude, longitude, apiKey).then((data) =>
        setHourlyData(data)
      );
      fetchWeatherForecast(latitude, longitude, apiKey)
        .then((forecast) => {
          console.log(forecast);
          setForeCast(forecast);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [locationData]); // Trigger fetch when locationData changes

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Thông tin thời tiết</h1>
              <LocationSelector
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setAddressData={setAddress} // Truyền hàm để nhận địa chỉ
                setLocationData={setLocationData} // Truyền hàm để nhận location (vĩ độ, kinh độ)
              />
            </div>
            {weatherData ? (
              <CurrentWeather
                city={address}
                temperature={weatherData.temperature}
                condition={weatherData.condition}
                feelsLike={weatherData.feelsLike}
                humidity={weatherData.humidity}
                windSpeed={weatherData.windSpeed}
                unit={temperatureUnit}
              />
            ) : (
              <div className="text-sm text-gray-500 italic">
                Chọn vị trí... ⭢{" "}
              </div>
            )}
            <Forecast forecastData={foreCast} unit={temperatureUnit} />
            <WeatherChart hourlyData={hourlyData} unit={temperatureUnit} />
            <WeatherStats
              monthlyData={mockWeatherData.monthlyData}
              unit={temperatureUnit}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <ThemeProvider>
        <div className="min-h-screen flex w-full">
          <SidebarProvider>
            <div className="flex w-full">
              <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full mt-16 overflow-y-auto">
                <div className="container mx-auto">{renderContent()}</div>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </>
  );
};

export default Dashboard;
