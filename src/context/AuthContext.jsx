import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function initFirebaseAuth() {
      if (!auth || !db) {
        setLoading(false);
        return;
      }

      try {
        const authMod = await import(new Function('return "firebase/auth"')());
        const firestoreMod = await import(new Function('return "firebase/firestore"')());

        if (!active) return;

        const { onAuthStateChanged, signOut } = authMod;
        const { doc, onSnapshot, setDoc, serverTimestamp } = firestoreMod;

        let stopProfile = () => {};
        const stopAuth = onAuthStateChanged(auth, (nextUser) => {
          if (!active) return;
          stopProfile();
          stopProfile = () => {};
          setUser(nextUser);

          if (!nextUser) {
            setProfile(null);
            setLoading(false);
            return;
          }

          const ref = doc(db, "players", nextUser.uid);
          stopProfile = onSnapshot(ref, async (snap) => {
            if (!active) return;
            if (snap.exists()) {
              setProfile(snap.data());
            } else {
              const fallback = {
                uid: nextUser.uid,
                username: nextUser.displayName || nextUser.email?.split("@")[0] || "Player",
                email: nextUser.email || "",
                avatar: (nextUser.displayName || nextUser.email || "P").slice(0, 1).toUpperCase(),
                totalGames: 0, wins: 0, losses: 0, draws: 0, points: 0,
                createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
              };
              await setDoc(ref, fallback, { merge: true });
              setProfile(fallback);
            }
            setLoading(false);
          }, () => {
            if (active) setLoading(false);
          });
        });

        return () => {
          active = false;
          stopProfile();
          stopAuth();
        };
      } catch (error) {
        console.warn('Firebase auth is unavailable in this build.', error);
        setLoading(false);
        return undefined;
      }
    }

    const cleanup = initFirebaseAuth();
    return () => {
      active = false;
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  const value = useMemo(() => ({
    user, profile, loading,
    logout: () => (auth ? import(new Function('return "firebase/auth"')()).then(({ signOut }) => signOut(auth)).catch(() => Promise.resolve()) : Promise.resolve()),
  }), [user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
