from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime

class EconomicIndicatorBase(BaseModel):
    indicator_type: str
    value: float
    source: str
    confidence_interval: float
    metadata: Optional[Dict[str, Any]] = None

class EconomicIndicatorCreate(EconomicIndicatorBase):
    pass

class EconomicIndicator(EconomicIndicatorBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class ModelResultBase(BaseModel):
    model_type: str
    parameters: Dict[str, Any]
    results: Dict[str, Any]

class ModelResultCreate(ModelResultBase):
    pass

class ModelResult(ModelResultBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True

class ScenarioBase(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]
    results: Dict[str, Any]

class ScenarioCreate(ScenarioBase):
    pass

class Scenario(ScenarioBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True

class RiskAssessmentBase(BaseModel):
    scenario_id: int
    risk_level: str
    probability: float
    impact: float
    description: str
    mitigation_strategy: str

class RiskAssessmentCreate(RiskAssessmentBase):
    pass

class RiskAssessment(RiskAssessmentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ForecastResponse(BaseModel):
    forecast: Dict[str, List[float]]
    confidence_intervals: Dict[str, List[List[float]]]
    elasticities: Dict[str, Dict[str, float]]
    risk_assessment: Dict[str, Dict[str, Any]]

class RiskAssessmentResponse(BaseModel):
    risk_level: str
    probability: float
    impact: float
    description: str
    mitigation_strategy: str
    created_at: datetime 