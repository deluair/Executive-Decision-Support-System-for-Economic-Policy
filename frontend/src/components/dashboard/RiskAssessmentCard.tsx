import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

interface RiskAssessmentCardProps {
  title: string;
  level: 'High' | 'Medium' | 'Low';
  probability: number;
  impact: number;
  description: string;
}

const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
  title,
  level,
  probability,
  impact,
  description,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'error.main';
      case 'Medium':
        return 'warning.main';
      case 'Low':
        return 'success.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Risk Level
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: getRiskColor(level) }}
          >
            {level}
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Probability
          </Typography>
          <LinearProgress
            variant="determinate"
            value={probability * 100}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {(probability * 100).toFixed(0)}%
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Impact
          </Typography>
          <LinearProgress
            variant="determinate"
            value={impact * 100}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {(impact * 100).toFixed(0)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentCard; 