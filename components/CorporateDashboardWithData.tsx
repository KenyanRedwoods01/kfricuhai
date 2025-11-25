import React from 'react';
import { CorporateDataProvider } from '@/contexts/CorporateDataContext';
import CorporateDashboard from '@/components/CorporateDashboard';
import CorporateAnalytics from '@/components/CorporateAnalytics';

interface CorporateDashboardWithDataProps {
  children?: React.ReactNode;
}

/**
 * Corporate Dashboard Wrapper with Data Engine Integration
 * 
 * This component wraps the CorporateDashboard and CorporateAnalytics components
 * with the CorporateDataProvider, providing real-time data from the Laravel backend
 * through the tRPC data engine.
 * 
 * Usage:
 * <CorporateDashboardWithData>
 *   <YourCustomComponents />
 * </CorporateDashboardWithData>
 */
const CorporateDashboardWithData: React.FC<CorporateDashboardWithDataProps> = ({ children }) => {
  return (
    <CorporateDataProvider>
      <div className="min-h-screen bg-gray-50">
        {children || (
          <div className="space-y-6">
            {/* Dashboard Tab */}
            <CorporateDashboard />
            
            {/* Analytics Tab */}
            <CorporateAnalytics />
          </div>
        )}
      </div>
    </CorporateDataProvider>
  );
};

export default CorporateDashboardWithData;