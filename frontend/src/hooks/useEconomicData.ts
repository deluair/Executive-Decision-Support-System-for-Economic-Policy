import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { economicApi, EconomicIndicator, ForecastResult, Scenario } from '@/services/api';

export const useEconomicData = () => {
  // Fetch economic indicators
  const { data: indicators, error: indicatorsError, mutate: mutateIndicators } = useSWR<EconomicIndicator[]>(
    '/api/v1/indicators/',
    () => economicApi.getIndicators()
  );

  // State for forecast
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<Error | null>(null);

  // State for scenarios
  const { data: scenarios, error: scenariosError, mutate: mutateScenarios } = useSWR<Scenario[]>(
    '/api/v1/scenarios/',
    () => economicApi.getScenarios()
  );

  // Generate forecast
  const generateForecast = async (variables: string[], forecast_steps: number = 12) => {
    try {
      setForecastLoading(true);
      setForecastError(null);
      const result = await economicApi.generateForecast(variables, forecast_steps);
      setForecast(result);
    } catch (error) {
      setForecastError(error as Error);
    } finally {
      setForecastLoading(false);
    }
  };

  // Create new scenario
  const createScenario = async (scenarioData: Omit<Scenario, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const newScenario = await economicApi.createScenario(scenarioData);
      await mutateScenarios();
      return newScenario;
    } catch (error) {
      throw error;
    }
  };

  // Create new indicator
  const createIndicator = async (indicatorData: Omit<EconomicIndicator, 'id' | 'timestamp'>) => {
    try {
      const newIndicator = await economicApi.createIndicator(indicatorData);
      await mutateIndicators();
      return newIndicator;
    } catch (error) {
      throw error;
    }
  };

  return {
    // Indicators
    indicators,
    indicatorsError,
    createIndicator,
    
    // Forecast
    forecast,
    forecastLoading,
    forecastError,
    generateForecast,
    
    // Scenarios
    scenarios,
    scenariosError,
    createScenario,
  };
}; 