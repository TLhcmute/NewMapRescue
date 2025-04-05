export const mockWeatherData = {
  currentWeather: {
    city: "Hà Nội",
    temperature: 28,
    condition: "partly_cloudy", // sunny, cloudy, partly_cloudy, rainy
    feelsLike: 30,
    humidity: 72,
    windSpeed: 12,
  },

  forecast: [
    {
      date: "0",

      condition: "partly_cloudy",
      highTemp: 0,
      lowTemp: 0,
    },
    {
      date: "0",

      condition: "sunny",
      highTemp: 0,
      lowTemp: 0,
    },
    {
      date: "0",

      condition: "cloudy",
      highTemp: 0,
      lowTemp: 0,
    },
    {
      date: "0",

      condition: "rainy",
      highTemp: 0,
      lowTemp: 0,
    },
    {
      date: "0",

      condition: "partly_cloudy",
      highTemp: 0,
      lowTemp: 0,
    },
  ],

  hourlyData: [
    {
      time: "0",
      temperature: 0,
      humidity: 0,
      precipitation: 0,
    },
    {
      time: "0",
      temperature: 0,
      humidity: 0,
      precipitation: 0,
    },
    {
      time: "0",
      temperature: 0,
      humidity: 0,
      precipitation: 0,
    },
    {
      time: "0",
      temperature: 0,
      humidity: 0,
      precipitation: 0,
    },
    {
      time: "0",
      temperature: 0,
      humidity: 0,
      precipitation: 0,
    },
  ],

  monthlyData: [
    { month: "T1", rainfall: 18, avgTemperature: 17 },
    { month: "T2", rainfall: 20, avgTemperature: 18 },
    { month: "T3", rainfall: 45, avgTemperature: 21 },
    { month: "T4", rainfall: 90, avgTemperature: 24 },
    { month: "T5", rainfall: 190, avgTemperature: 28 },
    { month: "T6", rainfall: 240, avgTemperature: 30 },
    { month: "T7", rainfall: 270, avgTemperature: 30 },
    { month: "T8", rainfall: 310, avgTemperature: 29 },
    { month: "T9", rainfall: 250, avgTemperature: 28 },
    { month: "T10", rainfall: 130, avgTemperature: 25 },
    { month: "T11", rainfall: 60, avgTemperature: 22 },
    { month: "T12", rainfall: 30, avgTemperature: 19 },
  ],

  locations: [
    { name: "Hà Nội", country: "Việt Nam" },
    { name: "Hồ Chí Minh", country: "Việt Nam" },
    { name: "Đà Nẵng", country: "Việt Nam" },
    { name: "Huế", country: "Việt Nam" },
    { name: "Hải Phòng", country: "Việt Nam" },
  ],
};
