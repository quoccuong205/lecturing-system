import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Alert({ severity, message, onDismiss }) {
  if (!message) return null;
  
  return (
    <MuiAlert
      severity={severity || "info"}
      action={
        onDismiss ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onDismiss}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : undefined
      }
      sx={{ mb: 2 }}
    >
      {message}
    </MuiAlert>
  );
}
