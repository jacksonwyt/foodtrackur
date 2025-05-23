# Foodtrack App: MVP Outline

## Core Premise for MVP:

Enable users to track daily calorie and macronutrient intake, log their weight, and set basic goals. Leverage AI for food scanning as a key differentiator.

## 1. Onboarding (Essential for Setup)

- **Purpose**: Collect essential user data to calculate initial calorie/macro goals.
- **Screens/Flow**:
  - **Welcome/Intro**: Brief app description.
  - **Goal Selection**: Lose weight, Maintain, Gain weight.
  - **User Metrics Input (`app/Onboarding/Details.tsx`)**:
    - Height (with unit toggle Imperial/Metric - CM/FT_IN, **Implemented**).
    - Current Weight (with unit toggle Imperial/Metric - KG/LBS, **Implemented**).
    - Age (input as years, converted to YYYY-01-01 DOB string for calculations, **Implemented**).
    - Gender (male, female, other - **Implemented**).
  - **Desired Weight Input**: If goal is Lose/Gain (with unit toggle). **Implemented (Optional field in `Details.tsx`, value stored in `profiles.goal_weight`)**.
  - **Goal Pace**: How quickly user wants to reach goal (e.g., lbs/week). Used to set calorie deficit/surplus. **Implemented (Optional field in `Details.tsx`, value stored in `profiles.goal_pace`; calorie adjustment logic based on this pace is for future refinement beyond fixed +/- 500 kcal)**.
  - **Activity Level**: (Sedentary, Light, Moderate, Active, Extra Active - **Implemented**).
- **Calculations (`src/utils/calculations.ts`)**:
  - Mifflin-St Jeor BMR/TDEE calculation **Implemented**.
  - Calorie adjustment for goals **Implemented** (fixed +/- 500, `goalPace` input now captured for future refinement of adjustment).
  - Macronutrient split (e.g., 40/30/30) **Implemented**.
- **Outcome**: User profile created (`src/services/profileService.ts` - `createProfile` on sign-up, `updateProfile` with onboarding data), initial calorie and macro goals calculated and stored in `profiles` table (including new `goal_weight`, `goal_pace`). **Largely Implemented & Verified (pending final `userId` integration in `Details.tsx`).**

## 2. Authentication (Essential for Data Persistence)

- **Purpose**: Allow users to create accounts and log in to save their data.
- **Functionality**:
  - Simple Sign Up (Email/Password).
  - Login.
- **React Native**: Basic forms, state management (`src/store/slices/authSlice.ts`), integration with Supabase Auth (`src/services/auth/authService.ts`). **Implemented & Verified.**

## 3. Home Screen (Core Dashboard - Simplified)

- **Purpose**: Display primary daily tracking info and provide access to logging.
- **Elements (`app/Home/index.tsx`)**:
  - **Header**: App name "FoodTrack" (via `<Logo />`).
  - **Calendar Strip (`src/components/items/CalendarStrip.tsx`)**: Select date to view data.
  - **Calorie Summary (`src/components/cards/CalorieSummary.tsx`)**: "Calories left" based on goal vs logged intake for the selected day.
  - **Macronutrient Tiles (`src/components/cards/MacroTiles.tsx`)**: Protein, Carbs, Fat remaining for the selected day.
  - **Data Hook (`src/hooks/useHomeSummaryData.ts`)**: Fetches profile goals and daily food logs. Calculation `log.calories * log.serving_size` confirmed correct based on logging flow.
- **Navigation Bar (MVP Version)**: (App-level: Home, Log Food (+), Progress, Settings).
- **Exclusions from Full Outline for MVP**: Subscription Banner, Recently Logged section.
- **Refinements Status**:
  - Passing selected calendar date to food logging flow: **Implemented (`HomeScreen` sets `selectedDateISO` param, "Add" tab listener in `App.tsx` reads it and passes to `FoodLogHubScreen`).**
  - Data refresh after logging: **Implemented (via `useFocusEffect` in `HomeScreen` calling `refetchData` from `useHomeSummaryData`).**
- **Status**: **Implemented & Verified.**

## 4. Food Logging (Core Feature)

