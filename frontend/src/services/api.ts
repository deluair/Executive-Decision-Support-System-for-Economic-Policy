const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Economic Indicators
  async getEconomicIndicators() {
    return this.request('/api/v1/economic/indicators');
  }

  // Forecast Data
  async getForecastData(periods: number = 12) {
    return this.request(`/api/v1/economic/forecast?periods=${periods}`);
  }

  // Risk Assessment
  async getRiskAssessment() {
    return this.request('/api/v1/economic/risk-assessment');
  }

  // Market Data
  async getMarketData(symbols?: string[]) {
    const symbolsParam = symbols ? `?symbols=${symbols.join(',')}` : '';
    return this.request(`/api/v1/economic/market-data${symbolsParam}`);
  }

  // Economic Analysis
  async getEconomicAnalysis(modelType: string, timeHorizon: string = '12-months') {
    return this.request(`/api/v1/economic/analysis/${modelType}?time_horizon=${timeHorizon}`);
  }

  // Scenario Management
  async createScenario(scenarioData: any) {
    return this.request('/api/v1/economic/scenarios/create', {
      method: 'POST',
      body: JSON.stringify(scenarioData),
    });
  }

  async getScenarioResults(scenarioId: number) {
    return this.request(`/api/v1/economic/scenarios/${scenarioId}/results`);
  }

  // Health Check
  async healthCheck() {
    return this.request('/api/v1/economic/health');
  }

  // Generic Data Fetcher with Fallback
  async fetchWithFallback<T>(
    primaryFetch: () => Promise<T>,
    fallbackData: T,
    errorMessage: string = 'Failed to fetch data'
  ): Promise<T> {
    try {
      return await primaryFetch();
    } catch (error) {
      console.warn(`${errorMessage}. Using fallback data:`, error);
      return fallbackData;
    }
  }
}

export const apiService = new ApiService();
export default apiService; 