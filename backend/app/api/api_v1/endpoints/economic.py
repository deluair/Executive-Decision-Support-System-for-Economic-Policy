from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime, timedelta

from app.db.session import get_db
from app.services.economic_model import EconomicModelService
from app.models.economic import EconomicIndicator, ModelResult, Scenario, RiskAssessment
from app.schemas.economic import (
    EconomicIndicatorCreate,
    ModelResultCreate,
    ScenarioCreate,
    RiskAssessmentCreate,
    ForecastResponse,
    RiskAssessmentResponse
)

router = APIRouter()
model_service = EconomicModelService()

@router.post("/indicators/", response_model=EconomicIndicatorCreate)
def create_economic_indicator(
    indicator: EconomicIndicatorCreate,
    db: Session = Depends(get_db)
):
    """Create a new economic indicator"""
    db_indicator = EconomicIndicator(**indicator.dict())
    db.add(db_indicator)
    db.commit()
    db.refresh(db_indicator)
    return db_indicator

@router.get("/indicators/", response_model=List[EconomicIndicatorCreate])
def get_economic_indicators(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all economic indicators"""
    indicators = db.query(EconomicIndicator).offset(skip).limit(limit).all()
    return indicators

@router.post("/forecast/", response_model=ForecastResponse)
def generate_forecast(
    variables: List[str],
    forecast_steps: int = 12,
    db: Session = Depends(get_db)
):
    """Generate economic forecast for specified variables"""
    # Get historical data
    indicators = db.query(EconomicIndicator).filter(
        EconomicIndicator.indicator_type.in_(variables)
    ).all()
    
    if not indicators:
        raise HTTPException(status_code=404, detail="No data found for specified variables")
    
    # Prepare data for modeling
    data = pd.DataFrame([{
        'timestamp': i.timestamp,
        i.indicator_type: i.value
    } for i in indicators])
    data.set_index('timestamp', inplace=True)
    
    # Prepare and train model
    prepared_data = model_service.prepare_data(data)
    model = model_service.train_var_model(prepared_data)
    
    # Generate forecast
    forecast = model_service.forecast(model, steps=forecast_steps)
    
    # Run Monte Carlo simulations
    mc_results = model_service.run_monte_carlo(model, forecast_steps=forecast_steps)
    
    # Calculate elasticities
    elasticities = {
        var: model_service.calculate_elasticity(model, var)
        for var in variables
    }
    
    # Generate risk assessment
    risk_assessment = model_service.generate_risk_assessment(
        forecast,
        prepared_data,
        mc_results
    )
    
    return {
        "forecast": forecast.to_dict(),
        "confidence_intervals": {
            "lower": mc_results["lower_ci"].tolist(),
            "upper": mc_results["upper_ci"].tolist()
        },
        "elasticities": elasticities,
        "risk_assessment": risk_assessment
    }

@router.post("/scenarios/", response_model=ScenarioCreate)
def create_scenario(
    scenario: ScenarioCreate,
    db: Session = Depends(get_db)
):
    """Create a new economic scenario"""
    db_scenario = Scenario(**scenario.dict())
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario

@router.get("/scenarios/", response_model=List[ScenarioCreate])
def get_scenarios(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all economic scenarios"""
    scenarios = db.query(Scenario).offset(skip).limit(limit).all()
    return scenarios

@router.post("/risk-assessment/", response_model=RiskAssessmentResponse)
def create_risk_assessment(
    assessment: RiskAssessmentCreate,
    db: Session = Depends(get_db)
):
    """Create a new risk assessment"""
    db_assessment = RiskAssessment(**assessment.dict())
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment 