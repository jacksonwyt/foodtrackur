
# Foodtrack App: MVP Outline

## Core Premise for MVP:
Enable users to track daily calorie and macronutrient intake, log their weight, and set basic goals. Leverage AI for food scanning as a key differentiator.

## 1. Onboarding (Essential for Setup)
* **Purpose**: Collect essential user data to calculate initial calorie/macro goals.
* **Screens/Flow**:
    * **Welcome/Intro**: Brief app description.
    * **Goal Selection**: Lose weight, Maintain, Gain weight.
    * **User Metrics Input**:
        * Height (with unit toggle Imperial/Metric).
        * Current Weight (with unit toggle Imperial/Metric).
        * Date of Birth / Age (needed for BMR calculation).
        * Gender (often used in BMR calculation).
    * **Desired Weight Input**: If goal is Lose/Gain (with unit toggle).
    * **Goal Pace**: How quickly user wants to reach goal (e.g., lbs/week), used to set calorie deficit/surplus.
    * **(Optional MVP Simplification):** Use a standard BMR/TDEE formula without workout frequency initially, or ask for a basic activity level (Sedentary, Light, Moderate, Active).
* **Outcome**: User profile created, initial calorie and macro goals calculated and stored.

## 2. Authentication (Essential for Data Persistence)
* **Purpose**: Allow users to create accounts and log in to save their data.
* **Functionality**:
    * Simple Sign Up (Email/Password).
    * Login.
* **React Native**: Basic forms, state management, integration with a backend service (e.g., Firebase Auth).

## 3. Home Screen (Core Dashboard - Simplified)
* **Purpose**: Display primary daily tracking info and provide access to logging.
* **Elements**:
    * **Header**: App name "FoodTrack".
    * **Calendar Strip**: Select date to view data (essential for daily tracking).
    * **Calorie Summary**: "Calories left" based on goal vs logged intake for the selected day.
    * **Macronutrient Tiles**: Protein, Carbs, Fat remaining for the selected day.
    * **Navigation Bar (MVP Version)**:
        * Home (Dashboard)
        * Log Food (+) - Central button or tab
        * Progress (Weight)
        * Settings
* **Exclusions from Full Outline for MVP**: Subscription Banner, Recently Logged section (can be added later).

## 4. Food Logging (Core Feature)
* **Purpose**: Allow users to log food intake.
* **Access**: Via "+" button/tab on Navigation Bar.
* **Functionality**:
    * **Food Database Page (MVP Version)**:
        * **Search Field**: Search a basic food database (requires integration, e.g., Open Food Facts or similar).
        * **Search Results**: Display matching foods with calories/macros per serving. Allow selection and quantity input.
        * **'Create Food' Button**: Navigate to a simple form to add custom foods (Name, Calories, Macros per serving) to the user's personal list ('My Foods').
        * **'My Foods' Tab/View**: List user-created foods for quick logging.
        * **Logging Action**: Button (+) next to search results/My Foods to add item to the selected day's log.
    * **Scan Food Page (Core AI Feature for MVP)**:
        * **Access**: Button within Food Logging flow.
        * **Permissions**: Request Camera access.
        * **Interface**: Simple camera view with overlay/guide. "Scan Now" button.
        * **AI Integration**: Capture image, send to AI service (e.g., Gemini) for food identification and nutritional estimation.
        * **Confirmation**: Display AI results (food name, estimated calories/macros) and allow user to confirm/edit before logging.
* **Exclusions for MVP**: Voice logging, meal creation, complex tabs ('Saved Scans', 'My Meals' initially).

## 5. Log Weight Page (Core Feature)
* **Purpose**: Allow users to record their weight.
* **Access**: Via Progress page or a dedicated button if needed.
* **Elements**:
    * Header: "Log Weight".
    * Input Field/Selector: Enter current weight.
    * Unit Toggle: Imperial/Metric.
    * Date Selection: Default to today, allow changing.
    * Save Button: Persist weight entry with date.

## 6. Progress Page (Simplified)
* **Purpose**: Show basic progress over time.
* **Elements**:
    * Header: "Progress".
    * **Current Weight Display**: Show the latest logged weight.
    * **Simple Weight Chart**: Basic line graph showing weight entries over time (e.g., last 30 days).
    * **Link/Button**: To navigate to "Log Weight" page.
* **Exclusions for MVP**: BMI card, complex time filters (90 days, 6 months etc.), Days Logged widget, calorie history charts, motivational messages.

## 7. Settings Page (Simplified)
* **Purpose**: Allow users to view/edit core profile data and goals.
* **Elements**:
    * Header: "Settings".
    * **Personal Data Display**: Show Age, Height, Current Weight (non-editable here, view only).
    * **Link**: "Edit Personal Details" -> Navigates to a screen to edit Height, DOB, Gender.
    * **Link**: "Adjust Goals" -> Navigates to a screen to manually edit daily Calorie, Protein, Carb, Fat goals (pre-filled with initially calculated values). Allow editing Goal Weight and Pace here too.
    * **Logout Button**.
    * **(Optional MVP):** Basic unit preference setting (Imperial/Metric) if not handled per input.
* **Exclusions for MVP**: Financial/Referral section, Preference toggles (rollover, live activity), Widget instructions, Language change.

## 8. Core Technical Backend/Infrastructure (MVP Needs)
* **Database**: To store user profiles, goals, food logs, weight logs (e.g., Firebase Firestore).
* **Basic Food Database**: Access to a public API (like Open Food Facts) or a curated initial database for search.
* **AI Service Integration**: API endpoint for the food scanning feature (e.g., Google Cloud Vision or Gemini).
* **React Native Setup**: Basic navigation, state management (Context API or Redux Toolkit), core components.

---

This MVP outline focuses on the essential loop: **Onboard -> Set Goals -> Log Food (Search/Create/Scan) -> Log Weight -> View Daily Status (Home) -> View Weight Trend (Progress) -> Adjust Profile/Goals (Settings)**. It includes the core AI differentiator (Scan Food) while deferring other complexities like exercise, advanced reporting, social features, and monetization.