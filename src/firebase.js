const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
if (!firebaseConfigured) {
  console.warn("Firebase is not configured. Add the VITE_FIREBASE_* variables to your local .env and Vercel project settings.");
}

let app = null;
export let auth = null;
export let db = null;

if (firebaseConfigured) {
  (async () => {
    try {
      const firebaseAppMod = await import(new Function('return "firebase/app"')());
      const firebaseAuthMod = await import(new Function('return "firebase/auth"')());
      const firebaseFirestoreMod = await import(new Function('return "firebase/firestore"')());

      const { initializeApp } = firebaseAppMod;
      const { getAuth } = firebaseAuthMod;
      const { getFirestore } = firebaseFirestoreMod;

      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } catch (error) {
      console.warn('Firebase SDK could not be initialized. Auth and Firestore will be disabled until the dependency is installed.', error);
    }
  })();
}

export default app;
