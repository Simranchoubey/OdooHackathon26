import React from 'react';
import { Icon } from './Icon';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export function Badge({ variant = 'neutral', children, icon, className = '' }: BadgeProps) {
  const baseClasses = "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset";

  const variantClasses = {
    success: "bg-success/10 text-success ring-success/20",
    warning: "bg-warning/10 text-warning ring-warning/20",
    danger: "bg-error/10 text-error ring-error/20",
    info: "bg-info/10 text-info ring-info/20",
    neutral: "bg-surface-variant text-text-secondary ring-border-subtle",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {icon && <Icon name={icon} size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
