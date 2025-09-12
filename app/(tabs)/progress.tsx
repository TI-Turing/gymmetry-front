import React from 'react';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import ProgressDashboard from '@/components/progress/ProgressDashboard';
import { ErrorBoundary } from '@/components/common';

function ProgressScreen() {
  return (
    <ScreenWrapper headerTitle="Mi Progreso" showBackButton={false}>
      <ErrorBoundary
        onError={(_error, _errorInfo) => {
          // Error will be handled by the ErrorBoundary fallback UI
        }}
      >
        <ProgressDashboard />
      </ErrorBoundary>
    </ScreenWrapper>
  );
}

export default withWebLayout(ProgressScreen, { defaultTab: 'progress' });
//
