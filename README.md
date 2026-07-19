# 📱 Smart Field Survey & Inspection App

A React Native mobile application built using **Expo Router** to perform field surveys and inspections. The application is developed in a modular way with a clean UI and simple React Native concepts.

---

## 📌 Project Overview

The Smart Field Survey & Inspection App helps users perform and manage field surveys efficiently. It provides features like creating surveys, capturing photos, accessing device contacts, fetching GPS location, clipboard operations, previewing survey details, and viewing survey history.

The project is built using **React Native**, **Expo Router**, and **JavaScript (JSX)** while following beginner-friendly coding practices.

---

## 🚀 Technologies Used

- React Native
- Expo SDK
- Expo Router
- JavaScript (JSX)

### Expo Packages

- expo-camera
- expo-location
- expo-contacts
- expo-clipboard

---

## 📂 Project Structure

```text
app
│
├── (drawer)
│   ├── _layout.tsx
│   ├── Camera.jsx
│   ├── Contacts.jsx
│   ├── Location.jsx
│   ├── Clipboard.jsx
│   ├── Preview.jsx
│   ├── Settings.jsx
│   │
│   └── (tabs)
│       ├── _layout.tsx
│       ├── Dashboard.jsx
│       ├── Survey.jsx
│       ├── History.jsx
│       └── Profile.jsx
│
├── _layout.tsx
└── +not-found.tsx
```

---

# ✨ Features

## 🏠 Dashboard

- Welcome Header
- Student Details
- Today's Survey Count
- Quick Action Cards
- Recent Survey Summary
- Navigation to other modules

---

## 📝 Survey

- Create New Survey
- Client Details
- Site Details
- Description
- Priority
- Form Validation
- Submit Survey

---

## 📷 Camera

- Camera Permission
- Capture Photo
- Preview Image
- Retake Photo
- Delete Photo

---

## 📍 Location

- Request GPS Permission
- Current Latitude
- Current Longitude
- Location Accuracy
- Refresh Location

---

## 👥 Contacts

- Request Contact Permission
- Fetch Device Contacts
- Search Contacts
- Display Contact Numbers
- Refresh Contacts

---

## 📋 Clipboard

- Copy Text
- Paste Text
- Clear Clipboard

---

## 👁 Preview

- Survey Details
- Captured Image
- Selected Contact
- Current Location
- Notes
- Final Preview

---

## 📜 History

- Survey History
- Search Survey
- Delete Survey
- View Previous Surveys

---

## 👤 Profile

- Student Information
- Course Details
- Semester Information

---

## ⚙ Settings

- Application Settings
- Theme Preferences
- About Application

---

# 📱 Navigation

### Drawer Navigation

- Dashboard
- Survey
- Camera

### Bottom Tabs

- Dashboard
- Survey
- Camera

Navigation is implemented using **Expo Router**.

---

# 🎨 UI Design

- Modern Dark Theme
- Responsive Layout
- Consistent Card Design
- Clean Typography
- Simple React Native Styling
- Beginner-Friendly Code

---

# 🛠 React Native Concepts Used

- View
- Text
- Image
- Button
- Pressable
- FlatList
- ScrollView
- TextInput
- Alert
- ActivityIndicator
- RefreshControl
- useState
- useEffect
- StyleSheet

---

# 📦 Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to the project folder

```bash
cd Smart-Field-Survey-App
```

Install dependencies

```bash
npm install
```

Start Expo

```bash
npx expo start
```

---

# 📚 Learning Outcomes

- React Native Fundamentals
- Expo Router Navigation
- Drawer Navigation
- Bottom Tab Navigation
- Expo APIs
- Mobile UI Design
- Form Handling
- Device Permissions
- Modular Development

---

# 👩‍💻 Developer

**Yashvi Kanani**

B.Tech Computer Science & Engineering

Swaminarayan University X CodingGita

---

# 📄 License

This project is developed for academic learning and assignment purposes.
