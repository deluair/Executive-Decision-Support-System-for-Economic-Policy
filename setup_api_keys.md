# Setting Up Real Economic Data APIs

To use real economic data instead of mock data, you need to obtain free API keys from the following sources:

## 1. Federal Reserve Economic Data (FRED) API
- Go to: https://research.stlouisfed.org/docs/api/api_key.html
- Sign up for a free account
- Request an API key (instant approval)
- Set environment variable: `FRED_API_KEY=your_actual_key`

## 2. Alpha Vantage API (Optional - for additional market data)
- Go to: https://www.alphavantage.co/support/#api-key
- Sign up for a free account 
- Get your API key (instant)
- Set environment variable: `ALPHA_VANTAGE_API_KEY=your_actual_key`

## Quick Setup

### Option 1: Environment Variables
Set these in your shell before running docker-compose:
```bash
export FRED_API_KEY="your_fred_api_key_here"
export ALPHA_VANTAGE_API_KEY="your_alpha_vantage_key_here"
docker-compose up
```

### Option 2: Create .env file
Create a `.env` file in the project root:
```
FRED_API_KEY=your_fred_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

Then run:
```bash
docker-compose up
```

## What You'll Get With Real Data

- **Real GDP Growth**: Actual quarterly GDP data from the Federal Reserve
- **Current Inflation**: Live CPI data showing real inflation trends
- **Unemployment Rates**: Official Bureau of Labor Statistics data
- **Interest Rates**: Federal funds rate and treasury yields
- **Market Data**: Real-time stock market indices (S&P 500, Dow, NASDAQ)
- **Volatility Analysis**: Calculated from actual market movements
- **Risk Assessments**: Based on current economic conditions

## Fallback Behavior

The system is designed to gracefully handle missing API keys:
- If APIs are unavailable, it uses realistic simulated data
- All features continue to work without API keys
- No crashes or errors from missing credentials

## Data Sources

- **FRED API**: Federal Reserve Economic Data - official US economic statistics
- **Yahoo Finance**: Real-time market data and historical prices  
- **Alpha Vantage**: Additional market data and international indicators 