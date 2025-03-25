import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SecurityIcon from '@mui/icons-material/Security';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Box>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(to right, #3f51b5, #5c6bc0)',
          color: 'white'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Lecture Management System
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome to the online learning platform
        </Typography>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {isAuthenticated 
              ? `Welcome back, ${user?.username}!` 
              : 'Welcome to our platform!'}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3 }}>
            Here you can access and manage various lectures
          </Typography>
          
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              color="secondary"
              component={Link} 
              to="/lectures"
              sx={{ mt: 2 }}
            >
              Browse Lectures
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                color="secondary"
                component={Link} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                component={Link} 
                to="/register"
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Features
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibraryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Video Lectures
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Access high-quality video lectures from our expert instructors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TouchAppIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  User-Friendly Interface
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Intuitive design for easy navigation and access to content
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Secure Access
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Role-based access control to protect content and user data
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
