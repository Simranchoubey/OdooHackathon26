import React, { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'ghost' | 'danger';
  isLoading?: boolean;
  icon?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm hover:shadow-md px-4 py-2 rounded-md text-label-md",
    secondary:
      "bg-surface-container-lowest border border-border-subtle text-text-primary hover:bg-surface-container-low hover:border-outline px-4 py-2 rounded-md text-label-md",
    icon:
      "p-2 rounded-md text-text-secondary hover:bg-surface-container-low hover:text-text-primary",
    ghost:
      "px-4 py-2 text-primary text-label-md hover:bg-primary/10 rounded-md",
    danger:
      "bg-error text-on-error hover:bg-error/90 shadow-sm hover:shadow-md px-4 py-2 rounded-md text-label-md",
  };

  const iconSize = variant === 'icon' ? 20 : 16;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Icon name="progress_activity" size={iconSize} className="animate-spin" />
      ) : icon ? (
        <Icon name={icon} size={iconSize} strokeWidth={2.25} />
      ) : null}
      {children}
    </button>
  );
}
