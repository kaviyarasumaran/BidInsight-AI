import React from "react";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  styled,
  Stack,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  alpha,
  Collapse
} from '@mui/material';
import { IconChevronRight, IconCircle } from '@tabler/icons-react';
import SidebarPanelConfig from '../../../../configs/SidebarPanelConfig';

const PanelWrapper = styled('div', {
  shouldForwardProp: prop => !['show'].includes(prop)
})(({ theme, show }) => ({
  position: 'fixed',
  height: 'calc(100vh - 70px)',
  width: '240px',
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
  top: '70px',
  left: show ? '70px' : '-240px',
  zIndex: 1200,
  transition: theme.transitions.create('left', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowY: 'auto',
  overflowX: 'hidden',
  boxShadow: show ? theme.shadows[8] : 'none',
  pointerEvents: 'auto'
}));

const StyledListItem = styled(ListItemButton, {
  shouldForwardProp: prop => !['depth', 'active'].includes(prop)
})(({ theme, depth = 0, active }) => ({
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1, 2, 1, 2 + depth * 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2, 2, 1),
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}));

const PanelTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: '1.25rem',
  fontWeight: 600,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const MenuItem = ({ item, depth = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = location.pathname === item.url;

  const handleClick = () => {
    if (item.hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.url && item.url !== '#') {
      // Handle special navigation for different flows
      if (item.flowType === 'motor') {
        navigate('/dashboards/agents?flow=motor');
      } else if (item.flowType === 'life') {
        navigate('/dashboards/agents?flow=life');
      } else if (item.flowType === 'ifrs') {
        navigate('/dashboards/agents?flow=ifrs');
      } else if (item.flowType === 'fraud') {
        navigate('/dashboards/agents?flow=fraud');
      } else if (item.id === 'underwriting') {
        navigate('/dashboards/agents?flow=policy-underwriting');
      } else {
        navigate(item.url);
      }
    }
  };

  return (
    <>
      <StyledListItem
        depth={depth}
        active={isActive}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ 
          minWidth: '35px',
          color: 'inherit'
        }}>
          {depth === 0 && item.icon ? (
            <item.icon size={20} />
          ) : (
            <IconCircle size={8} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={item.title}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: isActive ? 600 : 400
          }}
        />
        {item.hasChildren && (
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s',
              color: 'inherit',
              padding: 0
            }}
          >
            <IconChevronRight size={18} />
          </IconButton>
        )}
      </StyledListItem>
      
      {item.hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Stack spacing={0.5}>
            {item.children.map((child) => (
              <MenuItem key={child.id} item={child} depth={depth + 1} />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  );
};

const SidebarPanel = ({ isVisible, hideTitle = false }) => {
  return (
    <PanelWrapper show={isVisible ? 1 : 0}>
      {!hideTitle && (
        <PanelTitle>
          {SidebarPanelConfig.title}
        </PanelTitle>
      )}
      
      {SidebarPanelConfig.sections.map((section, index) => (
        <Box key={index}>
          <SectionTitle>
            {section.title}
          </SectionTitle>
          
          <Stack spacing={0.5} px={1}>
            {section.items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </Stack>
        </Box>
      ))}
    </PanelWrapper>
  );
};

export default SidebarPanel; 