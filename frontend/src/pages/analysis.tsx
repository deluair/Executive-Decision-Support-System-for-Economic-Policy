import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
} from '@mui/material';
import { TrendingUp, Analytics, Assessment } from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import ForecastChart from '@/components/dashboard/ForecastChart';
import { useEconomicAnalysis } from '@/hooks/useEconomicData';

const EconomicAnalysis = () => {
  const [selectedModel, setSelectedModel] = useState('gdp-forecast');
  const [timeHorizon, setTimeHorizon] = useState('12-months');

  // Use real data
  const { 
    data: analysisData, 
    isLoading, 
    error: analysisError,
    refresh 
  } = useEconomicAnalysis(selectedModel, timeHorizon);

  // Sample economic models data
  const models = [
    { id: 'gdp-forecast', name: 'GDP Growth Forecast', accuracy: 92 },
    { id: 'inflation-model', name: 'Inflation Prediction', accuracy: 88 },
    { id: 'employment-model', name: 'Employment Analysis', accuracy: 85 },
    { id: 'market-volatility', name: 'Market Volatility', accuracy: 79 },
  ];

  const insights = [
    {
      title: 'GDP Growth Acceleration',
      description: 'Economic indicators suggest sustained growth momentum through Q2',
      confidence: 'High',
      impact: 'Positive',
    },
    {
      title: 'Inflation Moderation',
      description: 'Core inflation showing signs of cooling due to supply chain normalization',
      confidence: 'Medium',
      impact: 'Positive',
    },
    {
      title: 'Employment Strength',
      description: 'Labor market remains robust with unemployment at historical lows',
      confidence: 'High',
      impact: 'Positive',
    },
  ];

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Economic Analysis
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Advanced econometric modeling and forecasting tools
        </Typography>

        {/* Model Selection */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Economic Model</InputLabel>
              <Select
                value={selectedModel}
                label="Economic Model"
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name} (Accuracy: {model.accuracy}%)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Time Horizon</InputLabel>
              <Select
                value={timeHorizon}
                label="Time Horizon"
                onChange={(e) => setTimeHorizon(e.target.value)}
              >
                <MenuItem value="6-months">6 Months</MenuItem>
                <MenuItem value="12-months">12 Months</MenuItem>
                <MenuItem value="24-months">24 Months</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Analysis Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Analytics sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {models.find(m => m.id === selectedModel)?.name || 'Economic Model'}
                </Typography>
              </Box>
              {analysisData && (
                <ForecastChart data={analysisData} />
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small">
                  Export Data
                </Button>
                <Button variant="outlined" size="small">
                  Adjust Parameters
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Model Performance */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Model Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                {models.map((model) => (
                  <Grid item xs={12} sm={6} md={3} key={model.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle2">
                            {model.name}
                          </Typography>
                        </Box>
                        <Typography variant="h4" color="primary">
                          {model.accuracy}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Accuracy Score
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Economic Insights */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Economic Insights
              </Typography>
              <Grid container spacing={2}>
                {insights.map((insight, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" component="h3">
                            {insight.title}
                          </Typography>
                          <TrendingUp color="success" />
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {insight.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={`Confidence: ${insight.confidence}`}
                            color={insight.confidence === 'High' ? 'success' : 'default'}
                            size="small"
                          />
                          <Chip 
                            label={`Impact: ${insight.impact}`}
                            color={insight.impact === 'Positive' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default EconomicAnalysis; 