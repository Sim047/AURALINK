# Auralink Mobile (Expo)

Minimal React Native app wired to your existing backend.

## Prerequisites
- Node.js LTS
- Expo CLI (`npm i -g expo-cli`) or use `npx expo`
- Android Studio or Xcode for native run (optional)

## Configure
Set your backend URL in environment:

Windows PowerShell example:

```powershell
$env:EXPO_PUBLIC_API_URL = "https://auralink-backend.onrender.com/api"
$env:EXPO_PUBLIC_API_BASE = "https://auralink-backend.onrender.com"
```

Alternatively, set `extra.apiUrl` in `app.json`.

## Install & Run
```powershell
Push-Location "c:\Users\SK\Desktop\Auralink\mobile"
npm install
npx expo start
Pop-Location
```

- Press `a` for Android emulator, `i` for iOS (macOS), or scan QR with Expo Go.

## What’s included
- Login → stores token in axios default header
- Discover → lists events, join via `/events/:id/join`
- Socket client → listens to `participant_joined`

## Next steps
- Add React Navigation and more screens (Dashboard, My Events, Chat)
- Persist token securely (SecureStore)
- Theme + components
