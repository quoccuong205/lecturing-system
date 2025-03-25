import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLectures, deleteLecture } from '../services/lectureService';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const result = await getLectures();
      
      if (result.success) {
        setLectures(result.data);
      } else {
        setError(result.message || 'Failed to fetch lectures');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Fetch lectures error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (lecture) => {
    setLectureToDelete(lecture);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLectureToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await deleteLecture(lectureToDelete._id);
      
      if (result.success) {
        // Remove the deleted lecture from the list
        setLectures(lectures.filter(lecture => lecture._id !== lectureToDelete._id));
        setDeleteDialogOpen(false);
        setLectureToDelete(null);
      } else {
        setError(result.message || 'Failed to delete lecture');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Delete lecture error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading lectures..." />;
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        message={error} 
        onDismiss={() => setError('')}
      />
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Lectures
        </Typography>
        {user?.role === 'admin' && (
          <Button
            component={Link}
            to="/lectures/add"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add New Lecture
          </Button>
        )}
      </Box>

      {lectures.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <VideoLibraryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No lectures found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            There are no lectures available at the moment.
          </Typography>
          {user?.role === 'admin' && (
            <Button
              component={Link}
              to="/lectures/add"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add New Lecture
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {lectures.map((lecture) => (
            <Grid item xs={12} sm={6} md={4} key={lecture._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom noWrap title={lecture.title}>
                    {lecture.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {lecture.description || 'No description available'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Creator: {lecture.createdBy?.username || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Added: {new Date(lecture.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    component={Link}
                    to={`/lectures/${lecture._id}`}
                    variant="outlined"
                    size="small"
                  >
                    View Lecture
                  </Button>
                  
                  {user?.role === 'admin' && (
                    <Box>
                      <Button
                        component={Link}
                        to={`/lectures/edit/${lecture._id}`}
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(lecture)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{lectureToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
