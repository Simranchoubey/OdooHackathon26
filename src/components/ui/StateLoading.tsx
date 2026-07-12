import React from 'react';
import { Icon } from './Icon';

export interface StateLoadingProps {
  message?: string;
  className?: string;
}

export function StateLoading({ message = "Loading...", className = '' }: StateLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center h-full w-full ${className}`}>
      <Icon name="progress_activity" size={32} className="text-primary animate-spin mb-4" />
      {message && <p className="text-body-md text-text-secondary">{message}</p>}
    </div>
  );
}
