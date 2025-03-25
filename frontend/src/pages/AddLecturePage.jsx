import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createLecture } from '../services/lectureService';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '../components/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

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

export default function AddLecturePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null
  });
  const [videoName, setVideoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    
    if (!formData.video) {
      setError('Video file is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await createLecture(formData);
      
      if (result.success) {
        navigate('/lectures');
      } else {
        setError(result.message || 'Failed to create lecture');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Create lecture error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Add New Lecture
        </Typography>
        <Button
          component={Link}
          to="/lectures"
          variant="outlined"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
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
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Video File <Box component="span" sx={{ color: 'error.main' }}>*</Box>
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
                Upload Video
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
            {loading ? 'Creating...' : 'Create Lecture'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
