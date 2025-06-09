from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import asyncio
from datetime import datetime

from app.services.real_data_service import RealDataService
from app.services.economic_model import EconomicModelService
from app.schemas.economic import EconomicIndicator, ForecastResponse, RiskAssessment, Scenario

router = APIRouter()

# Initialize services
real_data_service = RealDataService()
model_service = EconomicModelService()

@router.get("/indicators", response_model=dict)
async def get_economic_indicators():
    """Get current economic indicators with real data"""
    try:
        indicators = await real_data_service.get_economic_indicators()
        return {"indicators": indicators}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching indicators: {str(e)}")

@router.get("/forecast", response_model=dict)
async def get_economic_forecast(
    periods: int = Query(default=12, ge=1, le=24, description="Number of periods to forecast")
):
    """Get economic forecast based on real historical data"""
    try:
        forecast_data = await real_data_service.get_forecast_data(periods=periods)
        return forecast_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecast: {str(e)}")

@router.get("/risk-assessment", response_model=dict)
async def get_risk_assessment():
    """Get current risk assessment based on real market conditions"""
    try:
        risks = await real_data_service.get_risk_assessments()
        return {"risks": risks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating risks: {str(e)}")

@router.get("/market-data", response_model=dict)
async def get_market_data(
    symbols: Optional[List[str]] = Query(default=None, description="Market symbols to fetch")
):
    """Get real-time market data"""
    try:
        market_data = await real_data_service.get_market_data(symbols=symbols)
        return {"market_data": market_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market data: {str(e)}")

@router.get("/analysis/{model_type}")
async def get_economic_analysis(
    model_type: str,
    time_horizon: str = Query(default="12-months", description="Time horizon for analysis")
):
    """Get detailed economic analysis for specific models"""
    try:
        # Convert time horizon to periods
        horizon_map = {
            "6-months": 6,
            "12-months": 12,
            "24-months": 24
        }
        periods = horizon_map.get(time_horizon, 12)
        
        if model_type == "gdp-forecast":
            # Get GDP-specific forecast with confidence intervals
            forecast_data = await real_data_service.get_forecast_data(periods=periods)
            
            # Filter for GDP data
            gdp_datasets = [ds for ds in forecast_data["datasets"] if "GDP" in ds["label"]]
            
            # Add confidence intervals (simplified version)
            if gdp_datasets:
                gdp_data = gdp_datasets[0]["data"]
                confidence_upper = [val * 1.15 for val in gdp_data]  # +15% confidence band
                confidence_lower = [val * 0.85 for val in gdp_data]  # -15% confidence band
                
                forecast_data["datasets"].extend([
                    {
                        "label": "Confidence Interval (Upper)",
                        "data": confidence_upper,
                        "borderColor": "rgba(75, 192, 192, 0.3)",
                        "borderDash": [5, 5],
                        "tension": 0.1
                    },
                    {
                        "label": "Confidence Interval (Lower)",
                        "data": confidence_lower,
                        "borderColor": "rgba(75, 192, 192, 0.3)",
                        "borderDash": [5, 5],
                        "tension": 0.1
                    }
                ])
            
            return forecast_data
            
        elif model_type == "inflation-model":
            # Get inflation-specific analysis
            forecast_data = await real_data_service.get_forecast_data(periods=periods)
            
            # Filter for inflation data
            inflation_datasets = [ds for ds in forecast_data["datasets"] if "Inflation" in ds["label"]]
            
            if inflation_datasets:
                return {
                    "labels": forecast_data["labels"],
                    "datasets": inflation_datasets
                }
                
        else:
            # Generic analysis
            return await real_data_service.get_forecast_data(periods=periods)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analysis: {str(e)}")

@router.post("/scenarios/create")
async def create_scenario(scenario_data: dict):
    """Create a new economic scenario"""
    try:
        # Basic scenario creation - in a real implementation, this would
        # use the economic model to simulate the scenario
        scenario = {
            "id": scenario_data.get("id", 999),
            "name": scenario_data.get("name", "Custom Scenario"),
            "parameters": {
                "gdp_growth": scenario_data.get("gdpGrowth", 2.5),
                "inflation": scenario_data.get("inflation", 3.2),
                "interest_rate": scenario_data.get("interestRate", 2.0),
                "unemployment_rate": scenario_data.get("unemploymentRate", 4.8)
            },
            "forecast": await real_data_service.get_forecast_data(periods=12),
            "created_at": datetime.now().isoformat()
        }
        
        return {"scenario": scenario, "message": "Scenario created successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating scenario: {str(e)}")

@router.get("/scenarios/{scenario_id}/results")
async def get_scenario_results(scenario_id: int):
    """Get results for a specific scenario"""
    try:
        # This would typically fetch stored scenario results
        # For now, we'll generate based on scenario parameters
        
        if scenario_id == 1:  # Base case
            return {
                "labels": ["Q1", "Q2", "Q3", "Q4"],
                "datasets": [
                    {
                        "label": "GDP Growth",
                        "data": [2.5, 2.6, 2.7, 2.8],
                        "borderColor": "rgb(75, 192, 192)",
                        "tension": 0.1
                    }
                ]
            }
        elif scenario_id == 2:  # Optimistic
            return {
                "labels": ["Q1", "Q2", "Q3", "Q4"],
                "datasets": [
                    {
                        "label": "GDP Growth",
                        "data": [3.5, 3.6, 3.7, 3.8],
                        "borderColor": "rgb(54, 162, 235)",
                        "tension": 0.1
                    }
                ]
            }
        elif scenario_id == 3:  # Pessimistic
            return {
                "labels": ["Q1", "Q2", "Q3", "Q4"],
                "datasets": [
                    {
                        "label": "GDP Growth",
                        "data": [1.2, 1.0, 0.8, 1.1],
                        "borderColor": "rgb(255, 99, 132)",
                        "tension": 0.1
                    }
                ]
            }
        else:
            # Dynamic scenario based on real data with modifications
            base_forecast = await real_data_service.get_forecast_data(periods=4)
            return base_forecast
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching scenario results: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "real_data_service": "active",
            "model_service": "active"
        }
    } 