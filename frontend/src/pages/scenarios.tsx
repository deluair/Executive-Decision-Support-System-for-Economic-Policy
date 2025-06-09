import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Slider,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow,
  ExpandMore,
  Compare,
  TrendingUp,
  TrendingDown,
  Timeline,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import ForecastChart from '@/components/dashboard/ForecastChart';
import { useScenarioData, useCreateScenario } from '@/hooks/useEconomicData';

const ScenarioPlanning = () => {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Base Case',
      gdpGrowth: 2.5,
      inflation: 3.2,
      interestRate: 2.0,
      unemploymentRate: 4.8,
      isActive: true,
    },
    {
      id: 2,
      name: 'Optimistic Scenario',
      gdpGrowth: 3.5,
      inflation: 2.8,
      interestRate: 2.5,
      unemploymentRate: 4.2,
      isActive: false,
    },
    {
      id: 3,
      name: 'Pessimistic Scenario',
      gdpGrowth: 1.2,
      inflation: 4.5,
      interestRate: 1.5,
      unemploymentRate: 6.2,
      isActive: false,
    },
  ]);

  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [newScenarioName, setNewScenarioName] = useState('');

  // Use real scenario data
  const { 
    data: scenarioResults, 
    isLoading: isLoadingScenario,
    refresh: refreshScenario 
  } = useScenarioData(activeScenario.id);

  const { 
    createScenario, 
    isCreating, 
    createError 
  } = useCreateScenario();

  const handleParameterChange = (parameter: string, value: number) => {
    setActiveScenario(prev => ({
      ...prev,
      [parameter]: value,
    }));
  };

  const createNewScenario = () => {
    if (newScenarioName.trim()) {
      const newScenario = {
        id: scenarios.length + 1,
        name: newScenarioName,
        gdpGrowth: 2.5,
        inflation: 3.2,
        interestRate: 2.0,
        unemploymentRate: 4.8,
        isActive: false,
      };
      setScenarios([...scenarios, newScenario]);
      setNewScenarioName('');
    }
  };

  const impactAnalysis = [
    {
      factor: 'Consumer Spending',
      baseCase: 100,
      current: activeScenario.gdpGrowth > 2.5 ? 105 : 95,
      impact: activeScenario.gdpGrowth > 2.5 ? 'Positive' : 'Negative',
    },
    {
      factor: 'Business Investment',
      baseCase: 100,
      current: activeScenario.interestRate < 2.0 ? 110 : 90,
      impact: activeScenario.interestRate < 2.0 ? 'Positive' : 'Negative',
    },
    {
      factor: 'Employment',
      baseCase: 100,
      current: activeScenario.unemploymentRate < 4.8 ? 108 : 92,
      impact: activeScenario.unemploymentRate < 4.8 ? 'Positive' : 'Negative',
    },
  ];

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Scenario Planning
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Interactive what-if analysis and economic simulation
        </Typography>

        {/* Scenario Selection */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Economic Scenarios
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {scenarios.map((scenario) => (
                  <Grid item xs={12} sm={6} md={4} key={scenario.id}>
                    <Card 
                      variant={activeScenario.id === scenario.id ? 'outlined' : 'elevation'}
                      sx={{ 
                        cursor: 'pointer',
                        border: activeScenario.id === scenario.id ? 2 : 0,
                        borderColor: 'primary.main'
                      }}
                      onClick={() => setActiveScenario(scenario)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {scenario.name}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2">
                            GDP: {scenario.gdpGrowth}%
                          </Typography>
                          <Typography variant="body2">
                            Inflation: {scenario.inflation}%
                          </Typography>
                          <Typography variant="body2">
                            Interest Rate: {scenario.interestRate}%
                          </Typography>
                          <Typography variant="body2">
                            Unemployment: {scenario.unemploymentRate}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Create New Scenario */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="New Scenario Name"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  size="small"
                />
                <Button 
                  variant="contained" 
                  onClick={createNewScenario}
                  disabled={!newScenarioName.trim()}
                >
                  Create Scenario
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Parameter Controls */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Scenario Parameters: {activeScenario.name}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  GDP Growth Rate: {activeScenario.gdpGrowth}%
                </Typography>
                <Slider
                  value={activeScenario.gdpGrowth}
                  onChange={(_, value) => handleParameterChange('gdpGrowth', value as number)}
                  min={-2}
                  max={6}
                  step={0.1}
                  marks={[
                    { value: -2, label: '-2%' },
                    { value: 0, label: '0%' },
                    { value: 3, label: '3%' },
                    { value: 6, label: '6%' },
                  ]}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Inflation Rate: {activeScenario.inflation}%
                </Typography>
                <Slider
                  value={activeScenario.inflation}
                  onChange={(_, value) => handleParameterChange('inflation', value as number)}
                  min={0}
                  max={8}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 2, label: '2%' },
                    { value: 4, label: '4%' },
                    { value: 8, label: '8%' },
                  ]}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Interest Rate: {activeScenario.interestRate}%
                </Typography>
                <Slider
                  value={activeScenario.interestRate}
                  onChange={(_, value) => handleParameterChange('interestRate', value as number)}
                  min={0}
                  max={6}
                  step={0.25}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 2, label: '2%' },
                    { value: 4, label: '4%' },
                    { value: 6, label: '6%' },
                  ]}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Unemployment Rate: {activeScenario.unemploymentRate}%
                </Typography>
                <Slider
                  value={activeScenario.unemploymentRate}
                  onChange={(_, value) => handleParameterChange('unemploymentRate', value as number)}
                  min={2}
                  max={12}
                  step={0.1}
                  marks={[
                    { value: 2, label: '2%' },
                    { value: 5, label: '5%' },
                    { value: 8, label: '8%' },
                    { value: 12, label: '12%' },
                  ]}
                />
              </Box>

              <Button variant="contained" startIcon={<PlayArrow />}>
                Run Simulation
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Scenario Forecast
                </Typography>
              </Box>
              {scenarioResults && (
                <ForecastChart data={scenarioResults} />
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Impact Analysis */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Economic Impact Analysis
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Economic Factor</TableCell>
                      <TableCell align="right">Base Case</TableCell>
                      <TableCell align="right">Current Scenario</TableCell>
                      <TableCell align="right">Change</TableCell>
                      <TableCell align="center">Impact</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {impactAnalysis.map((row) => (
                      <TableRow key={row.factor}>
                        <TableCell component="th" scope="row">
                          {row.factor}
                        </TableCell>
                        <TableCell align="right">{row.baseCase}</TableCell>
                        <TableCell align="right">{row.current}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {row.current > row.baseCase ? (
                              <TrendingUp color="success" sx={{ mr: 1 }} />
                            ) : (
                              <TrendingDown color="error" sx={{ mr: 1 }} />
                            )}
                            {Math.abs(row.current - row.baseCase)}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.impact}
                            color={row.impact === 'Positive' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Sensitivity Analysis */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sensitivity Analysis
              </Typography>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>GDP Growth Sensitivity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    A 1% increase in GDP growth typically leads to:
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">• 0.5% increase in employment</Typography>
                    <Typography variant="body2">• 2% increase in tax revenue</Typography>
                    <Typography variant="body2">• 1.5% increase in consumer spending</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Interest Rate Sensitivity</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    A 1% increase in interest rates typically leads to:
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">• 3% decrease in business investment</Typography>
                    <Typography variant="body2">• 2% decrease in housing demand</Typography>
                    <Typography variant="body2">• 0.8% decrease in consumer spending</Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ScenarioPlanning; 