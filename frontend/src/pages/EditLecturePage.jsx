import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLectureById, updateLecture } from '../services/lectureService';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// Styled component for the file upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function EditLecturePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null
  });
  const [videoName, setVideoName] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setFetchLoading(true);
        const result = await getLectureById(id);
        
        if (result.success) {
          const { title, description, videoUrl } = result.data;
          setFormData({
            title: title || '',
            description: description || '',
            video: null
          });
          setCurrentVideoUrl(videoUrl || '');
        } else {
          setError(result.message || 'Failed to fetch lecture');
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Fetch lecture error:', error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Video size validation (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video size exceeds 50MB limit');
        return;
      }
      
      // Video type validation
      if (!file.type.startsWith('video/')) {
        setError('File must be a video');
        return;
      }
      
      setFormData(prev => ({ ...prev, video: file }));
      setVideoName(file.name);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await updateLecture(id, formData);
      
      if (result.success) {
        navigate(`/lectures/${id}`);
      } else {
        setError(result.message || 'Failed to update lecture');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Update lecture error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <LoadingSpinner message="Loading lecture..." />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Edit Lecture
        </Typography>
        <Box>
          <Button
            component={Link}
            to={`/lectures/${id}`}
            variant="outlined"
            startIcon={<VisibilityIcon />}
            sx={{ mr: 1 }}
          >
            View Lecture
          </Button>
          <Button
            component={Link}
            to="/lectures"
            variant="outlined"
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          message={error} 
          onDismiss={() => setError('')}
          sx={{ mb: 3 }}
        />
      )}
      
      <Card component="form" onSubmit={handleSubmit}>
        <CardContent>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Current Video
            </Typography>
            {currentVideoUrl ? (
              <Chip 
                icon={<AttachFileIcon />} 
                label={currentVideoUrl}
                variant="outlined"
                sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No video currently available
              </Typography>
            )}
          </Box>
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload New Video (Optional)
            </Typography>
            
            <Box sx={{ 
              border: '1px dashed', 
              borderColor: 'primary.main', 
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              bgcolor: 'primary.50'
            }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Replace Video
                <VisuallyHiddenInput 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange}
                />
              </Button>
              
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supported formats: MP4, WebM, Ogg (Max 50MB)
              </Typography>
              
              {videoName && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="body2" color="primary">
                    Selected: {videoName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
        
        <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
