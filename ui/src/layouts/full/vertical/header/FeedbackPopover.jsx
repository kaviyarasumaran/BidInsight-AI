import { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  Typography,
  Stack,
  styled,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

const PopoverContent = styled(Box)(({ theme }) => ({
  width: 400,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontSize: '12px',
  fontWeight: '600',
  padding: theme.spacing(1, 2),
  height: '30px',
  borderRadius: '10px',
  border: `1.5px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: 'transparent',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main
  },
  whiteSpace: 'nowrap'
}));

const FeedbackPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedback, setFeedback] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = () => {
    // Handle feedback submission here
    console.log({
      type: feedbackType,
      feedback
    });
    
    // Reset form
    setFeedbackType('general');
    setFeedback('');
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <StyledButton onClick={handleClick}>
        Feedback
      </StyledButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <PopoverContent>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Send Feedback
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" mb={1}>
                Feedback Type
              </Typography>
              <Select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                size="small"
              >
                <MenuItem value="general">General Feedback</MenuItem>
                <MenuItem value="bug">Report a Bug</MenuItem>
                <MenuItem value="feature">Feature Request</MenuItem>
                <MenuItem value="improvement">Improvement Suggestion</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="subtitle2" mb={1}>
                Your Feedback
              </Typography>
              <TextField
                multiline
                rows={4}
                placeholder="Tell us what you think..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              />
            </FormControl>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ textTransform: 'none' }}
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </Button>
            </Stack>
          </Stack>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default FeedbackPopover; 