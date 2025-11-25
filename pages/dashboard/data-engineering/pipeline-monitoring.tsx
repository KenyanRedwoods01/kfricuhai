import React from 'react';
import { AdvancedLayout } from '@/components/AdvancedLayout';
import DataPipelineMonitoring from '@/components/DataPipelineMonitoring';

const PipelineMonitoringPage: React.FC = () => {
  return (
    <AdvancedLayout>
      <DataPipelineMonitoring />
    </AdvancedLayout>
  );
};

export default PipelineMonitoringPage;