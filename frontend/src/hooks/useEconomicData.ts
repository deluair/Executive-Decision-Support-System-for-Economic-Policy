import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiService } from '@/services/api';

// Types
interface EconomicIndicator {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface ForecastData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    tension?: number;
    borderDash?: number[];
  }>;
}

interface RiskAssessment {
  title: string;
  level: 'High' | 'Medium' | 'Low';
  probability: number;
  impact: number;
  description: string;
}

interface Scenario {
  id: number;
  name: string;
  gdpGrowth: number;
  inflation: number;
  interestRate: number;
  unemploymentRate: number;
  isActive: boolean;
}

// Fallback data
const fallbackIndicators: EconomicIndicator[] = [
  { name: 'GDP Growth', value: 2.5, change: 0.3, trend: 'up' },
  { name: 'Inflation', value: 3.2, change: -0.1, trend: 'down' },
  { name: 'Unemployment', value: 4.8, change: -0.2, trend: 'down' },
  { name: 'Interest Rate', value: 2.0, change: 0.25, trend: 'up' },
];

const fallbackForecast: ForecastData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'GDP Growth',
      data: [2.5, 2.7, 2.8, 3.0],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'Inflation',
      data: [3.2, 3.1, 3.0, 2.9],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    },
  ],
};

const fallbackRisks: RiskAssessment[] = [
  {
    title: 'Economic Growth Risk',
    level: 'Medium',
    probability: 0.4,
    impact: 0.6,
    description: 'Potential slowdown in economic growth due to global factors',
  },
  {
    title: 'Inflation Risk',
    level: 'High',
    probability: 0.7,
    impact: 0.8,
    description: 'Rising inflation pressures from supply chain disruptions',
  },
];

// Custom hook for economic data
export const useEconomicData = () => {
  // Economic Indicators
  const { 
    data: indicatorsResponse, 
    error: indicatorsError, 
    mutate: mutateIndicators 
  } = useSWR(
    'economic-indicators',
    () => apiService.getEconomicIndicators(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      fallbackData: { indicators: fallbackIndicators },
      onError: (error: any) => console.warn('Failed to fetch indicators:', error)
    }
  );

  // Transform indicators data
  const indicators: EconomicIndicator[] = indicatorsResponse?.indicators 
    ? Object.entries(indicatorsResponse.indicators).map(([name, data]: [string, any]) => ({
        name,
        value: data.value,
        change: data.change,
        trend: data.trend,
      }))
    : fallbackIndicators;

  // Forecast Data
  const { 
    data: forecastData, 
    error: forecastError, 
    mutate: mutateForecast 
  } = useSWR(
    'economic-forecast',
    () => apiService.getForecastData(12),
    {
      refreshInterval: 600000, // Refresh every 10 minutes
      fallbackData: fallbackForecast,
      onError: (error: any) => console.warn('Failed to fetch forecast:', error)
    }
  );

  // Risk Assessment
  const { 
    data: riskResponse, 
    error: riskError, 
    mutate: mutateRisks 
  } = useSWR(
    'risk-assessment',
    () => apiService.getRiskAssessment(),
    {
      refreshInterval: 900000, // Refresh every 15 minutes
      fallbackData: { risks: fallbackRisks },
      onError: (error: any) => console.warn('Failed to fetch risks:', error)
    }
  );

  const riskAssessments: RiskAssessment[] = riskResponse?.risks || fallbackRisks;

  return {
    // Data
    indicators,
    forecastData: forecastData || fallbackForecast,
    riskAssessments,
    
    // Loading states
    isLoadingIndicators: !indicatorsResponse && !indicatorsError,
    isLoadingForecast: !forecastData && !forecastError,
    isLoadingRisks: !riskResponse && !riskError,
    
    // Error states
    indicatorsError,
    forecastError,
    riskError,
    
    // Refresh functions
    refreshIndicators: mutateIndicators,
    refreshForecast: mutateForecast,
    refreshRisks: mutateRisks,
    
    // Utility function to refresh all data
    refreshAll: () => {
      mutateIndicators();
      mutateForecast();
      mutateRisks();
    }
  };
};

// Hook for economic analysis data
export const useEconomicAnalysis = (modelType: string, timeHorizon: string = '12-months') => {
  const { 
    data: analysisData, 
    error: analysisError, 
    mutate: mutateAnalysis 
  } = useSWR(
    ['economic-analysis', modelType, timeHorizon],
    ([, model, horizon]) => apiService.getEconomicAnalysis(model, horizon),
    {
      refreshInterval: 900000, // Refresh every 15 minutes
      fallbackData: fallbackForecast,
      onError: (error) => console.warn('Failed to fetch analysis:', error)
    }
  );

  return {
    data: analysisData || fallbackForecast,
    isLoading: !analysisData && !analysisError,
    error: analysisError,
    refresh: mutateAnalysis,
  };
};

// Hook for scenario data
export const useScenarioData = (scenarioId: number) => {
  const { 
    data: scenarioData, 
    error: scenarioError, 
    mutate: mutateScenario 
  } = useSWR(
    ['scenario-results', scenarioId],
    ([, id]) => apiService.getScenarioResults(id),
    {
      refreshInterval: 600000, // Refresh every 10 minutes
      fallbackData: fallbackForecast,
      onError: (error) => console.warn('Failed to fetch scenario:', error)
    }
  );

  return {
    data: scenarioData || fallbackForecast,
    isLoading: !scenarioData && !scenarioError,
    error: scenarioError,
    refresh: mutateScenario,
  };
};

// Hook for market data
export const useMarketData = (symbols?: string[]) => {
  const { 
    data: marketData, 
    error: marketError, 
    mutate: mutateMarket 
  } = useSWR(
    ['market-data', symbols],
    ([, syms]) => apiService.getMarketData(syms),
    {
      refreshInterval: 60000, // Refresh every minute for market data
      fallbackData: { market_data: {} },
      onError: (error) => console.warn('Failed to fetch market data:', error)
    }
  );

  return {
    data: marketData?.market_data || {},
    isLoading: !marketData && !marketError,
    error: marketError,
    refresh: mutateMarket,
  };
};

// Hook for creating scenarios
export const useCreateScenario = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);

  const createScenario = async (scenarioData: Partial<Scenario>) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const result = await apiService.createScenario(scenarioData);
      return result;
    } catch (error) {
      setCreateError(error as Error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createScenario,
    isCreating,
    createError,
  };
};

// Health check hook
export const useHealthCheck = () => {
  const { 
    data: healthData, 
    error: healthError 
  } = useSWR(
    'health-check',
    () => apiService.healthCheck(),
    {
      refreshInterval: 30000, // Check every 30 seconds
      onError: (error) => console.warn('Health check failed:', error)
    }
  );

  return {
    isHealthy: healthData?.status === 'healthy',
    healthData,
    healthError,
  };
}; 