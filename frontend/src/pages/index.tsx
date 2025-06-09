import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import Layout from '@/components/layout/Layout';
import EconomicIndicatorCard from '@/components/dashboard/EconomicIndicatorCard';
import ForecastChart from '@/components/dashboard/ForecastChart';
import RiskAssessmentCard from '@/components/dashboard/RiskAssessmentCard';

const Dashboard = () => {
  // Sample data - in real app, this would come from API
  const indicators = [
    { name: 'GDP Growth', value: 2.5, change: 0.3, trend: 'up' },
    { name: 'Inflation', value: 3.2, change: -0.1, trend: 'down' },
    { name: 'Unemployment', value: 4.8, change: -0.2, trend: 'down' },
    { name: 'Interest Rate', value: 2.0, change: 0.25, trend: 'up' },
  ];

  const forecastData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'GDP Growth',
        data: [2.5, 2.7, 2.8, 3.0],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Inflation',
        data: [3.2, 3.1, 3.0, 2.9],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const riskAssessments = [
    {
      title: 'Economic Growth Risk',
      level: 'Medium',
      probability: 0.4,
      impact: 0.6,
      description: 'Potential slowdown in economic growth due to global factors',
    },
    {
      title: 'Inflation Risk',
      level: 'High',
      probability: 0.7,
      impact: 0.8,
      description: 'Rising inflation pressures from supply chain disruptions',
    },
  ];

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Executive Dashboard
        </Typography>
        
        {/* Economic Indicators */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {indicators.map((indicator) => (
            <Grid item xs={12} sm={6} md={3} key={indicator.name}>
              <EconomicIndicatorCard {...indicator} />
            </Grid>
          ))}
        </Grid>

        {/* Forecast Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Economic Forecast
              </Typography>
              <ForecastChart data={forecastData} />
            </Paper>
          </Grid>
        </Grid>

        {/* Risk Assessments */}
        <Grid container spacing={3}>
          {riskAssessments.map((assessment) => (
            <Grid item xs={12} md={6} key={assessment.title}>
              <RiskAssessmentCard {...assessment} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard; 