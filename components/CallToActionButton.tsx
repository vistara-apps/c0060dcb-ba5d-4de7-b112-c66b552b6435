'use client';

import { Button } from '@/components/ui/Button';
import { ButtonVariant } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CallToActionButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function CallToActionButton({
  variant = 'primary',
  children,
  onClick,
  disabled,
  className,
  icon
}: CallToActionButtonProps) {
  return (
    <Button
      variant={variant}
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full relative overflow-hidden group',
        'transform hover:scale-105 active:scale-95',
        'transition-all duration-200',
        variant === 'primary' && 'bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90',
        className
      )}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon && <span>{icon}</span>}
        <span className="font-semibold">{children}</span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
    </Button>
  );
}
