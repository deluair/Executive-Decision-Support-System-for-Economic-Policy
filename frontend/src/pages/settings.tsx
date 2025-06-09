import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Button,
} from '@mui/material';
import { Settings as SettingsIcon, Notifications, Security, Palette } from '@mui/icons-material';
import Layout from '@/components/layout/Layout';

const Settings = () => {
  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Configure your application preferences
        </Typography>

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    General Settings
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable real-time data updates"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-refresh dashboard"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Enable advanced analytics"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Notifications
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email notifications"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Risk alerts"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Weekly reports"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Security */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Security sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Security
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Two-factor authentication"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Session timeout"
                  sx={{ mb: 2 }}
                />
                
                <Button variant="outlined" size="small">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Appearance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Palette sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Appearance
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={<Switch />}
                  label="Dark mode"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Compact layout"
                  sx={{ mb: 2 }}
                />
                
                <Button variant="outlined" size="small">
                  Reset to Default
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained">
            Save Changes
          </Button>
          <Button variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Settings; 