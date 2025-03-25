import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by error boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Something went wrong in the application.
            </Alert>
            
            <Typography variant="h5" component="h2" gutterBottom>
              Error Details
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, my: 2, overflowX: 'auto' }}>
              <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {this.state.error?.toString() || 'Unknown error'}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleReset}
                sx={{ mr: 2 }}
              >
                Return to Home Page
              </Button>
              <Button 
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
