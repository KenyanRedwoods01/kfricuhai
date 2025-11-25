import React from 'react';
import { AdvancedLayout } from '@/components/AdvancedLayout';
import RealTimeAnalytics from '@/components/RealTimeAnalytics';

const RealTimeAnalyticsPage: React.FC = () => {
  return (
    <AdvancedLayout>
      <RealTimeAnalytics />
    </AdvancedLayout>
  );
};

export default RealTimeAnalyticsPage;