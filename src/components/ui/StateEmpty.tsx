import React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

export interface StateEmptyProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function StateEmpty({ 
  icon = 'inbox', 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ''
}: StateEmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center h-full w-full ${className}`}>
      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
        <Icon name={icon} size={30} className="text-text-secondary" />
      </div>
      <h3 className="text-headline-md text-text-primary mb-2">{title}</h3>
      <p className="text-body-md text-text-secondary max-w-md mb-6">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} icon="add">{actionLabel}</Button>
      )}
    </div>
  );
}
