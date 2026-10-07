import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isSignup = mode === "signup";

  useEffect(() => {
    if (!loading && user) navigate(location.state?.from || "/", { replace: true });
  }, [user, loading, navigate, location.state]);

  const change = e => setForm(v => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (isSignup && form.username.trim().length < 2) return setError("Choose a username with at least 2 characters.");
    if (form.password.length < 6) return setError("Password must contain at least 6 characters.");
    if (isSignup && form.password !== form.confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
        const username = form.username.trim().slice(0, 20);
        await updateProfile(cred.user, { displayName: username });
        await setDoc(doc(db, "players", cred.user.uid), {
          uid: cred.user.uid,
          username,
          email: cred.user.email || "",
          avatar: username.slice(0, 1).toUpperCase(),
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          points: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      }
      navigate("/");
    } catch (err) {
      const code = err?.code || "";
      const messages = {
        "auth/email-already-in-use": "That email is already registered.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/weak-password": "Use a stronger password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/network-request-failed": "Network error. Check your connection.",
      };
      setError(messages[code] || "Authentication failed. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!form.email.trim()) return setError("Enter your email first.");
    setBusy(true); setError(""); setNotice("");
    try {
      await sendPasswordResetEmail(auth, form.email.trim());
      setNotice("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err?.code === "auth/user-not-found" ? "No account exists for that email." : "Unable to send the reset email.");
    } finally { setBusy(false); }
  };

  return <main className="auth-page">
    <div className="auth-glow auth-glow-a"/><div className="auth-glow auth-glow-b"/>
    <section className="auth-card">
      <Link to="/" className="auth-brand"><span>⌁</span><b>GameHub</b></Link>
      <div className="auth-heading"><span className="eyebrow">PLAY · CONNECT · COMPETE</span><h1>{isSignup ? "Create your account" : "Welcome back"}</h1><p>{isSignup ? "Create your player identity and start building your record." : "Sign in to keep your stats, scores and match history."}</p></div>
      <form onSubmit={submit} className="auth-form">
        {isSignup && <label>Username<input name="username" value={form.username} onChange={change} maxLength={20} autoComplete="username" placeholder="Your gamer name" required /></label>}
        <label>Email<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={change} autoComplete={isSignup ? "new-password" : "current-password"} placeholder="••••••••" required /></label>
        {isSignup && <label>Confirm password<input name="confirm" type="password" value={form.confirm} onChange={change} autoComplete="new-password" placeholder="••••••••" required /></label>}
        {error && <div className="auth-error">{error}</div>}
        {notice && <div className="auth-notice">{notice}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : isSignup ? "Create account →" : "Sign in →"}</button>
      </form>
      {!isSignup && <button className="auth-link-btn" onClick={reset} disabled={busy}>Forgot password?</button>}
      <div className="auth-switch">{isSignup ? "Already have an account?" : "New to GameHub?"} <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create account"}</Link></div>
      <Link to="/" className="auth-guest">Continue as guest</Link>
    </section>
  </main>;
}
