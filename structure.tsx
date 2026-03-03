
// ```
// ---

// ## 📁 Step 4 — Your Target Structure

// After cleanup, your project should look like this:
// ```
// shamba/
// ├── app/
// │   ├── _layout.tsx          # Root layout (fonts, auth gate)
// │   ├── index.tsx            # Redirects to auth or tabs
// │   ├── auth/
// │   │   ├── splash.tsx       # Splash / onboarding
// │   │   ├── login.tsx        # Login screen
// │   │   ├── signup.tsx       # Sign up screen
// │   │   ├── forgot-password.tsx
// │   │   ├── otp.tsx
// │   │   ├── farm-setup.tsx   # Onboarding step 1
// │   │   └── experience-setup.tsx # Onboarding step 2
// │   └── (tabs)/
// │       ├── _layout.tsx      # Tab bar config
// │       ├── index.tsx        # Dashboard (Home tab)
// │       ├── logs.tsx         # Log Activity tab
// │       ├── reports.tsx      # Reports tab
// │       ├── chat.tsx         # AI Advisor tab
// │       └── profile.tsx      # Profile tab
// │
// ├── components/
// │   ├── common/
// │   │   ├── Button.tsx       # Primary, ghost, outline variants
// │   │   ├── Input.tsx        # Shamba styled input
// │   │   ├── Card.tsx         # Surface card component
// │   │   └── Badge.tsx        # Status badges
// │   ├── forms/
// │   │   └── ActivityForm.tsx
// │   └── charts/
// │       └── YieldChart.tsx
// │
// ├── context/
// │   └── AuthContext.tsx      # Firebase auth state
// │
// ├── services/
// │   ├── firebase.ts          # Firebase config
// │   ├── authService.ts       # Auth functions
// │   ├── logService.ts        # Farm log API calls
// │   └── aiService.ts         # AI API calls
// │
// ├── hooks/
// │   ├── use-color-scheme.ts  # (keep — Expo default)
// │   └── useAuth.ts           # Auth state hook
// │
// ├── constants/
// │   ├── theme.ts             # (already exists — we'll update)
// │   └── colors.ts            # Shamba color palette
// │
// └── assets/
//     ├── fonts/
//     ├── icons/
//     └── images/