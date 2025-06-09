import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EconomicIndicator {
  id: number;
  indicator_type: string;
  value: number;
  timestamp: string;
  source: string;
  confidence_interval: number;
  metadata?: Record<string, any>;
}

export interface ForecastResult {
  forecast: Record<string, number[]>;
  confidence_intervals: {
    lower: number[][];
    upper: number[][];
  };
  elasticities: Record<string, {
    short_run: number;
    long_run: number;
    max_impact: number;
  }>;
  risk_assessment: Record<string, {
    level: string;
    volatility_ratio: number;
    confidence_interval_width: number;
  }>;
}

export interface Scenario {
  id: number;
  name: string;
  description: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  created_at: string;
  user_id: number;
}

export interface RiskAssessment {
  id: number;
  scenario_id: number;
  risk_level: string;
  probability: number;
  impact: number;
  description: string;
  mitigation_strategy: string;
  created_at: string;
}

export const economicApi = {
  // Economic Indicators
  getIndicators: async (): Promise<EconomicIndicator[]> => {
    const response = await api.get('/api/v1/indicators/');
    return response.data;
  },

  createIndicator: async (indicator: Omit<EconomicIndicator, 'id' | 'timestamp'>): Promise<EconomicIndicator> => {
    const response = await api.post('/api/v1/indicators/', indicator);
    return response.data;
  },

  // Forecasts
  generateForecast: async (variables: string[], forecast_steps: number = 12): Promise<ForecastResult> => {
    const response = await api.post('/api/v1/forecast/', {
      variables,
      forecast_steps,
    });
    return response.data;
  },

  // Scenarios
  getScenarios: async (): Promise<Scenario[]> => {
    const response = await api.get('/api/v1/scenarios/');
    return response.data;
  },

  createScenario: async (scenario: Omit<Scenario, 'id' | 'created_at' | 'user_id'>): Promise<Scenario> => {
    const response = await api.post('/api/v1/scenarios/', scenario);
    return response.data;
  },

  // Risk Assessments
  createRiskAssessment: async (
    assessment: Omit<RiskAssessment, 'id' | 'created_at'>
  ): Promise<RiskAssessment> => {
    const response = await api.post('/api/v1/risk-assessment/', assessment);
    return response.data;
  },
};

export default api; 