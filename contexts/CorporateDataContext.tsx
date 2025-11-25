import React, { createContext, useContext, ReactNode } from 'react';

// CorporateDataContext stub to resolve import errors
interface CorporateDataContextType {
  data: any;
  dateRange: string;
  isLoading: boolean;
  error: string | null;
  setDateRange: (range: string) => void;
  refreshData: () => void;
  clearCache: () => void;
}

const CorporateDataContext = createContext<CorporateDataContextType | null>(null);

export function CorporateDataProvider({ children }: { children: ReactNode }) {
  const contextValue: CorporateDataContextType = {
    data: null,
    dateRange: '30d',
    isLoading: false,
    error: null,
    setDateRange: () => {},
    refreshData: () => {},
    clearCache: () => {},
  };

  return (
    <CorporateDataContext.Provider value={contextValue}>
      {children}
    </CorporateDataContext.Provider>
  );
}

export function useCorporateData() {
  const context = useContext(CorporateDataContext);
  if (!context) {
    throw new Error('useCorporateData must be used within a CorporateDataProvider');
  }
  return context;
}