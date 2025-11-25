import React from 'react';
import { AdvancedLayout } from '@/components/AdvancedLayout';
import DataObservabilityCenter from '@/components/DataObservabilityCenter';

const DataObservabilityPage: React.FC = () => {
  return (
    <AdvancedLayout>
      <DataObservabilityCenter />
    </AdvancedLayout>
  );
};

export default DataObservabilityPage;