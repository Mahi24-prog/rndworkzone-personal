import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      // Fetch role to determine routing
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileData?.role === "super_admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Google sign in redirects automatically, so we don't need to navigate here
    } catch (error) {
      setError(error.message);
    }
  };

  const inputClasses =
    "block w-full px-5 py-4 text-on-surface dark:text-white bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:ring-0 focus:border-accent-blue dark:focus:border-accent-blue focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300";
  const labelClasses =
    "block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white";

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <Navigation />

      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-xl mx-auto">
        <div className="bg-surface-container-lowest dark:bg-white/5 rounded-3xl p-6 md:p-10 shadow-lg border border-border-slate/50 dark:border-white/10 backdrop-blur-lg relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-primary dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant dark:text-on-surface-variant">
              Sign in to manage your research requirements.
            </p>
          </div>

          {error && (
            <div className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm font-medium border border-error/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block font-bold text-sm tracking-wide text-on-surface dark:text-white"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-accent-blue hover:underline text-sm font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-white/50 hover:text-on-surface dark:hover:text-white transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary  text-white dark:bg-white/10 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size="sm" color="white" /> Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-border-slate/50 dark:border-white/10"></div>
            <span className="px-4 text-sm text-on-surface-variant dark:text-on-surface-variant font-medium">
              OR
            </span>
            <div className="flex-1 border-t border-border-slate/50 dark:border-white/10"></div>
          </div> */}

          {/* <button
            onClick={handleGoogleSignIn}
            type="button"
            className="mt-8 w-full bg-white dark:bg-white/5 border border-border-slate dark:border-white/10 text-on-surface dark:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button> */}

          <p className="text-center mt-8 text-on-surface-variant dark:text-on-surface-variant font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent-blue hover:underline font-bold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
