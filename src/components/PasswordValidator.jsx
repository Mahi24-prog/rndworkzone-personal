import React from 'react';

export const validatePassword = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
};

export const isPasswordValid = (password) => {
  const reqs = validatePassword(password);
  return Object.values(reqs).every(Boolean);
};

const PasswordValidator = ({ password }) => {
  const reqs = validatePassword(password);

  const Requirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-emerald-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
      <span className="material-symbols-outlined text-[16px]">
        {met ? 'check_circle' : 'radio_button_unchecked'}
      </span>
      <span>{text}</span>
    </div>
  );

  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border-slate/50 dark:border-white/10">
      <Requirement met={reqs.length} text="At least 8 characters" />
      <Requirement met={reqs.uppercase} text="One uppercase letter" />
      <Requirement met={reqs.number} text="One number" />
      <Requirement met={reqs.symbol} text="One special character" />
    </div>
  );
};

export default PasswordValidator;
