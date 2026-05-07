import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  useTheme,
  Stack,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import { keyframes } from '@mui/system';
import { IconHome, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeInUp = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const wiggle = keyframes`
  0%, 7% { transform: rotateZ(0); }
  15% { transform: rotateZ(-15deg); }
  20% { transform: rotateZ(10deg); }
  25% { transform: rotateZ(-10deg); }
  30% { transform: rotateZ(6deg); }
  35% { transform: rotateZ(-4deg); }
  40%, 100% { transform: rotateZ(0); }
`;

// Animated SVG Components
const AnimatedRobot = ({ theme }) => (
  <Box
    sx={{
      animation: `${float} 3s ease-in-out infinite`,
      width: 280,
      height: 280,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
      {/* Robot Shadow */}
      <ellipse cx="140" cy="260" rx="80" ry="12" fill={theme.palette.action.disabled} opacity="0.3" />
      
      {/* Robot Body */}
      <rect x="80" y="120" width="120" height="100" rx="20" fill={theme.palette.primary.main} />
      
      {/* Robot Head */}
      <rect x="90" y="60" width="100" height="80" rx="25" fill={theme.palette.primary.dark} />
      
      {/* Robot Eyes */}
      <circle cx="110" cy="90" r="12" fill={theme.palette.background.paper} />
      <circle cx="170" cy="90" r="12" fill={theme.palette.background.paper} />
      <circle cx="110" cy="90" r="6" fill={theme.palette.primary.main} />
      <circle cx="170" cy="90" r="6" fill={theme.palette.primary.main} />
      
      {/* Robot Mouth */}
      <rect x="125" y="110" width="30" height="8" rx="4" fill={theme.palette.background.paper} />
      
      {/* Robot Arms */}
      <rect x="50" y="140" width="20" height="60" rx="10" fill={theme.palette.primary.light} />
      <rect x="210" y="140" width="20" height="60" rx="10" fill={theme.palette.primary.light} />
      
      {/* Robot Hands */}
      <circle cx="60" cy="210" r="15" fill={theme.palette.primary.main} />
      <circle cx="220" cy="210" r="15" fill={theme.palette.primary.main} />
      
      {/* Robot Legs */}
      <rect x="105" y="220" width="25" height="40" rx="12" fill={theme.palette.primary.light} />
      <rect x="150" y="220" width="25" height="40" rx="12" fill={theme.palette.primary.light} />
      
      {/* Robot Antenna */}
      <line x1="140" y1="60" x2="140" y2="30" stroke={theme.palette.primary.main} strokeWidth="3" />
      <circle cx="140" cy="30" r="6" fill={theme.palette.error.main} />
      
      {/* Robot Chest Panel */}
      <rect x="110" y="140" width="60" height="40" rx="8" fill={theme.palette.primary.light} opacity="0.7" />
      
      {/* Robot Buttons */}
      <circle cx="130" cy="155" r="4" fill={theme.palette.success.main} />
      <circle cx="150" cy="155" r="4" fill={theme.palette.warning.main} />
      <circle cx="130" cy="170" r="4" fill={theme.palette.error.main} />
      <circle cx="150" cy="170" r="4" fill={theme.palette.info.main} />
      
      {/* Sparkles around robot */}
      <g sx={{ animation: `${pulse} 2s ease-in-out infinite` }}>
        <path d="M40,80 L45,85 L40,90 L35,85 Z" fill={theme.palette.warning.main} opacity="0.8" />
        <path d="M240,100 L245,105 L240,110 L235,105 Z" fill={theme.palette.info.main} opacity="0.8" />
        <path d="M70,200 L75,205 L70,210 L65,205 Z" fill={theme.palette.success.main} opacity="0.8" />
        <path d="M220,50 L225,55 L220,60 L215,55 Z" fill={theme.palette.error.main} opacity="0.8" />
      </g>
    </svg>
  </Box>
);

const AnimatedNumbers = ({ theme }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        animation: `${bounce} 2s ease-in-out infinite`,
        textShadow: `0 4px 8px ${theme.palette.primary.main}40`,
        lineHeight: 0.8
      }}
    >
      4
    </Typography>
    <Box
      sx={{
        animation: `${wiggle} 3s ease-in-out infinite`,
        transform: 'rotate(-10deg)'
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
          fontWeight: 'bold',
          color: theme.palette.error.main,
          textShadow: `0 4px 8px ${theme.palette.error.main}40`,
          lineHeight: 0.8
        }}
      >
        0
      </Typography>
    </Box>
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        animation: `${bounce} 2s ease-in-out infinite 0.5s`,
        textShadow: `0 4px 8px ${theme.palette.primary.main}40`,
        lineHeight: 0.8
      }}
    >
      4
    </Typography>
  </Box>
);

