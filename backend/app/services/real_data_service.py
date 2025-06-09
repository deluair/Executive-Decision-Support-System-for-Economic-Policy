import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import requests
import aiohttp
import asyncio
from fredapi import Fred
import yfinance as yf
from alpha_vantage.timeseries import TimeSeries
import logging

logger = logging.getLogger(__name__)

class RealDataService:
    def __init__(self):
        # Initialize APIs - you'll need to set these environment variables
        self.fred_api_key = os.getenv("FRED_API_KEY", "demo_key")
        self.alpha_vantage_key = os.getenv("ALPHA_VANTAGE_API_KEY", "demo_key")
        
        print(f"FRED API Key: {self.fred_api_key[:10]}...")  # Log first 10 chars for debugging
        
        try:
            if self.fred_api_key and self.fred_api_key != "demo_key":
                self.fred = Fred(api_key=self.fred_api_key)
                print("FRED API initialized successfully")
            else:
                print("FRED API key not provided, using fallback data")
                self.fred = None
        except Exception as e:
            logger.warning(f"FRED API not available: {e}")
            print(f"FRED API initialization failed: {e}")
            self.fred = None
            
        try:
            self.av = TimeSeries(key=self.alpha_vantage_key, output_format='pandas')
        except Exception as e:
            logger.warning(f"Alpha Vantage API not available: {e}")
            self.av = None

    async def get_economic_indicators(self) -> Dict:
        """Fetch current economic indicators from various sources"""
        indicators = {}
        
        try:
            # GDP Growth Rate (Quarterly, seasonally adjusted annual rate)
            try:
                # Use Real GDP level and calculate quarterly growth rate
                gdp_level_data = await self._fetch_fred_data("GDPC1", limit=8)
                if gdp_level_data is not None and len(gdp_level_data) >= 2:
                    # Debug: print the actual data we received
                    print(f"🔍 Real GDP Level data debug:")
                    for i, (date, value) in enumerate(gdp_level_data.tail(4).items()):
                        print(f"  [{i}] {date}: ${value:.1f} billion")
                    
                    # Calculate quarter-over-quarter annualized growth rate
                    current_gdp = gdp_level_data.iloc[-1]
                    previous_gdp = gdp_level_data.iloc[-2]
                    
                    # Quarterly growth rate annualized: ((Q2/Q1)^4 - 1) * 100
                    quarterly_growth = ((current_gdp / previous_gdp) ** 4 - 1) * 100
                    
                    # Previous quarter's growth for comparison
                    if len(gdp_level_data) >= 3:
                        prev_previous_gdp = gdp_level_data.iloc[-3]
                        prev_quarterly_growth = ((previous_gdp / prev_previous_gdp) ** 4 - 1) * 100
                        growth_change = quarterly_growth - prev_quarterly_growth
                    else:
                        growth_change = 0
                    
                    indicators["GDP Growth"] = {
                        "value": round(quarterly_growth, 1),
                        "change": round(growth_change, 1),
                        "trend": "up" if growth_change > 0 else "down"
                    }
                    print(f"✅ GDP growth calculated successfully: {quarterly_growth:.1f}% (latest: {gdp_level_data.index[-1]})")
                else:
                    print(f"❌ GDP level data insufficient: {len(gdp_level_data) if gdp_level_data is not None else 0} records")
            except Exception as e:
                print(f"❌ GDP growth calculation error: {str(e)}")

            # Inflation Rate (CPI Year-over-Year)
            try:
                # Use CPI and calculate year-over-year inflation
                cpi_data = await self._fetch_fred_data("CPIAUCSL", limit=15)
                if cpi_data is not None and len(cpi_data) >= 13:
                    # Debug: print the actual data we received
                    print(f"🔍 CPI data debug:")
                    for i, (date, value) in enumerate(cpi_data.tail(4).items()):
                        print(f"  [{i}] {date}: {value:.2f}")
                    
                    # Calculate year-over-year inflation rate
                    current_cpi = cpi_data.iloc[-1]
                    year_ago_cpi = cpi_data.iloc[-13]  # 12 months ago
                    
                    current_inflation = ((current_cpi / year_ago_cpi) - 1) * 100
                    
                    # Previous month's year-over-year for comparison
                    if len(cpi_data) >= 14:
                        prev_cpi = cpi_data.iloc[-2]
                        prev_year_ago_cpi = cpi_data.iloc[-14]
                        prev_inflation = ((prev_cpi / prev_year_ago_cpi) - 1) * 100
                        inflation_change = current_inflation - prev_inflation
                    else:
                        inflation_change = 0
                    
                    indicators["Inflation"] = {
                        "value": round(current_inflation, 1),
                        "change": round(inflation_change, 1),
                        "trend": "up" if inflation_change > 0 else "down"
                    }
                    print(f"✅ CPI inflation calculated successfully: {current_inflation:.1f}% (latest: {cpi_data.index[-1]})")
                else:
                    print(f"❌ CPI data insufficient: {len(cpi_data) if cpi_data is not None else 0} records")
            except Exception as e:
                print(f"❌ CPI inflation calculation error: {str(e)}")

            # Unemployment Rate
            try:
                unemployment_data = await self._fetch_fred_data("UNRATE", limit=3)
                if unemployment_data is not None and len(unemployment_data) >= 2:
                    # Debug: print the actual data we received
                    print(f"🔍 Unemployment data debug:")
                    for i, (date, value) in enumerate(unemployment_data.tail(3).items()):
                        print(f"  [{i}] {date}: {value}%")
                    
                    current_unemployment = unemployment_data.iloc[-1]
                    previous_unemployment = unemployment_data.iloc[-2]
                    unemployment_change = current_unemployment - previous_unemployment
                    
                    indicators["Unemployment"] = {
                        "value": round(current_unemployment, 1),
                        "change": round(unemployment_change, 1),
                        "trend": "down" if unemployment_change < 0 else "up"
                    }
                    print(f"✅ Unemployment data fetched successfully: {current_unemployment:.1f}% (latest: {unemployment_data.index[-1]})")
                else:
                    print(f"❌ Unemployment data insufficient: {len(unemployment_data) if unemployment_data is not None else 0} records")
            except Exception as e:
                print(f"❌ Unemployment fetch error: {str(e)}")

            # Federal Funds Rate
            try:
                fed_rate_data = await self._fetch_fred_data("FEDFUNDS", limit=3)
                if fed_rate_data is not None and len(fed_rate_data) >= 2:
                    # Debug: print the actual data we received
                    print(f"🔍 Federal Funds Rate data debug:")
                    for i, (date, value) in enumerate(fed_rate_data.tail(3).items()):
                        print(f"  [{i}] {date}: {value}%")
                    
                    current_rate = fed_rate_data.iloc[-1]
                    previous_rate = fed_rate_data.iloc[-2]
                    rate_change = current_rate - previous_rate
                    
                    indicators["Interest Rate"] = {
                        "value": round(current_rate, 2),
                        "change": round(rate_change, 2),
                        "trend": "up" if rate_change > 0 else "down"
                    }
                    print(f"✅ Federal Funds Rate data fetched successfully: {current_rate:.2f}% (latest: {fed_rate_data.index[-1]})")
                else:
                    print(f"❌ Fed rate data insufficient: {len(fed_rate_data) if fed_rate_data is not None else 0} records")
            except Exception as e:
                print(f"❌ Fed rate fetch error: {str(e)}")

        except Exception as e:
            logger.error(f"Error fetching economic indicators: {e}")
            print(f"Error details: {str(e)}")  # Additional debug logging
            # Return fallback data if APIs fail
            indicators = self._get_fallback_indicators()

        return indicators

    async def get_forecast_data(self, periods: int = 12) -> Dict:
        """Generate forecast data based on historical trends"""
        try:
            # Fetch historical data for multiple indicators
            gdp_data = await self._fetch_fred_data("GDP", limit=40)
            cpi_data = await self._fetch_fred_data("CPIAUCSL", limit=40)
            
            forecast_data = {
                "labels": [],
                "datasets": []
            }
            
            # Generate quarterly labels for the next periods
            current_date = datetime.now()
            for i in range(periods):
                quarter_date = current_date + timedelta(days=90*i)
                quarter = f"Q{((quarter_date.month-1)//3)+1} {quarter_date.year}"
                forecast_data["labels"].append(quarter)
            
            # GDP Growth forecast
            if gdp_data is not None and len(gdp_data) >= 8:
                gdp_growth_rates = []
                for i in range(1, len(gdp_data)):
                    growth = ((gdp_data.iloc[i] / gdp_data.iloc[i-1]) ** 4 - 1) * 100
                    gdp_growth_rates.append(growth)
                
                # Simple trend-based forecast
                recent_avg = np.mean(gdp_growth_rates[-4:])  # Last 4 quarters
                trend = np.polyfit(range(len(gdp_growth_rates[-8:])), gdp_growth_rates[-8:], 1)[0]
                
                gdp_forecast = []
                for i in range(periods):
                    forecast_value = recent_avg + (trend * i)
                    # Add some realistic variation
                    forecast_value += np.random.normal(0, 0.3)
                    gdp_forecast.append(round(forecast_value, 1))
                
                forecast_data["datasets"].append({
                    "label": "GDP Growth",
                    "data": gdp_forecast,
                    "borderColor": "rgb(75, 192, 192)",
                    "tension": 0.1
                })

            # Inflation forecast
            if cpi_data is not None and len(cpi_data) >= 24:
                inflation_rates = []
                for i in range(12, len(cpi_data)):
                    inflation = ((cpi_data.iloc[i] / cpi_data.iloc[i-12]) - 1) * 100
                    inflation_rates.append(inflation)
                
                recent_avg = np.mean(inflation_rates[-6:])  # Last 6 months
                trend = np.polyfit(range(len(inflation_rates[-12:])), inflation_rates[-12:], 1)[0]
                
                inflation_forecast = []
                for i in range(periods):
                    forecast_value = recent_avg + (trend * i * 0.1)  # Slower trend change
                    forecast_value += np.random.normal(0, 0.2)
                    inflation_forecast.append(round(forecast_value, 1))
                
                forecast_data["datasets"].append({
                    "label": "Inflation",
                    "data": inflation_forecast,
                    "borderColor": "rgb(255, 99, 132)",
                    "tension": 0.1
                })

        except Exception as e:
            logger.error(f"Error generating forecast data: {e}")
            forecast_data = self._get_fallback_forecast(periods)

        return forecast_data

    async def get_risk_assessments(self) -> List[Dict]:
        """Get real-time risk assessments based on current economic conditions"""
        risks = []
        
        try:
            # Market volatility risk (using VIX-like calculation)
            sp500 = yf.download("^GSPC", period="3mo", interval="1d")
            if not sp500.empty:
                returns = sp500['Close'].pct_change().dropna()
                volatility = returns.std() * np.sqrt(252) * 100  # Annualized volatility
                
                risk_level = "High" if volatility > 25 else "Medium" if volatility > 15 else "Low"
                probability = min(0.9, volatility / 30)
                impact = min(0.9, volatility / 25)
                
                risks.append({
                    "title": "Market Volatility Risk",
                    "level": risk_level,
                    "probability": round(probability, 2),
                    "impact": round(impact, 2),
                    "description": f"Current market volatility at {volatility:.1f}% indicates {risk_level.lower()} risk"
                })

            # Inflation risk
            cpi_data = await self._fetch_fred_data("CPIAUCSL", limit=13)
            if cpi_data is not None and len(cpi_data) >= 13:
                current_inflation = ((cpi_data.iloc[-1] / cpi_data.iloc[-13]) - 1) * 100
                
                risk_level = "High" if current_inflation > 5 else "Medium" if current_inflation > 3 else "Low"
                probability = min(0.9, current_inflation / 6)
                impact = min(0.9, current_inflation / 5)
                
                risks.append({
                    "title": "Inflation Risk",
                    "level": risk_level,
                    "probability": round(probability, 2),
                    "impact": round(impact, 2),
                    "description": f"Current inflation at {current_inflation:.1f}% poses {risk_level.lower()} risk to economic stability"
                })

            # Interest rate risk
            fed_rate_data = await self._fetch_fred_data("FEDFUNDS", limit=12)
            if fed_rate_data is not None and len(fed_rate_data) >= 12:
                rate_volatility = fed_rate_data.std()
                recent_change = abs(fed_rate_data.iloc[-1] - fed_rate_data.iloc[-6])
                
                risk_level = "High" if recent_change > 1 else "Medium" if recent_change > 0.5 else "Low"
                probability = min(0.9, recent_change / 2)
                impact = min(0.9, rate_volatility / 2)
                
                risks.append({
                    "title": "Interest Rate Volatility",
                    "level": risk_level,
                    "probability": round(probability, 2),
                    "impact": round(impact, 2),
                    "description": f"Recent rate changes indicate {risk_level.lower()} volatility risk"
                })

        except Exception as e:
            logger.error(f"Error calculating risk assessments: {e}")
            risks = self._get_fallback_risks()

        return risks

    async def _fetch_fred_data(self, series_id: str, limit: int = 100) -> Optional[pd.Series]:
        """Fetch data from FRED API"""
        if not self.fred:
            print(f"❌ FRED API not initialized for {series_id}")
            return None
            
        try:
            print(f"🔍 Fetching FRED data for {series_id} (limit: {limit})")
            
            # Get recent data using proper FRED API parameters
            end_date = datetime.now()
            start_date = end_date - timedelta(days=365*10)  # Last 10 years to ensure we have enough data
            
            # Use proper FRED API parameters
            data = self.fred.get_series(
                series_id, 
                observation_start=start_date.strftime('%Y-%m-%d'),
                observation_end=end_date.strftime('%Y-%m-%d'),
                limit=limit,
                sort_order='desc'  # Most recent first
            )
            
            if data is not None and len(data) > 0:
                # Sort by date ascending (oldest first) for proper indexing
                data = data.sort_index()
                print(f"✅ Successfully fetched {len(data)} observations for {series_id}")
                print(f"📅 Date range: {data.index[0]} to {data.index[-1]}")
                return data
            else:
                print(f"❌ No data received for {series_id}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching {series_id}: {str(e)}")
            return None

    def _get_fallback_indicators(self) -> Dict:
        """Fallback data when APIs are not available - Updated with realistic current values"""
        return {
            "GDP Growth": {"value": 2.1, "change": -0.2, "trend": "down"},  # Current Q1 2025 growth around 2%
            "Inflation": {"value": 2.5, "change": -0.3, "trend": "down"},    # PCE inflation around 2.5%
            "Unemployment": {"value": 4.4, "change": 0.1, "trend": "up"},   # Current unemployment around 4.4%
            "Interest Rate": {"value": 4.25, "change": 0.0, "trend": "stable"}  # Fed funds rate around 4-4.5%
        }

    def _get_fallback_forecast(self, periods: int) -> Dict:
        """Fallback forecast data"""
        labels = [f"Q{i+1}" for i in range(periods)]
        return {
            "labels": labels,
            "datasets": [
                {
                    "label": "GDP Growth",
                    "data": [2.5 + np.random.normal(0, 0.3) for _ in range(periods)],
                    "borderColor": "rgb(75, 192, 192)",
                    "tension": 0.1
                },
                {
                    "label": "Inflation",
                    "data": [3.2 + np.random.normal(0, 0.2) for _ in range(periods)],
                    "borderColor": "rgb(255, 99, 132)",
                    "tension": 0.1
                }
            ]
        }

    def _get_fallback_risks(self) -> List[Dict]:
        """Fallback risk data"""
        return [
            {
                "title": "Economic Growth Risk",
                "level": "Medium",
                "probability": 0.4,
                "impact": 0.6,
                "description": "Potential slowdown in economic growth due to global factors"
            },
            {
                "title": "Inflation Risk",
                "level": "High",
                "probability": 0.7,
                "impact": 0.8,
                "description": "Rising inflation pressures from supply chain disruptions"
            }
        ]

    async def get_market_data(self, symbols: List[str] = None) -> Dict:
        """Get real-time market data"""
        if symbols is None:
            symbols = ["^GSPC", "^DJI", "^IXIC", "^TNX"]  # S&P 500, Dow, NASDAQ, 10-Year Treasury
        
        market_data = {}
        
        try:
            for symbol in symbols:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="5d")
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    previous_price = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                    change = current_price - previous_price
                    change_percent = (change / previous_price) * 100
                    
                    market_data[symbol] = {
                        "price": round(current_price, 2),
                        "change": round(change, 2),
                        "change_percent": round(change_percent, 2),
                        "trend": "up" if change > 0 else "down"
                    }
                    
        except Exception as e:
            logger.error(f"Error fetching market data: {e}")
            
        return market_data 