- **Purpose**: Allow users to log food intake.
- **Access**: Via "+" button/tab on Navigation Bar, leading to `FoodLogHubScreen` (`app/FoodDB/index.tsx`). Hub passes `dateToLog` (from Home screen calendar or defaults to today) to sub-flows. **`dateToLog` propagation from Home implemented.**
- **Functionality**:
  - **Food Database Search & Logging**:
    - **Search Screen (`app/FoodDB/search.tsx`)**:
      - Search Field: Searches custom foods and FatSecret (`src/services/fatsecretService.ts` - `searchFatSecretFood`).
      - Search Results: Displays combined results. Custom foods listed first/integrated.
      - **FatSecret Item Selection**: Navigates to `FoodDetailsScreen` with `foodId` and `dateToLog`.
      - **Custom Food Item Selection**: Navigates to `LogEntryScreen` with `FoodLogItemData` and `dateToLog`.
    - **FatSecret Details & Logging (`app/FoodDB/FoodDetailsScreen.tsx` - New)**:
      - Fetches full item details (`src/services/fatsecretService.ts` - `getFatSecretFoodDetails` **Implemented**).
      - Allows selection from multiple serving sizes provided by FatSecret.
      - Quantity input for selected serving.
      - Logs using `addFoodLog`, with `calories` being for the selected serving and `serving_size` being user's quantity. **Implemented.**
    - **Custom Food/AI Result Logging (`app/FoodDB/LogEntryScreen.tsx` - New)**:
      - Receives `FoodLogItemData` (name, nutrition per defined serving, unit) and `dateToLog`.
      - Quantity input for the number of defined servings.
      - Logs using `addFoodLog`, with `calories` being for the defined serving and `serving_size` being user's quantity. **Implemented.**
  - **Manual Food Entry**: **Implemented (Covered by 'Create Custom Food' functionality using `app/FoodDB/add.tsx`).**
  - **Barcode Scanning Integration**: (`app/Scan/index.tsx`, `app/Scan/scan.tsx`, `src/components/scan/BarcodeScanner.tsx`, `src/services/openFoodFactsService.ts` (`getFoodByBarcode`)) - **Not Implemented (key component `BarcodeScanner.tsx` and service `openFoodFactsService.ts` are missing; `app/Scan/scan.tsx` also missing. Existing `CameraView.tsx` in `app/Scan/index.tsx` is for general image capture, not barcode specific).**
  - **'Create Custom Food' (`app/FoodDB/add.tsx`)**:
    - Navigated from `FoodLogHubScreen` (`app/FoodDB/index.tsx`) and `FoodSearchScreen` (`app/FoodDB/search.tsx`).
    - Form for Name, Calories, Macros _per user-defined serving_ (e.g., "1 slice", "100g"). These define the `CustomFood` item.
    - Saves to `custom_foods` table via `customFoodService.ts`. Not for direct logging of quantity consumed. **Largely Implemented & Verified.**
  - **'My Foods' Tab/View**: Integrated into `FoodSearchScreen` (custom foods listed and searchable). **Implemented.**
  - **Scan Food Page (Core AI Feature for MVP)**:
    - **Access**: Button within `FoodLogHubScreen`. `dateToLog` is correctly passed from `FoodLogHubScreen` (which receives it from Home or defaults to today). **Implemented.**
    - **Permissions & Camera View (`app/Scan/index.tsx`, `src/components/scan/CameraView.tsx`, `src/hooks/useCameraPermission.ts`)**: **Implemented.**
    - **Image Capture (`src/hooks/useScanScreenActions.ts`)**: Captures image URI and base64, was intended to navigate to `ScanConfirmScreen`, passing `dateToLog`. **Image capture logic Implemented.**
    - **AI Integration & Confirmation (`app/Scan/confirm.tsx` - Missing File)**:
      - Display captured image: **Not Implemented (part of missing `confirm.tsx`).**
      - Call AI service (`src/services/ai/geminiService.ts` - `analyzeFoodImageWithGemini`) with image data. **Service Implemented.**
      - **`geminiService.ts` - `analyzeFoodImageWithGemini`**: Implementation to call Gemini and parse response into `FoodLogItemData` (name, calories per defined serving, protein, carbs, fat, unit). **Implemented.**
      - Display AI results (food name, estimated calories/macros): **Not Implemented (part of missing `confirm.tsx`).**
      - Allow user to confirm/edit results: **Not Implemented (confirmation would be part of missing `confirm.tsx`, editing deferred post-MVP).**
      - On confirmation, navigate to `LogEntryScreen` with AI-derived `FoodLogItemData` and `dateToLog`: **Not Implemented (dependent on missing `confirm.tsx`).**
- **Exclusions for MVP**: Voice logging, meal creation, complex tabs ('Saved Scans', 'My Meals' initially).
- **Status**: Database/Custom food logging path is **Largely Implemented**. AI Scan path is **Partially Implemented (backend/service AI logic and camera capture implemented, but user-facing confirmation/results screen `confirm.tsx` is missing, blocking completion of the flow).** `dateToLog` propagation for all flows is **Implemented.**

## 5. Log Weight Page (Core Feature)

- **Purpose**: Allow users to record their weight.
- **Access**: Via Progress page (`app/Weight/index.tsx`) button. **Implemented.**
- **Screen**: `app/Weight/LogWeightScreen.tsx` **Implemented.**
- **Elements**:
  - Header: "Log Weight". **Implemented.**
  - Input Field/Selector: Enter current weight. **Implemented.**
  - Unit Toggle: Imperial/Metric. **Implemented.**
  - Date Selection: Default to today, allow changing. **Implemented.**
  - Save Button: Persist weight entry with date (via `src/services/weightLogService.ts`). **Implemented.**
- **Status**: **Implemented & Verified.**

## 6. Progress Page (Simplified)

- **Purpose**: Show basic progress over time.
- **Screen**: `app/Weight/index.tsx` (Refactored to be solely Progress display). **Implemented.**
- **Elements**:
  - Header: "Weight Progress". **Implemented.**
  - **Current Weight Display**: Show the latest logged weight (via `WeightChartCard`). **Implemented.**
  - **Simple Weight Chart**: Basic line graph showing weight entries over time (via `WeightChartCard`). **Implemented.**
  - **Link/Button**: To navigate to "Log Weight" page (`LogWeightScreen.tsx`). **Implemented.**
- **Status**: **Implemented & Verified.** (Uses `weightLogService.ts` via hooks).
- **Exclusions for MVP**: BMI card, complex time filters, Days Logged widget, calorie history charts, motivational messages.

## 7. Settings Page (Simplified)

- **Purpose**: Allow users to view/edit core profile data and goals.
- **Elements**:
  - Header: "Settings".
  - **Personal Data Display**: Show Age, Height, Current Weight (view only). _(Note: Current weight display on main settings page is not explicitly implemented, but individual data points are editable in sub-screens)._ (This is present in `app/Settings/index.tsx`
