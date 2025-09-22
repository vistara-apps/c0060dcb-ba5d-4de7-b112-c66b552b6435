'use client';

import { FrameWrapper } from '@/components/FrameWrapper';
import { CallToActionButton } from '@/components/CallToActionButton';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FrameWrapper>
      <div className="text-center space-y-lg py-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <div className="space-y-sm">
          <h2 className="text-2xl font-bold text-dark-text">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400">
            Don't worry, your habits are safe. Let's get you back on track.
          </p>
        </div>

        <div className="space-y-sm">
          <CallToActionButton
            onClick={reset}
            icon={<RefreshCw className="w-5 h-5" />}
          >
            Try Again
          </CallToActionButton>
          
          <CallToActionButton
            variant="secondary"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </CallToActionButton>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-lg text-left">
            <summary className="text-sm text-gray-400 cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="mt-sm p-sm bg-dark-surface rounded text-xs text-red-400 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </FrameWrapper>
  );
}
