Project Description
This system comprises two interconnected websites designed to support emergency rescue operations efficiently using AI and real-time communication technologies.

1. User Website (For People in Need of Rescue):
Users can submit their current location coordinates, personal information, name, and emergency status through the website. Once submitted, the AI system will analyze the provided data, including:

Images sent by the user

Text messages

Geographical information via Google Maps API

Current and forecasted weather conditions at the location

Based on this analysis, the AI will offer actionable suggestions on what the user should do while waiting for rescue services to arrive.

2. Rescue Team Website:
This platform is tailored for rescue teams and includes the following features:

Interactive Map displaying real-time locations of people in need, with priority indicators:

Red and green popups indicate urgency levels (determined by AI based on condition and location).

AI-driven Suggestions for each case based on comprehensive user data analysis.

Priority Recommendations based on:

Distance to the user

Severity of the emergency

Rescue history and experience of team members

Weather Dashboard:

Clicking on a location displays the real-time weather at that position using OpenWeatherMap API.

Team Chat:

Real-time group communication between rescue team members using Socket.io.

Authentication Features:

Secure login/logout system

Each team member has a personalized rescue history (e.g., water rescue, firefighting, medical emergencies, etc.).

Technologies Used
Frontend: React, TypeScript, Tailwind CSS

Backend: Node.js, Python Flask

Real-time Communication: Socket.io + ReactJS

Mapping & Routing: React-Leaflet (with Leaflet Routing Machine and Leaflet Distance)

AI & Data Analysis: Custom AI models integrated for image processing and decision-making

