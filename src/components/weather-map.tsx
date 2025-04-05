import React, { useEffect, useState } from "react";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeatherMap() {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    // Lấy dữ liệu thời tiết từ OpenWeather API bằng fetch
    const fetchWeatherData = async () => {
      const apiKey = "db8d96ac81f8c7d85bace0a27b6af71c"; // API Key của bạn
      const city = "Hanoi"; // Tên thành phố bạn muốn hiển thị

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (weatherData) {
      // Tạo bản đồ với Leaflet
      const map = L.map("weather-map").setView([21.0285, 105.8542], 13); // Tọa độ của Hà Nội

      // Thêm lớp bản đồ OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );

      // Thêm các vùng thời tiết vào bản đồ (Giả sử có các vùng mưa, nắng và mây)
      if (weatherData.weather) {
        const weatherCondition = weatherData.weather[0].main; // Lấy điều kiện thời tiết chính

        let weatherColor = "gray"; // Mặc định là màu xám (mây)
        let weatherLabel = "Mây";

        if (weatherCondition === "Rain") {
          weatherColor = "blue"; // Mưa
          weatherLabel = "Mưa";
        } else if (weatherCondition === "Clear") {
          weatherColor = "yellow"; // Nắng
          weatherLabel = "Nắng";
        }

        // Tạo một hình chữ nhật để mô phỏng khu vực thời tiết
        L.rectangle(
          [
            [21.0, 105.8], // Góc trên bên trái
            [21.05, 105.9], // Góc dưới bên phải
          ],
          {
            color: weatherColor,
            weight: 2,
            fillColor: weatherColor,
            fillOpacity: 0.4,
          }
        ).addTo(map);

        // Thêm nhãn cho khu vực
        L.marker([21.025, 105.855])
          .addTo(map)
          .bindPopup(`<b>${weatherLabel}</b>`);
      }
    }
  }, [weatherData]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Bản đồ thời tiết</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          id="weather-map"
          className="relative w-full aspect-[16/9] bg-muted rounded-md overflow-hidden"
        >
          {!weatherData && (
            <p className="text-muted-foreground">
              Đang tải bản đồ thời tiết...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
