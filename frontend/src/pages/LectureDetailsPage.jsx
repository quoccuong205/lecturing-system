import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLectureById } from '../services/lectureService';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import RP from "react-player";


export default function LectureDetailsPage() {
  const ReactPlayer = RP.default ? RP.default : RP;
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playerError, setPlayerError] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const result = await getLectureById(id);
        
        if (result.success) {
          setLecture(result.data);
        } else {
          setError(result.message || 'Failed to fetch lecture');
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Fetch lecture error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  const handlePlayerError = () => {
    setPlayerError(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading lecture..." />;
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        message={error} 
        action={
          <Button color="inherit" size="small" onClick={() => navigate('/lectures')}>
            Back to Lectures
          </Button>
        }
      />
    );
  }

  if (!lecture) {
    return <LoadingSpinner message="Lecture not found..." />;
  }

  return (
    <Box>
      <Card>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1">
              {lecture.title}
            </Typography>
            <Box>
              <Button
                component={Link}
                to="/lectures"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  mr: 1, 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  } 
                }}
                size="small"
              >
                Back to Lectures
              </Button>
              {user?.role === 'admin' && (
                <Button
                  component={Link}
                  to={`/lectures/edit/${lecture._id}`}
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  size="small"
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                {playerError ? (
                  <Alert 
                    severity="warning"
                    message="Failed to load video. The video may be unavailable or in an unsupported format."
                  />
                ) : (
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      position: 'relative', 
                      paddingTop: '56.25%', /* 16:9 Aspect Ratio */ 
                      bgcolor: 'black',
                      mb: 2 
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                      <ReactPlayer
                        url={lecture.videoUrl}
                        controls
                        width="100%"
                        height="100%"
                        onError={handlePlayerError}
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About this lecture
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  icon={<PersonIcon />} 
                  label={`By: ${lecture.createdBy?.username || 'Unknown'}`} 
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  icon={<CalendarTodayIcon />} 
                  label={`Added: ${new Date(lecture.createdAt).toLocaleDateString()}`} 
                  sx={{ mb: 1 }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {lecture.description || 'No description available for this lecture.'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
