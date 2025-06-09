import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any

def generate_sample_economic_data(
    start_date: datetime = datetime(2020, 1, 1),
    end_date: datetime = datetime(2023, 12, 31),
    indicators: List[str] = ["GDP", "Inflation", "Unemployment", "Interest_Rate"]
) -> pd.DataFrame:
    """Generate sample economic data for testing"""
    
    # Generate date range
    dates = pd.date_range(start=start_date, end=end_date, freq='M')
    
    # Initialize data dictionary
    data = {'timestamp': dates}
    
    # Generate data for each indicator
    for indicator in indicators:
        if indicator == "GDP":
            # GDP growth rate (annualized)
            base = 2.0  # Base growth rate
            trend = np.linspace(0, 1, len(dates))  # Upward trend
            cycle = 0.5 * np.sin(np.linspace(0, 4*np.pi, len(dates)))  # Business cycle
            noise = np.random.normal(0, 0.3, len(dates))  # Random noise
            data[indicator] = base + trend + cycle + noise
            
        elif indicator == "Inflation":
            # Inflation rate
            base = 2.0  # Target inflation
            trend = np.linspace(0, 2, len(dates))  # Rising trend
            cycle = 0.3 * np.sin(np.linspace(0, 3*np.pi, len(dates)))  # Inflation cycle
            noise = np.random.normal(0, 0.2, len(dates))  # Random noise
            data[indicator] = base + trend + cycle + noise
            
        elif indicator == "Unemployment":
            # Unemployment rate
            base = 5.0  # Natural rate
            trend = -np.linspace(0, 2, len(dates))  # Declining trend
            cycle = 1.0 * np.sin(np.linspace(0, 2*np.pi, len(dates)))  # Business cycle
            noise = np.random.normal(0, 0.2, len(dates))  # Random noise
            data[indicator] = base + trend + cycle + noise
            
        elif indicator == "Interest_Rate":
            # Interest rate
            base = 2.0  # Base rate
            trend = np.linspace(0, 3, len(dates))  # Rising trend
            cycle = 0.5 * np.sin(np.linspace(0, 2*np.pi, len(dates)))  # Rate cycle
            noise = np.random.normal(0, 0.1, len(dates))  # Random noise
            data[indicator] = base + trend + cycle + noise
    
    # Create DataFrame
    df = pd.DataFrame(data)
    df.set_index('timestamp', inplace=True)
    
    return df

def generate_sample_scenario(
    base_data: pd.DataFrame,
    shock_size: float = 0.5
) -> Dict[str, Any]:
    """Generate a sample economic scenario with shocks"""
    
    # Select random indicator and time period
    indicator = np.random.choice(base_data.columns)
    shock_period = np.random.randint(0, len(base_data))
    
    # Create scenario parameters
    scenario = {
        "name": f"Shock to {indicator}",
        "description": f"Simulation of a {shock_size*100}% shock to {indicator}",
        "parameters": {
            "shock_indicator": indicator,
            "shock_size": shock_size,
            "shock_period": shock_period,
            "duration": 12  # months
        }
    }
    
    # Generate scenario results
    results = base_data.copy()
    shock = shock_size * base_data[indicator].iloc[shock_period]
    results.loc[results.index[shock_period:], indicator] += shock
    
    # Add spillover effects
    for other_indicator in base_data.columns:
        if other_indicator != indicator:
            spillover = 0.3 * shock * np.random.randn()  # Random spillover effect
            results.loc[results.index[shock_period:], other_indicator] += spillover
    
    scenario["results"] = results.to_dict()
    
    return scenario

def generate_sample_risk_assessment(
    scenario: Dict[str, Any]
) -> Dict[str, Any]:
    """Generate a sample risk assessment for a scenario"""
    
    # Calculate risk metrics
    results = pd.DataFrame(scenario["results"])
    volatility = results.std()
    max_change = results.diff().abs().max()
    
    # Determine risk level
    if max_change.max() > 2.0 or volatility.max() > 1.0:
        risk_level = "High"
    elif max_change.max() > 1.0 or volatility.max() > 0.5:
        risk_level = "Medium"
    else:
        risk_level = "Low"
    
    # Generate assessment
    assessment = {
        "risk_level": risk_level,
        "probability": np.random.uniform(0.1, 0.9),
        "impact": np.random.uniform(0.1, 1.0),
        "description": f"Risk assessment for {scenario['name']}",
        "mitigation_strategy": "Implement monitoring and early warning system"
    }
    
    return assessment 