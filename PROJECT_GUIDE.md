# KisanSewa — File-by-file Project Guide

This guide explains the major folders and files in the current `Procurement_center` repository, based on the published project structure and source files inspected. It is meant to help a developer or SIH reviewer understand where screens, state, integrations, and configuration live.

> **Important:** The repo is an Expo / React Native project, not a Vite React website. The primary user flow currently uses sample in-memory data. See the README for current limitations and local setup steps.

## 1. Main application: `app/`

Expo Router treats files in this directory as routes. Paths map to screens in the navigation structure.

| File | Responsibility | Notes |
|---|---|---|
| `app/_layout.js` | Defines the root Stack, screen titles, navigation animation, and status bar. | Lists the landing, farmer, and admin screens. This is where shared navigation presentation is configured. |
| `app/index.js` | Landing / role selection screen. | Offers Farmer and Admin cards and navigates to the relevant dashboard. In the current code this is a demo selector, not an access-control mechanism. |
| `app/farmer/dashboard.js` | Farmer dashboard and mandi list. | Reads mandi data from `store/useStore.js`, shows queue/capacity indicators and accepted crops, and routes to the booking screen. |
| `app/farmer/book.js` | Procurement-slot booking form. | Captures mandi, crop, quantity, date, and time. Validates the required fields and calls `bookSlot()` in the Zustand store. |
| `app/farmer/ticket.js` | Token details and QR display. | Reads a token from the local store, renders the QR code and shows a visual `Booked → Reached → Weighed → Paid` timeline. A missing token causes an alert and navigation back to the farmer dashboard. |
| `app/admin/dashboard.js` | Admin overview. | Reads data and aggregate values from Zustand. Shows expected-today, queue, reached, and weighed counts, mandi capacity, recent tokens, and a route to the scanner. The data is local demo state, not a live shared dashboard. |
| `app/admin/scanner.js` | Admin QR scanner. | Uses `expo-camera` permissions and QR detection; calls the store's `scanToken()` and marks a matching `Booked` token as `Reached`. The manual-entry button points to `/admin/manual-scan`; a matching route file was not found in the inspected paths. |
| `app/auth/login.js` | Firebase email/password login screen. | Uses `signInWithEmailAndPassword`. The current role-selection screen navigates directly to dashboards, so integrate and enforce authentication/role guards before representing the app as secure. |
| `app/config/firebase.js` | Initialises the Firebase client. | Reads `EXPO_PUBLIC_FIREBASE_*` values and exports Auth, Firestore, and Storage instances. Requires local Firebase environment configuration. |
| `app/global.css` | NativeWind/Tailwind global directives. | Includes Tailwind base, components, and utilities layers; Metro is configured to load this CSS input. |

### Screen navigation at a glance

- Landing screen: `app/index.js`
- Farmer: `app/farmer/dashboard.js` → `app/farmer/book.js` → `app/farmer/ticket.js`
- Admin: `app/admin/dashboard.js` → `app/admin/scanner.js`
- Login screen: `app/auth/login.js` exists, but is not enforced by the current landing-to-dashboard flow.

## 2. Local application state: `store/`

### `store/useStore.js`

This is the main state model for the demo. It uses Zustand and currently:

- Defines five preloaded sample mandi records with location, capacity, queue count, and accepted crops.
- Stores tokens in an in-memory array and keeps an `activeToken` reference.
- Creates a token ID and QR payload when `bookSlot()` is called.
- Increments the selected mandi's local queue count after booking.
- Updates status through `updateTokenStatus()`.
- Parses QR payloads in `scanToken()` and allows a matching token to transition from `Booked` to `Reached`.
- Computes admin summary values through `getAdminStats()`.

**Important:** No persistence middleware or Firestore write is shown in this store. Data created in one running app session is not automatically available to another device or after a process restart. Replace this demo store with a backend-backed repository for real procurement use.

## 3. Reusable UI: `components/`

### `components/ImageUploader.js`

Provides an image-picker button. It uses `expo-image-picker` to select an image, uploads the selected file to Firebase Storage, obtains a download URL, and passes that URL to the parent through `onUpload(url)`.

Before using it in a real flow, add robust error handling, loading feedback, file-size/type restrictions, and suitable Firebase Storage security rules.

## 4. Context state: `contexts/`

### `contexts/AuthContext.js`

Defines a lightweight React context with `user`, `login`, and `logout`. In the current code, `login(data)` merely stores the supplied data in React state and `logout()` clears it. This is not itself Firebase authentication and should not be treated as a secure identity provider. Verify whether it is used by screens before relying on it; the inspected login screen performs Firebase Auth directly.

## 5. Backend: `backend/`

The backend is an Express / Firebase Admin scaffold, not yet the source of truth for booking and scanning.

