import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  useTheme,
  Stack,
  Fade,
  Slide,
  Zoom,
  CircularProgress
} from '@mui/material';
import { keyframes } from '@mui/system';
import { IconArrowLeft, IconTool, IconSettings, IconHammer } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
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

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Animated Tools Component
const AnimatedTools = ({ theme }) => (
  <Box
    sx={{
      animation: `${float} 3s ease-in-out infinite`,
      width: 280,
      height: 280,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}
  >
    {/* Central Gear */}
    <Box
      sx={{
        position: 'absolute',
        width: 120,
        height: 120,
        animation: `${rotate} 10s linear infinite`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        <path
          d="M60 0 L65 40 L100 40 L70 60 L80 90 L60 70 L40 90 L50 60 L20 40 L55 40 Z"
          fill={theme.palette.primary.main}
        />
      </svg>
    </Box>

    {/* Rotating Tools */}
    <Box
      sx={{
        position: 'absolute',
        width: 200,
        height: 200,
        animation: `${rotate} 15s linear infinite reverse`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconTool
        size={40}
        style={{
          position: 'absolute',
          top: 0,
          color: theme.palette.secondary.main,
          animation: `${pulse} 2s ease-in-out infinite`
        }}
      />
      <IconSettings
        size={40}
        style={{
          position: 'absolute',
          right: 0,
          color: theme.palette.warning.main,
          animation: `${pulse} 2s ease-in-out infinite 0.5s`
        }}
      />
      <IconHammer
        size={40}
        style={{
          position: 'absolute',
          bottom: 0,
          color: theme.palette.error.main,
          animation: `${pulse} 2s ease-in-out infinite 1s`
        }}
      />
    </Box>

    {/* Progress Circle */}
    <CircularProgress
      variant="determinate"
      value={75}
      size={280}
      thickness={4}
      sx={{
        position: 'absolute',
        color: theme.palette.primary.main,
        animation: `${spin} 20s linear infinite`,
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        }
      }}
    />
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
    {/* Floating gears */}
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: 20 + (i * 5),
          height: 20 + (i * 5),
          animation: `${rotate} ${10 + i}s linear infinite ${i * 0.5}s`,
          top: `${10 + (i * 10)}%`,
          left: `${5 + (i * 10)}%`,
          opacity: 0.2
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <path
            d="M50 0 L55 40 L90 40 L60 60 L70 90 L50 70 L30 90 L40 60 L10 40 L45 40 Z"
            fill={theme.palette.primary.main}
          />
        </svg>
      </Box>
    ))}
    
    {/* Floating tools */}
    {[...Array(4)].map((_, i) => (
      <Box
        key={`tool-${i}`}
        sx={{
          position: 'absolute',
          width: 30 + (i * 10),
          height: 30 + (i * 10),
          animation: `${float} ${3 + i}s ease-in-out infinite ${i * 0.5}s`,
          top: `${30 + (i * 15)}%`,
          right: `${10 + (i * 12)}%`,
          opacity: 0.3,
          color: theme.palette.secondary.main
        }}
      >
        {i % 3 === 0 ? (
          <IconTool size={30 + (i * 10)} />
        ) : i % 3 === 1 ? (
          <IconSettings size={30 + (i * 10)} />
        ) : (
          <IconHammer size={30 + (i * 10)} />
        )}
      </Box>
    ))}
  </Box>
);

const Maintenance = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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
            {/* Tools Animation */}
            <Zoom in timeout={1500}>
              <Box>
                <AnimatedTools theme={theme} />
              </Box>
            </Zoom>
            
            {/* Maintenance Text */}
            <Slide direction="up" in timeout={2000}>
              <Stack spacing={1.5} alignItems="center">
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    animation: `${fadeInUp} 1s ease-out 2.5s both`,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textAlign: 'center'
                  }}
                >
                  Under Maintenance
                </Typography>
                
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.text.secondary,
                    maxWidth: 500,
                    lineHeight: 1.5,
                    animation: `${fadeInUp} 1s ease-out 3s both`,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    textAlign: 'center'
                  }}
                >
                  We're currently performing scheduled maintenance to improve your experience.
                  Please check back soon!
                </Typography>
              </Stack>
            </Slide>
            
            {/* Action Button */}
            <Fade in timeout={3500}>
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
            </Fade>
          </Stack>
        </Fade>
      </Container>
    </Box>
  );
};

export default Maintenance; 