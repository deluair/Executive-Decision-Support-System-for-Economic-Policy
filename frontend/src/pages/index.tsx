import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Layout from '@/components/layout/Layout';
import EconomicIndicatorCard from '@/components/dashboard/EconomicIndicatorCard';
import ForecastChart from '@/components/dashboard/ForecastChart';
import RiskAssessmentCard from '@/components/dashboard/RiskAssessmentCard';
import { useEconomicData } from '@/hooks/useEconomicData';

const Dashboard = () => {
  const {
    indicators,
    forecastData,
    riskAssessments,
    isLoadingIndicators,
    isLoadingForecast,
    isLoadingRisks,
    indicatorsError,
    forecastError,
    riskError,
    refreshAll
  } = useEconomicData();

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Executive Dashboard
        </Typography>
        
        {/* Show loading or error states */}
        {(indicatorsError || forecastError || riskError) && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <button onClick={refreshAll}>
                Refresh
              </button>
            }
          >
            Some data could not be loaded. Using fallback data. Click refresh to try again.
          </Alert>
        )}
        
        {/* Economic Indicators */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {isLoadingIndicators ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading economic indicators...</Typography>
              </Box>
            </Grid>
          ) : (
            indicators.map((indicator) => (
              <Grid item xs={12} sm={6} md={3} key={indicator.name}>
                <EconomicIndicatorCard {...indicator} />
              </Grid>
            ))
          )}
        </Grid>

        {/* Forecast Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Economic Forecast
              </Typography>
              {isLoadingForecast ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading forecast data...</Typography>
                </Box>
              ) : (
                <ForecastChart data={forecastData} />
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Risk Assessments */}
        <Grid container spacing={3}>
          {isLoadingRisks ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading risk assessments...</Typography>
              </Box>
            </Grid>
          ) : (
            riskAssessments.map((assessment, index) => (
              <Grid item xs={12} md={6} key={assessment.title || index}>
                <RiskAssessmentCard {...assessment} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard; 