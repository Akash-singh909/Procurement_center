# Setup Instructions

## Frontend (Expo SDK 54)
1. `npm install`
2. `npx expo start`

## Backend (Express + Firebase)
1. `cd backend`
2. `npm install express cors firebase-admin dotenv`
3. Add `serviceAccountKey.json`
4. `node index.js`

## Build APK
`npx eas build -p android --profile production`

## NativeWind
Tailwind config: `tailwind.config.js`
Global CSS: `app/global.css`
Metro config updated for nativewind.
