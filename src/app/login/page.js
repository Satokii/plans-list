"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import "../styles/login.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignUp = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError("Enter your email and create a password!");
    } else {
      alert("Check your email for a confirmation link!");
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else router.push("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Start Your Adventure</h1>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="sign-in-btn" onClick={handleSignIn}>
          Login
        </button>
        <button className="sign-up-btn" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
