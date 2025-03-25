import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLectures, deleteLecture } from '../services/lectureService';
import { getUserProfile } from '../services/userService';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AdminDashboardPage() {
  const [lectures, setLectures] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lecturesResult, profileResult] = await Promise.all([
          getLectures(),
          getUserProfile()
        ]);
        
        if (lecturesResult.success) {
          setLectures(lecturesResult.data);
        } else {
          setError(lecturesResult.message || 'Failed to fetch lectures');
        }
        
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          message={error} 
          onDismiss={() => setError('')}
        />
      )}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideoLibraryIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Total Lectures
                </Typography>
              </Box>
              <Typography variant="h3" color="text.secondary" align="center" sx={{ my: 2 }}>
                {lectures.length}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                component={Link}
                to="/lectures/add"
                startIcon={<AddIcon />}
              >
                Add New Lecture
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Admin Profile
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Username:</strong> {userProfile?.username || 'Admin'}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {userProfile?.email || 'admin@example.com'}
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                component={Link}
                to="/profile"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ mt: 3 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Manage Lectures
          </Typography>
          <Button 
            variant="contained"
            component={Link}
            to="/lectures/add"
            startIcon={<AddIcon />}
            size="small"
          >
            Add New
          </Button>
        </Box>
        
        <Divider />
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="lectures table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lectures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" sx={{ py: 3 }}>
                      No lectures available. Add your first lecture!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                lectures.map((lecture) => (
                  <TableRow
                    key={lecture._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {lecture.title}
                    </TableCell>
                    <TableCell>
                      {new Date(lecture.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {lecture.createdBy?.username || 'Unknown'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        component={Link} 
                        to={`/lectures/${lecture._id}`}
                        color="primary"
                        aria-label="view"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        component={Link} 
                        to={`/lectures/edit/${lecture._id}`}
                        color="secondary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteClick(lecture)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
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
