import React from "react";
import { RouterProvider } from 'react-router';
import router from './routes/index'
import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
