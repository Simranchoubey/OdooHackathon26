import React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

export interface StateErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function StateError({ 
  title = "Something went wrong", 
  description = "We encountered an error loading this content.", 
  onRetry,
  className = ''
}: StateErrorProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center h-full w-full ${className}`}>
      <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center mb-4">
        <Icon name="error" size={30} className="text-error" />
      </div>
      <h3 className="text-headline-md text-text-primary mb-2">{title}</h3>
      <p className="text-body-md text-text-secondary max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon="refresh">Try Again</Button>
      )}
    </div>
  );
}
