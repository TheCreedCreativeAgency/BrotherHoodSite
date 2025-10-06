"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function SubscriptionLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/payment/subscription");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo - Using the provided login.png */}
        <div className="login-logo-container">
          <img src="/login.png" alt="Logo" className="login-logo-image" />
        </div>

        {/* Main Login Card - Updated design */}
        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="login-input-container">
              <div className="login-input-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Email ID"
                required
              />
            </div>

            {/* Password Field */}
            <div className="login-input-container">
              <div className="login-input-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="Password"
                required
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" className="login-checkbox" />
                Remember me
              </label>
              <a href="#" className="login-forgot">
                Forgot Password?
              </a>
            </div>

            {error && <div className="login-error">{error}</div>}
          </form>
        </div>

        {/* Login Button - Updated design */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="login-button"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        {/* Footer Links */}
        <div className="login-footer">
          <p className="login-footer-text">
            Don&apos;t have an account?{" "}
            <Link href="/payment/signup" className="login-signup-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
