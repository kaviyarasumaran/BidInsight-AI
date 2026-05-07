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
  Zoom
} from '@mui/material';
import { keyframes } from '@mui/system';
import { IconRocket, IconArrowLeft } from '@tabler/icons-react';
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

// Animated Rocket Component
const AnimatedRocket = ({ theme }) => (
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
      {/* Rocket Body */}
      <path
        d="M140 40 L180 120 L140 200 L100 120 Z"
        fill={theme.palette.primary.main}
      />
      
      {/* Rocket Window */}
      <circle
        cx="140"
        cy="100"
        r="20"
        fill={theme.palette.background.paper}
      />
      <circle
        cx="140"
        cy="100"
        r="10"
        fill={theme.palette.primary.light}
      />
      
      {/* Rocket Fins */}
      <path
        d="M140 200 L160 240 L140 220 L120 240 Z"
        fill={theme.palette.primary.dark}
      />
      
      {/* Rocket Flame */}
      <path
        d="M120 240 Q140 280 160 240"
        fill={theme.palette.error.main}
        opacity="0.8"
      />
      
      {/* Stars */}
      <g sx={{ animation: `${pulse} 2s ease-in-out infinite` }}>
        {[...Array(6)].map((_, i) => (
          <path
            key={i}
            d={`M${40 + (i * 40)},${40 + (i * 20)} L${45 + (i * 40)},${45 + (i * 20)} L${40 + (i * 40)},${50 + (i * 20)} L${35 + (i * 40)},${45 + (i * 20)} Z`}
            fill={theme.palette.warning.main}
            opacity="0.8"
          />
        ))}
      </g>
      
      {/* Orbiting Planet */}
      <circle
        cx="200"
        cy="80"
        r="30"
        fill={theme.palette.secondary.main}
        opacity="0.8"
      />
      <circle
        cx="200"
        cy="80"
        r="25"
        fill={theme.palette.secondary.light}
        opacity="0.6"
      />
      
      {/* Orbiting Moon */}
      <circle
        cx="220"
        cy="60"
        r="10"
        fill={theme.palette.grey[400]}
        opacity="0.8"
        sx={{
          animation: `${rotate} 4s linear infinite`,
          transformOrigin: '200px 80px'
        }}
      />
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
    {/* Floating stars */}
    {[...Array(12)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: 4 + (i * 2),
          height: 4 + (i * 2),
          background: theme.palette.warning.main,
          borderRadius: '50%',
          animation: `${pulse} ${2 + i}s ease-in-out infinite ${i * 0.3}s`,
          top: `${10 + (i * 8)}%`,
          left: `${5 + (i * 8)}%`,
          opacity: 0.6
        }}
      />
    ))}
    
    {/* Floating planets */}
    {[...Array(4)].map((_, i) => (
      <Box
        key={`planet-${i}`}
        sx={{
          position: 'absolute',
          width: 20 + (i * 10),
          height: 20 + (i * 10),
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}40, ${theme.palette.primary.main}40)`,
          borderRadius: '50%',
          animation: `${float} ${3 + i}s ease-in-out infinite ${i * 0.5}s`,
          top: `${30 + (i * 15)}%`,
          right: `${10 + (i * 12)}%`,
          opacity: 0.4
        }}
      />
    ))}
  </Box>
);

const ComingSoon = () => {
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
            {/* Rocket Animation */}
            <Zoom in timeout={1500}>
              <Box>
                <AnimatedRocket theme={theme} />
              </Box>
            </Zoom>
            
            {/* Coming Soon Text */}
            <Slide direction="up" in timeout={2000}>
              <Stack spacing={2} alignItems="center">
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    animation: `${fadeInUp} 1s ease-out 2.5s both`,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textAlign: 'center'
                  }}
                >
                  Coming Soon
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    maxWidth: 600,
                    lineHeight: 1.6,
                    animation: `${fadeInUp} 1s ease-out 3s both`,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    textAlign: 'center'
                  }}
                >
                  We're working on something amazing. Stay tuned for updates!
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

export default ComingSoon; 