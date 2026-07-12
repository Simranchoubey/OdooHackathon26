import React from 'react';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  overline?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, overline, children, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-comfortable mb-container ${className}`}>
      <div>
        {overline && <div className="text-label-md text-text-secondary uppercase tracking-wider mb-1">{overline}</div>}
        <h1 className="text-headline-lg text-text-primary flex items-center gap-2">{title}</h1>
        {subtitle && <div className="text-body-md text-text-secondary mt-1">{subtitle}</div>}
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
