import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface EconomicIndicatorCardProps {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

const EconomicIndicatorCard: React.FC<EconomicIndicatorCardProps> = ({
  name,
  value,
  change,
  trend,
}) => {
  const isPositive = trend === 'up';
  const color = isPositive ? 'success.main' : 'error.main';

  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="div">
            {value}%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            {isPositive ? (
              <TrendingUp sx={{ color }} />
            ) : (
              <TrendingDown sx={{ color }} />
            )}
            <Typography
              variant="body2"
              sx={{ color, ml: 0.5 }}
            >
              {Math.abs(change)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {isPositive ? 'Increase' : 'Decrease'} from previous period
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EconomicIndicatorCard; 