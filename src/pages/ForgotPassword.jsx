import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "block w-full px-5 py-4 text-on-surface dark:text-white bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:ring-0 focus:border-accent-blue dark:focus:border-accent-blue focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300";
  const labelClasses = "block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white";

  return (
    <div className="bg-background text-on-background dark:bg-dark-navy dark:text-surface-container-lowest font-body-md transition-colors duration-300 min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-section-gap-lg px-margin-mobile md:px-gutter max-w-md mx-auto">
        <div className="bg-surface-container-lowest dark:bg-white/20 rounded-3xl p-6 md:p-10 shadow-lg border border-border-slate/50 dark:border-white/5 relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-primary dark:text-white mb-2">Reset Password</h1>
            <p className="text-on-surface-variant dark:text-on-surface-variant">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          {error && (
            <div className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm font-medium border border-error/20">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm font-medium border border-emerald-500/20">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={labelClasses}>Email Address</label>
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
            
            <button
              type="submit"
              disabled={loading}
              className="bg-primary  text-white dark:bg-white/10 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size="sm" color="white" /> Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-on-surface-variant dark:text-on-surface-variant font-medium">
            Remembered your password?{' '}
            <Link to="/signin" className="text-accent-blue hover:underline font-bold">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
