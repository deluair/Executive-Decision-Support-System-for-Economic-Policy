import numpy as np
import pandas as pd
from statsmodels.tsa.vector_ar.var_model import VAR
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class EconomicModelService:
    def __init__(self):
        self.models = {}
        
    def prepare_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Prepare data for modeling by handling missing values and outliers"""
        # Remove outliers using IQR method
        Q1 = data.quantile(0.25)
        Q3 = data.quantile(0.75)
        IQR = Q3 - Q1
        data = data[~((data < (Q1 - 1.5 * IQR)) | (data > (Q3 + 1.5 * IQR))).any(axis=1)]
        
        # Fill missing values with forward fill then backward fill
        data = data.fillna(method='ffill').fillna(method='bfill')
        
        return data
    
    def train_var_model(self, data: pd.DataFrame, maxlags: int = 5) -> VAR:
        """Train a Vector Autoregression model"""
        model = VAR(data)
        results = model.fit(maxlags=maxlags, ic='aic')
        return results
    
    def forecast(self, model: VAR, steps: int = 12) -> pd.DataFrame:
        """Generate forecasts using the trained model"""
        forecast = model.forecast(model.y, steps=steps)
        return pd.DataFrame(forecast, columns=model.names)
    
    def run_monte_carlo(self, 
                       base_model: VAR,
                       n_simulations: int = 1000,
                       forecast_steps: int = 12) -> Dict[str, np.ndarray]:
        """Run Monte Carlo simulations for uncertainty quantification"""
        simulations = []
        for _ in range(n_simulations):
            # Add random noise to the forecast
            forecast = base_model.forecast(base_model.y, steps=forecast_steps)
            noise = np.random.normal(0, base_model.sigma_u, size=forecast.shape)
            simulation = forecast + noise
            simulations.append(simulation)
        
        simulations = np.array(simulations)
        
        # Calculate confidence intervals
        lower_ci = np.percentile(simulations, 2.5, axis=0)
        upper_ci = np.percentile(simulations, 97.5, axis=0)
        mean_forecast = np.mean(simulations, axis=0)
        
        return {
            "mean": mean_forecast,
            "lower_ci": lower_ci,
            "upper_ci": upper_ci,
            "simulations": simulations
        }
    
    def calculate_elasticity(self, 
                           model: VAR,
                           variable: str,
                           shock_size: float = 0.01) -> Dict[str, float]:
        """Calculate economic elasticity for a given variable"""
        # Get impulse response
        irf = model.irf(periods=20)
        
        # Calculate elasticity
        response = irf.irfs[1:, model.names.index(variable)]
        elasticity = response / shock_size
        
        return {
            "short_run": elasticity[0],
            "long_run": np.sum(elasticity),
            "max_impact": np.max(np.abs(elasticity))
        }
    
    def generate_risk_assessment(self,
                               forecast: pd.DataFrame,
                               historical_data: pd.DataFrame,
                               confidence_intervals: Dict[str, np.ndarray]) -> Dict:
        """Generate risk assessment based on forecast results"""
        # Calculate volatility
        historical_volatility = historical_data.std()
        forecast_volatility = forecast.std()
        
        # Assess risk levels
        risk_levels = {}
        for variable in forecast.columns:
            # Compare forecast volatility to historical
            vol_ratio = forecast_volatility[variable] / historical_volatility[variable]
            
            # Calculate probability of extreme outcomes
            ci_width = (confidence_intervals["upper_ci"][:, forecast.columns.get_loc(variable)] - 
                       confidence_intervals["lower_ci"][:, forecast.columns.get_loc(variable)])
            avg_ci_width = np.mean(ci_width)
            
            # Determine risk level
            if vol_ratio > 1.5 or avg_ci_width > 2 * historical_volatility[variable]:
                risk_level = "High"
            elif vol_ratio > 1.2 or avg_ci_width > 1.5 * historical_volatility[variable]:
                risk_level = "Medium"
            else:
                risk_level = "Low"
                
            risk_levels[variable] = {
                "level": risk_level,
                "volatility_ratio": vol_ratio,
                "confidence_interval_width": avg_ci_width
            }
            
        return risk_levels 