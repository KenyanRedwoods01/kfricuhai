import React from 'react';
import { AdvancedLayout } from '@/components/AdvancedLayout';
import DataGovernanceDashboard from '@/components/DataGovernanceDashboard';

const DataGovernancePage: React.FC = () => {
  return (
    <AdvancedLayout>
      <DataGovernanceDashboard />
    </AdvancedLayout>
  );
};

export default DataGovernancePage;