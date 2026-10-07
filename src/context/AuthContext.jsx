import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) { setLoading(false); return undefined; }
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const ref = doc(db, "players", nextUser.uid);
      return onSnapshot(ref, async (snap) => {
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          const fallback = {
            uid: nextUser.uid,
            username: nextUser.displayName || nextUser.email?.split("@")[0] || "Player",
            email: nextUser.email || "",
            avatar: (nextUser.displayName || nextUser.email || "P").slice(0, 1).toUpperCase(),
            totalGames: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            points: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(ref, fallback, { merge: true });
          setProfile(fallback);
        }
        setLoading(false);
      }, () => setLoading(false));
    });
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    logout: () => signOut(auth),
  }), [user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
