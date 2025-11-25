import React from 'react';
import { AdvancedLayout } from '@/components/AdvancedLayout';
import DataQualityDashboard from '@/components/DataQualityDashboard';

const DataQualityPage: React.FC = () => {
  return (
    <AdvancedLayout>
      <DataQualityDashboard />
    </AdvancedLayout>
  );
};

export default DataQualityPage;