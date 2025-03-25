import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/userService';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '../components/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileData.username.trim() || !profileData.email.trim()) {
      setProfileError('Username and email are required');
      return;
    }

    try {
      setLoading(true);
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setProfileSuccess('Profile updated successfully');
      } else {
        setProfileError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setProfileError('An unexpected error occurred. Please try again.');
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordLoading(true);
      
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setPasswordSuccess('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(response.message);
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
      console.error('Change password error:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Update Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              title="Profile Information" 
              subheader="Update your personal details"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            />
            
            <CardContent>
              {profileError && (
                <Alert 
                  severity="error" 
                  message={profileError} 
                  onDismiss={() => setProfileError('')}
                />
              )}
              
              {profileSuccess && (
                <Alert 
                  severity="success" 
                  message={profileSuccess} 
                  onDismiss={() => setProfileSuccess('')}
                />
              )}
              
              <Box component="form" onSubmit={handleProfileSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
        
        {/* Password Change Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              title="Change Password" 
              subheader="Update your password"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            />
            
            <CardContent>
              {passwordError && (
                <Alert 
                  severity="error" 
                  message={passwordError} 
                  onDismiss={() => setPasswordError('')}
                />
              )}
              
              {passwordSuccess && (
                <Alert 
                  severity="success" 
                  message={passwordSuccess} 
                  onDismiss={() => setPasswordSuccess('')}
                />
              )}
              
              <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={passwordLoading}
                  sx={{ mt: 3 }}
                >
                  {passwordLoading ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Role Information */}
      <Paper elevation={3} sx={{ mt: 3 }}>
        <CardHeader 
          title="Account Information" 
          subheader="Your role and permissions"
        />
        
        <Divider />
        
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle1" fontWeight="bold">Role:</Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              {user?.role === 'admin' ? (
                <Chip 
                  icon={<AdminPanelSettingsIcon />} 
                  label="Administrator" 
                  color="success" 
                  variant="outlined" 
                />
              ) : (
                <Chip 
                  icon={<PersonIcon />} 
                  label="User" 
                  color="primary" 
                  variant="outlined" 
                />
              )}
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Typography variant="subtitle1" fontWeight="bold">Permissions:</Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              {user?.role === 'admin' ? (
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View lectures" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Create new lectures" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit lectures" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete lectures" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <SupervisorAccountIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Manage users" />
                  </ListItem>
                </List>
              ) : (
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View lectures" />
                  </ListItem>
                </List>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Paper>
      
      {/* Admin Dashboard Link if user is admin */}
      {user?.role === 'admin' && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'primary.50' }}>
            <Typography variant="h6" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              As an administrator, you have access to create, edit, and delete lectures.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                href="/lectures/add"
              >
                Add New Lecture
              </Button>
              <Button
                variant="outlined"
                color="primary"
                href="/lectures"
              >
                Manage Lectures
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
