import React from 'react';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import ProgressDashboard from '@/components/progress/ProgressDashboard';

function ProgressScreen() {
  return (
    <ScreenWrapper headerTitle="Mi Progreso" showBackButton={false}>
      <ProgressDashboard />
    </ScreenWrapper>
  );
}

export default withWebLayout(ProgressScreen, { defaultTab: 'progress' });
//
