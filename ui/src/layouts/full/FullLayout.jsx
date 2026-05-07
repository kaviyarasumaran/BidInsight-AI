import React from "react";
import { useState } from 'react';
import { Box, styled, useTheme, Container, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Customizer from './shared/customizer/Customizer';
import LoadingBar from '../../LoadingBar';
import Header from './vertical/header/Header';
import Sidebar from './vertical/sidebar/Sidebar';
import SidebarPanel from './vertical/sidebar/SidebarPanel';
import MobileNotAvailable from '../../views/MobileNotAvailable';

const MainWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100%',
  backgroundColor: theme.palette.background.default,
  position: 'relative'
}));

const PageWrapper = styled('div', {
  shouldForwardProp: prop => !['isSidebarCollapsed', 'isPanelVisible'].includes(prop)
})(({ theme, isSidebarCollapsed, isPanelVisible }) => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  marginTop: '70px',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  minHeight: 'calc(100vh - 70px)',
  width: '100%',
  overflowX: 'hidden',
  [theme.breakpoints.up('lg')]: {
    marginLeft: isPanelVisible 
      ? `${isSidebarCollapsed ? 310 : 220}px` 
      : `${isSidebarCollapsed ? 70 : 0.5}px`,
    transition: theme.transitions.create(['margin-left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: 0,
  width: '100%',
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'hidden'
}));

const FullLayout = () => {
  const customizer = useSelector((state) => state.customizer);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activePanelItem, setActivePanelItem] = useState(null);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSidebarItemClick = (itemId) => {
    setActivePanelItem(itemId);
  };

  if (isMobile) {
    return <MobileNotAvailable />;
  }

  return (
    <MainWrapper>
      <LoadingBar />
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        onItemClick={handleSidebarItemClick}
        activeItem={activePanelItem}
      />
      <SidebarPanel isVisible={activePanelItem !== null ? 1 : 0} />
      <PageWrapper
        isSidebarCollapsed={isSmallScreen || customizer.isCollapse}
        isPanelVisible={!isSmallScreen && activePanelItem !== null}
      >
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
        {/* <Customizer /> */}
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
