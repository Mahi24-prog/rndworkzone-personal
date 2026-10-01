import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Loader from './Loader';
const EmailVerificationBanner = ({ profile }) => {
  const [verifyStatus, setVerifyStatus] = useState('idle'); // idle, sending, sent, verifying, success
  const [verifyError, setVerifyError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsVerified(profile.is_email_verified === true);
    }
  }, [profile]);

  const handleSendVerification = async () => {
    setVerifyStatus('sending');
    setVerifyError("");
    try {
      const { data, error } = await supabase.functions.invoke('verify-email', {
        body: { action: 'send' }
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to send email");
      setVerifyStatus('sent');
    } catch (err) {
      setVerifyError(err.message || "Failed to send verification email.");
      setVerifyStatus('idle');
    }
  };

  const handleVerifyCode = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setVerifyError("Please enter a valid 6-digit code");
      return;
    }
    
    setVerifyStatus('verifying');
    setVerifyError("");
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-email', {
        body: { action: 'verify', code: otpCode }
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Invalid code");
      
      setVerifyStatus('success');
      setIsVerified(true);
    } catch (err) {
      setVerifyError(err.message || "Invalid or expired code.");
      setVerifyStatus('sent');
    }
  };

  if (isVerified || !profile) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all duration-300">
      <div className="flex items-start gap-3 w-full">
        <span className="material-symbols-outlined text-amber-600 mt-0.5">
          {verifyStatus === 'success' ? 'check_circle' : 'warning'}
        </span>
        <div className="w-full">
          <h3 className="font-bold text-amber-800 dark:text-amber-400">
            {verifyStatus === 'success' ? 'Email verified successfully!' : 'Your email is not verified.'}
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-500/80 mt-1">
            {verifyStatus === 'success' 
              ? 'Thank you for verifying your email address.' 
              : 'Please verify your email to ensure you receive notifications about your requirements.'}
          </p>
          {verifyError && <p className="text-error text-xs font-medium mt-2">{verifyError}</p>}
          
          {verifyStatus === 'sent' || verifyStatus === 'verifying' ? (
            <div className="mt-3 flex items-center gap-2 max-w-sm">
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="px-3 py-2 bg-white dark:bg-dark-navy border border-amber-300 dark:border-amber-700 rounded-md text-sm w-40 focus:outline-none focus:border-amber-500 text-black dark:text-white"
              />
              <button 
                onClick={handleVerifyCode}
                disabled={verifyStatus === 'verifying' || otpCode.length !== 6}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {verifyStatus === 'verifying' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size="sm" color="white" /> Verifying...
                  </span>
                ) : (
                  'Submit Code'
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      
      {verifyStatus === 'idle' || verifyStatus === 'sending' ? (
        <button 
          onClick={handleSendVerification}
          disabled={verifyStatus === 'sending'}
          className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-lg font-bold text-sm transition-colors shrink-0 disabled:opacity-50 whitespace-nowrap"
        >
          {verifyStatus === 'sending' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader size="sm" color="accent" /> Sending...
            </span>
          ) : (
            "Verify Email"
          )}
        </button>
      ) : null}
    </div>
  );
};

export default EmailVerificationBanner;
