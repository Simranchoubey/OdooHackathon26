import React, { InputHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: string;
  helperText?: string;
}

export function Input({ icon, error, helperText, className = '', ...props }: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            <Icon name={icon} size={18} />
          </span>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : 'px-3'} pr-4 py-2 bg-surface-container-lowest border ${error ? 'border-error focus:border-error focus:ring-error' : 'border-border-subtle focus:border-primary focus:ring-primary'} rounded-md text-body-sm text-text-primary focus:ring-1 outline-none transition-all placeholder:text-text-secondary/60 disabled:bg-surface-container-low disabled:text-text-secondary disabled:cursor-not-allowed`}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-error text-label-md mt-1.5 flex items-center gap-1">
          <Icon name="error" size={12} strokeWidth={2.5} />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-text-secondary text-label-md mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
}
