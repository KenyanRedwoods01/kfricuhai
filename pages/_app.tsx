import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import '@/styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// SWR configuration
const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2 * 1000,
  errorRetryCount: 3,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KPI Dashboard - Business Intelligence Analytics</title>
        <meta name="description" content="Advanced KPI Dashboard with document generation capabilities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem 
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <SWRConfig value={swrOptions}>
            <Component {...pageProps} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  theme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </SWRConfig>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}