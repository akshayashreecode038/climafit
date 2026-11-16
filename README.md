# 🌦️ ClimaFit – Weather Meets Fashion

---

## 🌤️ About the Project

ClimaFit is a smart weather-based fashion assistant that helps users decide what to wear based on real-time weather conditions.

Instead of simply checking the weather forecast, ClimaFit transforms weather information into personalized outfit recommendations. It considers factors such as temperature, humidity, rainfall, wind conditions, and personal style preferences to suggest suitable outfits.

The platform also features customizable virtual avatars that allow users to visualize their appearance with different clothing combinations through interactive 2D and 3D representations.

**The idea is simple: Check the weather → Discover your outfit → Visualize your look!**

## ✨ Key Features

### 🌡️ Live Weather Integration

- Fetches real-time weather information using Open-Meteo.
- Provides weather-based insights for selected locations.
- Considers temperature, humidity, rainfall, wind, and weather conditions.

### 👗 Smart Outfit Recommendations

- Rule-based outfit recommendation engine.
- Suggests clothing based on weather conditions.
- Considers personal style preferences.
- Provides recommendations based on comfort and environmental conditions.

### 🧍 Customizable Virtual Avatar

- Create a personalized virtual avatar.
- Customize skin tones, body shapes, and facial features.
- Choose different clothing and accessories.
- Supports interactive 2D and 3D avatar representations.

### 🎨 Interactive 2D & 3D Visualization

- Layered SVG-based 2D avatar.
- Three.js-powered 3D avatar.
- Interactive 3D rotation.
- Animated idle movements and blinking effects.
- Shared appearance and outfit data across both avatar systems.

### 👚 Personal Wardrobe

- Manage clothing items in a digital wardrobe.
- Save favorite outfits.
- Store wardrobe information for personalized styling.

### ❤️ Favorites & Personalization

- Save favorite outfit combinations.
- Maintain personal style preferences.
- Store user settings and avatar customization.

### 🔐 User Accounts

- Firebase Authentication support.
- Email/password and Google sign-in options.
- Firestore integration for cloud-based user data synchronization.
- Guest and local demo modes.

## 🛠️ Tech Stack

| Technology     | Purpose                             |
| -------------- | ----------------------------------- |
| React.js       | Frontend development                |
| Vite           | Development server and build tool   |
| JavaScript     | Application logic and interactivity |
| Tailwind CSS   | Styling and responsive UI           |
| React Router   | Page navigation                     |
| Framer Motion  | Animations and transitions          |
| Three.js       | 3D avatar visualization             |
| SVG            | Layered 2D avatar rendering         |
| Lucide React   | Icons and UI elements               |
| Open-Meteo API | Live weather information            |
| Firebase       | Authentication and cloud database   |
| LocalStorage   | Local data persistence              |

## 🏗️ Project Architecture

The project follows a modular React architecture.

```text
ClimaFit/
│
├── src/
│   ├── engine.js       # Weather-based outfit recommendation engine
│   ├── Avatar.jsx      # Customizable 2D SVG avatar
│   ├── Avatar3D.jsx    # Interactive 3D avatar
│   ├── look.js         # Avatar appearance and customization options
│   ├── store.jsx       # Shared application state and local storage
│   ├── pages.jsx       # Application pages
│   └── weather.js      # Weather API integration
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## ⚙️ How It Works

**1. Weather Detection**

The application retrieves live weather information for the selected location using the Open-Meteo API.

**2. Weather Analysis**

The recommendation engine evaluates environmental conditions such as:

- Feels-like temperature
- Humidity
- Rainfall
- Wind speed
- Weather conditions

**3. Outfit Recommendation**

The rule-based recommendation engine combines weather information with user style preferences to suggest suitable outfits.

**4. Avatar Customization**

Users can create their own virtual avatar by selecting appearance features and customizing its look.

**5. Outfit Visualization**

The recommended outfit and avatar appearance are represented through interactive 2D and 3D avatar systems.

**6. Personalization & Storage**

User preferences, wardrobe items, favorite outfits, and avatar settings can be stored locally or synchronized through Firebase.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- A modern web browser
- Visual Studio Code (recommended)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/akshayashreecode038/climafit.git
```

**2. Navigate to the project directory**

```bash
cd climafit
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔑 Firebase Configuration (Optional)

ClimaFit supports two operating modes:

**Cloud Mode**

- Uses Firebase Authentication.
- Supports Email/Password and Google sign-in.
- Stores user information and preferences in Cloud Firestore.
- Synchronizes avatar customization, wardrobe, favorites, and settings.

To enable cloud functionality:

1. Create a Firebase project.
2. Enable Email/Password and Google Authentication.
3. Create a Cloud Firestore database.
4. Copy `.env.example` to `.env`.
5. Add your Firebase web application configuration.

**Demo Mode**

Without Firebase credentials, the application supports local demo accounts. User data is stored in the browser.

Guests can also use the application without signing in.

## 🌍 Weather API

ClimaFit currently uses the Open-Meteo API for live weather information.

- No API key is required for the current weather integration.
- Weather information is retrieved through the application's weather module.
- The application can be adapted to use other weather providers.

## 🔮 Future Enhancements

- Animated virtual avatars with automatic weather-based outfit changes.
- More detailed outfit combinations and clothing customization.
- Advanced wardrobe-based outfit generation.
- Outfit planning and calendar integration.
- Weather forecasting-based outfit suggestions.
- Additional avatar customization options.
- Improved personalization through user outfit history.

## 🎯 Project Objective

The primary objective of ClimaFit is to combine weather intelligence with personalized fashion recommendations to simplify everyday outfit decisions.

By integrating real-time weather data, recommendation algorithms, digital wardrobes, and interactive virtual avatars, ClimaFit aims to create a more engaging and personalized clothing recommendation experience.

## 👩‍💻 Author

**Akshaya Shree S**

Computer Science and Engineering Student

[GitHub Profile](https://github.com/akshayashreecode038)

---
