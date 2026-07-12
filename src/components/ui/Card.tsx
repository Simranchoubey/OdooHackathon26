import React from 'react';

export function Card({ className = '', children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`bg-surface-container-lowest border border-border-subtle rounded-lg shadow-sm overflow-hidden flex flex-col ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`px-comfortable pt-comfortable pb-3 border-b border-border-subtle bg-surface-container-lowest ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children }: { className?: string, children: React.ReactNode }) {
  return <h3 className={`text-headline-sm text-text-primary ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children, noPadding = false }: { className?: string, children: React.ReactNode, noPadding?: boolean }) {
  return (
    <div className={`${noPadding ? '' : 'p-comfortable'} flex-1 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`px-comfortable py-3 border-t border-border-subtle bg-surface-container-lowest ${className}`}>
      {children}
    </div>
  );
}
