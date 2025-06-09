import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Security,
  Assessment,
  Timeline,
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import { useEconomicData } from '@/hooks/useEconomicData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`risk-tabpanel-${index}`}
      aria-labelledby={`risk-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RiskAssessment = () => {
  const [tabValue, setTabValue] = useState(0);

  // Use real risk data
  const { 
    riskAssessments, 
    isLoadingRisks, 
    riskError,
    refreshRisks 
  } = useEconomicData();

  const riskCategories = [
    {
      name: 'Economic Risks',
      totalRisks: 12,
      highRisk: 3,
      mediumRisk: 6,
      lowRisk: 3,
      overallRisk: 'Medium',
      riskScore: 65,
    },
    {
      name: 'Financial Risks',
      totalRisks: 8,
      highRisk: 2,
      mediumRisk: 4,
      lowRisk: 2,
      overallRisk: 'Medium',
      riskScore: 58,
    },
    {
      name: 'Operational Risks',
      totalRisks: 15,
      highRisk: 1,
      mediumRisk: 8,
      lowRisk: 6,
      overallRisk: 'Low',
      riskScore: 42,
    },
    {
      name: 'Regulatory Risks',
      totalRisks: 6,
      highRisk: 4,
      mediumRisk: 2,
      lowRisk: 0,
      overallRisk: 'High',
      riskScore: 85,
    },
  ];

  const topRisks = [
    {
      id: 1,
      title: 'Inflation Surge',
      category: 'Economic',
      probability: 0.7,
      impact: 0.8,
      riskScore: 56,
      level: 'High',
      description: 'Persistent high inflation could erode purchasing power and economic stability',
      mitigation: 'Monitor monetary policy, diversify asset allocation',
      timeline: 'Short-term',
    },
    {
      id: 2,
      title: 'Supply Chain Disruption',
      category: 'Operational',
      probability: 0.6,
      impact: 0.7,
      riskScore: 42,
      level: 'Medium',
      description: 'Global supply chain vulnerabilities affecting production and costs',
      mitigation: 'Diversify suppliers, build inventory buffers',
      timeline: 'Medium-term',
    },
    {
      id: 3,
      title: 'Interest Rate Volatility',
      category: 'Financial',
      probability: 0.8,
      impact: 0.6,
      riskScore: 48,
      level: 'Medium',
      description: 'Rapid changes in interest rates affecting borrowing costs and investment',
      mitigation: 'Hedge interest rate exposure, maintain flexible financing',
      timeline: 'Short-term',
    },
    {
      id: 4,
      title: 'Regulatory Changes',
      category: 'Regulatory',
      probability: 0.9,
      impact: 0.9,
      riskScore: 81,
      level: 'High',
      description: 'New financial regulations could impact operations and compliance costs',
      mitigation: 'Stay informed on regulatory developments, ensure compliance',
      timeline: 'Long-term',
    },
    {
      id: 5,
      title: 'Market Volatility',
      category: 'Financial',
      probability: 0.5,
      impact: 0.5,
      riskScore: 25,
      level: 'Low',
      description: 'Stock market fluctuations affecting investment portfolios',
      mitigation: 'Diversified portfolio, regular rebalancing',
      timeline: 'Short-term',
    },
  ];

  const mitigationStrategies = [
    {
      category: 'Diversification',
      strategies: [
        'Geographic diversification of investments',
        'Sector diversification across industries',
        'Asset class diversification (stocks, bonds, commodities)',
      ],
    },
    {
      category: 'Hedging',
      strategies: [
        'Currency hedging for international exposure',
        'Interest rate hedging through derivatives',
        'Commodity price hedging',
      ],
    },
    {
      category: 'Monitoring',
      strategies: [
        'Real-time economic indicator tracking',
        'Early warning system implementation',
        'Regular risk assessment reviews',
      ],
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <Error color="error" />;
      case 'Medium':
        return <Warning color="warning" />;
      case 'Low':
        return <CheckCircle color="success" />;
      default:
        return <Assessment />;
    }
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Risk Assessment
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Comprehensive risk evaluation and mitigation strategies
        </Typography>

        {/* Risk Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {riskCategories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.name}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h3">
                      {category.name}
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                    {category.totalRisks}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Total Risks
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Risk Score: {category.riskScore}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={category.riskScore} 
                      color={getRiskColor(category.overallRisk) as any}
                    />
                  </Box>
                  
                  <Chip
                    label={`Overall: ${category.overallRisk}`}
                    color={getRiskColor(category.overallRisk) as any}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Alert Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                High Priority Risks Detected
              </Typography>
              4 risks require immediate attention. Review the risk register and implement mitigation strategies.
            </Alert>
          </Grid>
        </Grid>

        {/* Detailed Risk Analysis */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="Risk Register" />
                  <Tab label="Risk Matrix" />
                  <Tab label="Mitigation Strategies" />
                  <Tab label="Risk Trends" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Top Risks by Priority
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Risk</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="center">Probability</TableCell>
                        <TableCell align="center">Impact</TableCell>
                        <TableCell align="center">Risk Score</TableCell>
                        <TableCell align="center">Level</TableCell>
                        <TableCell>Timeline</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topRisks.map((risk) => (
                        <TableRow key={risk.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" gutterBottom>
                                {risk.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {risk.description}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{risk.category}</TableCell>
                          <TableCell align="center">
                            {Math.round(risk.probability * 100)}%
                          </TableCell>
                          <TableCell align="center">
                            {Math.round(risk.impact * 100)}%
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6" color="primary">
                              {risk.riskScore}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={risk.level}
                              color={getRiskColor(risk.level) as any}
                              size="small"
                              icon={getRiskIcon(risk.level)}
                            />
                          </TableCell>
                          <TableCell>{risk.timeline}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Risk Impact vs Probability Matrix
                </Typography>
                <Box sx={{ position: 'relative', height: 400, border: 1, borderColor: 'divider' }}>
                  {topRisks.map((risk) => (
                    <Box
                      key={risk.id}
                      sx={{
                        position: 'absolute',
                        left: `${risk.probability * 100}%`,
                        bottom: `${risk.impact * 100}%`,
                        transform: 'translate(-50%, 50%)',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getRiskColor(risk.level) === 'error' ? 'error.main' :
                          getRiskColor(risk.level) === 'warning' ? 'warning.main' : 'success.main',
                        cursor: 'pointer',
                      }}
                      title={risk.title}
                    />
                  ))}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Risk Mitigation Strategies
                </Typography>
                <Grid container spacing={3}>
                  {mitigationStrategies.map((strategy) => (
                    <Grid item xs={12} md={4} key={strategy.category}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="primary">
                            {strategy.category}
                          </Typography>
                          <List dense>
                            {strategy.strategies.map((item, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle color="success" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>
                  Risk Trend Analysis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingUp color="error" sx={{ mr: 1 }} />
                          <Typography variant="h6">
                            Increasing Risks
                          </Typography>
                        </Box>
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Regulatory Risks"
                              secondary="↑ 15% this quarter"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Inflation Risk"
                              secondary="↑ 12% this quarter"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TrendingDown color="success" sx={{ mr: 1 }} />
                          <Typography variant="h6">
                            Decreasing Risks
                          </Typography>
                        </Box>
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Operational Risks"
                              secondary="↓ 8% this quarter"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Credit Risk"
                              secondary="↓ 5% this quarter"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" startIcon={<Assessment />}>
              Generate Risk Report
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<Timeline />}>
              Schedule Risk Review
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default RiskAssessment; 