| File | Responsibility | Current implementation |
|---|---|---|
| `backend/index.js` | Creates the Express server, loads dotenv, enables JSON parsing and CORS, initialises Firebase Admin, mounts routes, and starts the server. | `GET /` is a health response. `GET /api/tokens` is mounted. `GET /api/admin/stats` reads the `stats/daily` Firestore document and uses the token-verification middleware. CORS currently allows all origins. |
| `backend/routes/tokenRoutes.js` | Defines token endpoints. | `GET /api/tokens` calls `controller.getAllTokens`. |
| `backend/controllers/tokenController.js` | Handles the token-list request. | Currently returns a placeholder message and an empty `data` array; it does not yet query real token records. |
| `backend/middleware/authMiddleware.js` | Verifies Firebase ID tokens sent in the `Authorization: Bearer ...` header. | Rejects missing or invalid tokens. Verification alone does not enforce that the user has the admin role. |

### Backend configuration notes

- The current repository root does not show a `backend/package.json`; initialise one in `backend/` before managing backend dependencies there.
- The backend requires Express, CORS, Firebase Admin, and dotenv.
- Firebase Admin needs a service-account credential file or configured credential source. Keep it private and never commit it.
- Add role-based authorisation, restrictive CORS, request validation, persistence, and error handling before public deployment.

## 6. Firebase and environment configuration

### `app/config/firebase.js`

Reads the Expo public variables below for the client Firebase app:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional in the current code)

Create a local root `.env` using your own Firebase project values and restart Expo after changes. Public client config should still be protected by Firebase Auth rules and Firestore/Storage security rules. Do not put service-account credentials in Expo public variables.

## 7. Assets and supporting directories

| Path | Purpose |
|---|---|
| `assets/images/` | App icon, Android adaptive-icon artwork, splash image, favicon, and related visual assets referenced by `app.json`. |
| `constants/` | Shared constants. Inspect exact files before changing values; filenames are not enumerated in this guide. |
| `hooks/` | Custom React hooks, if used by the app. Inspect individual files for their specific behaviour. |
| `scripts/reset-project.js` | Expo starter reset utility. **Use carefully:** it moves or deletes `app`, `components`, `hooks`, `scripts`, and `constants`, depending on the answer to its prompt, then creates a blank route structure. Back up first; do not run it as a normal start command. |
| `.claude/` | Claude-specific project settings or instructions. |
| `.vscode/` | Editor/workspace settings. |

## 8. Root configuration and documentation files

| File | Purpose |
|---|---|
| `package.json` | Defines the app scripts and dependencies. The current project uses `expo start`, `expo start --android`, `expo start --ios`, `expo start --web`, and `expo lint` scripts. |
| `package-lock.json` | npm lockfile for reproducible dependency installation. Let npm update it when dependencies change. |
| `app.json` | Expo app name (`KisanSewa`), slug, version, icon references, scheme, Android/iOS settings, Expo Router and Camera plugins, and experiments. |
| `babel.config.js` | Uses the Expo Babel preset and Reanimated plugin configuration. |
| `metro.config.js` | Configures Metro with NativeWind and `app/global.css`. |
| `tailwind.config.js` | Defines the app/components source globs, NativeWind preset, theme extension, and Tailwind plugins. |
| `postcss.config.js` | PostCSS configuration used by the Tailwind/NativeWind setup. |
| `eslint.config.js` | Expo ESLint configuration; excludes generated `dist` output. |
| `tsconfig.json` | TypeScript/editor configuration. Main routes currently use JavaScript despite TypeScript tooling being present. |
| `nativewind-env.d.ts` | Generated NativeWind type declaration; normally should not be edited. |
| `.gitignore` | Excludes dependency/build folders, local environment files, native signing material, and Firebase service-account JSON files. Keep the service-account ignore rules. |
| `COMPATIBILITY.md` | Notes on Expo SDK 54 and native dependency versions. Keep this aligned with the actual package versions: the document's Reanimated version differs from the version in `package.json` and should be reconciled. |
| `SETUP.md` | Quick setup notes for Expo and the backend. The backend setup should mention initialising `backend/package.json` if it is absent. |
| `SIH26032.md` | Project's SIH 26032 feature/status summary. It labels the problem framing as inferred from the app/master prompt, so verify the exact official problem-statement wording before using it in a formal submission. |
| `AGENTS.md` | Instructions for code agents; asks them to follow the versioned Expo SDK 54 documentation. |
| `CLAUDE.md` | Refers to the project-agent instructions. |
| `README.md` | Repository landing documentation. Replace the default Expo starter content with the KisanSewa project overview. |

## 9. How to run

### Mobile app

From the repository root:

```bash
npm install
npx expo start
```

### Backend (optional scaffold)

If `backend/package.json` does not exist:

```bash
cd backend
npm init -y
npm install express cors firebase-admin dotenv
node index.js
```

Configure the local service-account path before starting the backend. See the main README for Firebase environment examples and security cautions.

## 10. Recommended order of engineering work

1. Make the manual token-entry route real or remove the link to it.
2. Move token creation, capacity validation, scanning, and status updates to a persistent backend/Firestore layer.
3. Prevent overbooking using server-side atomic/transactional checks.
4. Connect Firebase Auth to navigation and implement verified farmer/admin roles on both client and server.
5. Complete and persist `Weighed` and `Paid` transitions.
6. Add translations, notifications, tests, observability, and production security rules.

For the reviewer-facing overview and demo script, see [`README.md`](./README.md).
