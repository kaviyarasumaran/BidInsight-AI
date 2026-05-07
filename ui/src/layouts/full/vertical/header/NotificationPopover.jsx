import { useState } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Stack,
  Divider,
  styled,
  Badge,
  Avatar,
} from '@mui/material';
import { Icon } from '@iconify/react';

const PopoverContent = styled(Box)(({ theme }) => ({
  width: 360,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius
}));

const NotificationItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2)
}));

const NotificationPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      avatar: '/path-to-avatar1.jpg',
      title: 'New Message from Sarah',
      description: 'Hey, can you check the latest updates?',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      avatar: '/path-to-avatar2.jpg',
      title: 'Project Update',
      description: 'The project "AI Dashboard" has been updated',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 3,
      avatar: '/path-to-avatar3.jpg',
      title: 'Meeting Reminder',
      description: 'Team meeting starts in 30 minutes',
      time: '3 hours ago',
      unread: false,
    },
  ];

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={2} color="error">
          <Icon icon="mage:inbox-notification" width={24} height={24} />
        </Badge>
      </IconButton>
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
          <NotificationHeader>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={handleClose}
            >
              Mark all as read
            </Typography>
          </NotificationHeader>

          <Stack spacing={1}>
            {notifications.map((notification) => (
              <NotificationItem key={notification.id}>
                <Stack direction="row" spacing={2}>
                  <Avatar src={notification.avatar} alt="User" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={notification.unread ? 600 : 400}
                      >
                        {notification.title}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                      >
                        {notification.time}
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {notification.description}
                    </Typography>
                  </Box>
                </Stack>
              </NotificationItem>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={handleClose}
            >
              View All Notifications
            </Typography>
          </Box>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default NotificationPopover; 