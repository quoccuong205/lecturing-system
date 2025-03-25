import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

export default function NotFoundPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Typography 
              variant="h1" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 700,
                fontSize: { xs: '5rem', sm: '6rem' }
              }}
            >
              404
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box sx={{ pl: { sm: 3 }, borderLeft: { sm: 1 }, borderColor: 'grey.300' }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Page not found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Please check the URL in the address bar and try again.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/"
                  startIcon={<HomeIcon />}
                >
                  Back to Home
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/lectures"
                  startIcon={<VideoLibraryIcon />}
                >
                  Browse Lectures
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
