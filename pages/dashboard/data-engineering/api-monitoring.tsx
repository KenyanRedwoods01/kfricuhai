import React from 'react';
import { AdvancedLayout } from '@/components/AdvancedLayout';
import APIMonitoringDashboard from '@/components/APIMonitoringDashboard';

const APIMonitoringPage: React.FC = () => {
  return (
    <AdvancedLayout>
      <APIMonitoringDashboard />
    </AdvancedLayout>
  );
};

export default APIMonitoringPage;