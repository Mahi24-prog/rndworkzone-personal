import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';
const ForcePasswordChange = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, profile, updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Update the password
      const { error: passwordError } = await updatePassword(newPassword);
      if (passwordError) throw passwordError;

      // 2. Remove the requires_password_change flag from profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ requires_password_change: false })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 3. Show success notification
      setSuccess(true);
      
      // 4. Force a full page reload after a short delay so they see the success message
      setTimeout(() => {
        if (profile?.role === 'expert') {
          window.location.href = '/admin/requirements';
        } else {
          window.location.href = '/dashboard';
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-lowest dark:bg-white/5 border border-border-slate/50 dark:border-white/10 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent-blue/10 flex items-center justify-center mx-auto mb-4 text-accent-blue">
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-primary dark:text-white mb-2">
            Change Default Password
          </h2>
          <p className="text-on-surface-variant dark:text-on-surface-variant text-sm">
            For security reasons, you must change your password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-xl text-sm font-medium border border-error/20">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 p-4 rounded-xl text-sm font-bold border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Password updated successfully! Redirecting...
            </div>
          )}

          <div>
            <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">New Password</label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-5 py-3.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-sm tracking-wide text-on-surface dark:text-white">Confirm New Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-5 py-3.5 bg-black/5 dark:bg-white/5 border border-border-slate dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue text-sm text-on-surface dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-white/20 rounded-xl font-bold transition-all shadow-md hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader size="sm" color="white" /> Updating Password...
              </span>
            ) : (
              'Update Password & Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;
