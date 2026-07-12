import React from 'react';
import { Icon } from './Icon';

export interface AlertProps {
  variant?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export function Alert({
  variant = 'warning',
  title,
  children,
  icon,
  className = ''
}: AlertProps) {
  const baseClasses = "border rounded-lg p-comfortable flex items-start gap-3";

  const variantClasses = {
    info: "bg-info/10 text-info border-info/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-error/10 text-error border-error/20",
    success: "bg-success/10 text-success border-success/20",
  };

  const defaultIcons = {
    info: "info",
    warning: "warning",
    danger: "error",
    success: "check_circle",
  };

  const selectedIcon = icon || defaultIcons[variant];

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="alert">
      {selectedIcon && (
        <Icon name={selectedIcon} size={20} strokeWidth={2.25} className="shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        {title && <h5 className="text-body-md font-bold mb-1">{title}</h5>}
        <div className="text-body-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
