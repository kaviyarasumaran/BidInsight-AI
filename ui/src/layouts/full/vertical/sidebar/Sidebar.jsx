import React from "react";
import { useState } from "react";
import {
  Box,
  Drawer,
  useMediaQuery,
  styled,
  IconButton,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import SidebarItems from "./SidebarItems";
import ExpandedSidebar from "./ExpandedSidebar";

const drawerWidth = {
  expanded: 450, // Wider for expanded content
  collapsed: 100,
};

const MainWrapper = styled("div", {
  shouldForwardProp: (prop) => !["isCollapsed"].includes(prop),
})(({ theme, isCollapsed }) => ({
  height: "calc(100vh - 20px)", // Subtract header height
  marginTop: "10px", // Add margin for header
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  width: isCollapsed ? drawerWidth.collapsed : drawerWidth.expanded,
  transition: theme.transitions.create(["width", "margin-top"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  overflow: "hidden",
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingLeft: theme.spacing(4),
  fontSize: "1.25rem",
  fontWeight: "bold",
}));

const ToggleWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "auto",
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.04)",
  },
}));

const ContentWrapper = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden auto", // Enable scrolling for content
});

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => !["isCollapsed"].includes(prop),
})(({ theme, isCollapsed }) => ({
  width: drawerWidth.collapsed,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    marginTop: "70px",
    height: "calc(100% - 70px)",
    overflow: "hidden",
    backgroundColor: theme.palette.background.default,
    width: isCollapsed ? drawerWidth.collapsed : drawerWidth.expanded,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: 1201,
    borderRight: "none",
    position: "fixed",
    "&::after": {
      content: '""',
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: "1px",
      backgroundColor: theme.palette.divider,
      zIndex: 1202,
    },
  },
}));

const Sidebar = (props) => {
  const {
    isMobileSidebarOpen,
    onSidebarClose,
    onItemClick,
    activeItem = "prompt",
  } = props;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially collapsed

  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleSidebarItemClick = (itemId) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  const sidebarContent = (
    <MainWrapper isCollapsed={isSmallScreen || isCollapsed}>
      {isCollapsed ? (
        <ContentWrapper>
          <Box>
            <SidebarItems
              isCollapsed={isSmallScreen || isCollapsed}
              onItemClick={handleSidebarItemClick}
              activeItem={activeItem}
            />
          </Box>
        </ContentWrapper>
      ) : (
        <ExpandedSidebar />
      )}
      {!isSmallScreen && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ToggleButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s",
            }}
          >
            <Icon
              icon="mdi:chevron-right"
              width={20}
              color={theme.palette.text.primary}
            />
          </ToggleButton>
        </Box>
      )}
    </MainWrapper>
  );

  // For mobile screens
  if (isSmallScreen) {
    return (
      <StyledDrawer
        anchor="left"
        open={isMobileSidebarOpen}
        onClose={onSidebarClose}
        variant="temporary"
        isCollapsed={true}
        PaperProps={{
          sx: {
            width: drawerWidth.collapsed,
          },
        }}
      >
        {sidebarContent}
      </StyledDrawer>
    );
  }

  // For tablet and desktop screens
  return (
    <StyledDrawer variant="permanent" isCollapsed={isCollapsed} open={true}>
      {sidebarContent}
    </StyledDrawer>
  );
};

export default Sidebar;