const FloatingElements = ({ theme }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}
  >
    {/* Floating geometric shapes */}
    {[...Array(6)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: 20 + (i * 10),
          height: 20 + (i * 10),
          background: `linear-gradient(135deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40)`,
          borderRadius: i % 2 === 0 ? '50%' : '20%',
          animation: `${float} ${3 + i}s ease-in-out infinite ${i * 0.5}s`,
          top: `${10 + (i * 15)}%`,
          left: `${5 + (i * 15)}%`,
          opacity: 0.3
        }}
      />
    ))}
    
    {/* More floating elements on the right */}
    {[...Array(4)].map((_, i) => (
      <Box
        key={`right-${i}`}
        sx={{
          position: 'absolute',
          width: 15 + (i * 8),
          height: 15 + (i * 8),
          background: `linear-gradient(135deg, ${theme.palette.warning.main}40, ${theme.palette.error.main}40)`,
          borderRadius: '50%',
          animation: `${float} ${2.5 + i}s ease-in-out infinite ${i * 0.7}s`,
          top: `${20 + (i * 20)}%`,
          right: `${10 + (i * 10)}%`,
          opacity: 0.4
        }}
      />
    ))}
  </Box>
);

const NotFoundPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <FloatingElements theme={theme} />
      
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Robot Animation */}
            <Zoom in timeout={1500}>
              <Box>
                <AnimatedRobot theme={theme} />
              </Box>
            </Zoom>
            
            {/* 404 Numbers */}
            <Slide direction="up" in timeout={2000}>
              <Box>
                <AnimatedNumbers theme={theme} />
              </Box>
            </Slide>
            
            {/* Error Message */}
            <Fade in timeout={2500}>
              <Stack spacing={2} alignItems="center">
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                    animation: `${fadeInUp} 1s ease-out 2.5s both`,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  Oops! Page Not Found
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    maxWidth: 600,
                    lineHeight: 1.6,
                    animation: `${fadeInUp} 1s ease-out 3s both`,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Sorry, we couldn't find the page you're looking for.
                </Typography>
              </Stack>
            </Fade>
            
            {/* Action Buttons */}
            <Fade in timeout={3500}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ 
                  mt: 4,
                  animation: `${fadeInUp} 1s ease-out 3.5s both`
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<IconHome size={20} />}
                  onClick={handleGoHome}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 25px ${theme.palette.primary.main}50`,
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Go Home
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<IconArrowLeft size={20} />}
                  onClick={handleGoBack}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      backgroundColor: `${theme.palette.primary.main}10`,
                      boxShadow: `0 8px 20px ${theme.palette.primary.main}20`
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Go Back
                </Button>
              </Stack>
            </Fade>
            
            {/* Additional Info */}
            <Fade in timeout={4000}>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.disabled,
                  mt: 2,
                  animation: `${fadeInUp} 1s ease-out 4s both`,
                  fontSize: '0.9rem'
                }}
              >
                Error Code: 404 | The requested resource was not found
              </Typography>
            </Fade>
          </Stack>
        </Fade>
      </Container>
    </Box>
  );
};

export default NotFoundPage; 