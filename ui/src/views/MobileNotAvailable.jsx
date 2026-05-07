import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  useTheme,
  Stack,
  Fade,
  Slide,
  useMediaQuery
} from '@mui/material';
import { keyframes } from '@mui/system';
import { IconDeviceMobile } from '@tabler/icons-react';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

// Animated Mobile Device Component
const AnimatedMobile = ({ theme }) => (
  <Box
    sx={{
      animation: `${float} 3s ease-in-out infinite`,
      width: 200,
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
      {/* Mobile Device Body */}
      <rect
        x="60"
        y="40"
        width="80"
        height="120"
        rx="10"
        fill={theme.palette.primary.main}
      />
      
      {/* Screen */}
      <rect
        x="70"
        y="50"
        width="60"
        height="90"
        rx="5"
        fill={theme.palette.background.paper}
      />
      
      {/* Home Button */}
      <circle
        cx="100"
        cy="150"
        r="5"
        fill={theme.palette.primary.dark}
      />
      
      {/* Signal Waves */}
      <g sx={{ animation: `${pulse} 2s ease-in-out infinite` }}>
        {[...Array(3)].map((_, i) => (
          <path
            key={i}
            d={`M${120 + (i * 15)},${70 + (i * 10)} Q${130 + (i * 15)},${60 + (i * 10)} ${140 + (i * 15)},${70 + (i * 10)}`}
            stroke={theme.palette.primary.light}
            strokeWidth="2"
            fill="none"
          />
        ))}
      </g>
    </svg>
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
    {/* Floating elements */}
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: 4 + (i * 2),
          height: 4 + (i * 2),
          background: theme.palette.primary.main,
          borderRadius: '50%',
          animation: `${pulse} ${2 + i}s ease-in-out infinite ${i * 0.3}s`,
          top: `${10 + (i * 8)}%`,
          left: `${5 + (i * 8)}%`,
          opacity: 0.6
        }}
      />
    ))}
  </Box>
);

const MobileNotAvailable = () => {
  const theme = useTheme();

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
      
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <Stack spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Mobile Animation */}
            <Slide direction="up" in timeout={1500}>
              <Box>
                <AnimatedMobile theme={theme} />
              </Box>
            </Slide>
            
            {/* Text Content */}
            <Stack spacing={2} alignItems="center">
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  animation: `${fadeInUp} 1s ease-out 2.5s both`,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  textAlign: 'center'
                }}
              >
                Mobile View Not Available
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 400,
                  lineHeight: 1.6,
                  animation: `${fadeInUp} 1s ease-out 3s both`,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textAlign: 'center'
                }}
              >
                Please access this application on a desktop or tablet device for the best experience.
              </Typography>
            </Stack>
          </Stack>
        </Fade>
      </Container>
    </Box>
  );
};

export default MobileNotAvailable; 