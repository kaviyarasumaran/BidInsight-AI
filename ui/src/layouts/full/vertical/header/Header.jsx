import React from "react";
import { useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  styled,
  Stack,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  IconChevronDown,
  IconWorld,
  IconPlugConnected,
  IconHelp,
  IconMenu2,
} from "@tabler/icons-react";
import CubeIcon from "../../../../components/icons/CubeIcon";
import AccountPopover from "./AccountPopover";
import NotificationPopover from "./NotificationPopover";
import FeedbackPopover from "./FeedbackPopover";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: "70px",
  justifyContent: "center",
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
}));

const StyledToolbar = styled(Toolbar)({
  height: "70px",
  minHeight: "70px !important",
  padding: "0 24px !important",
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "600",
  color: theme.palette.primary.main,
  letterSpacing: "0.5px",
  marginRight: theme.spacing(4),
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const VersionText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: "500",
  color: theme.palette.text.secondary,
  letterSpacing: "0.5px",
  backgroundColor: theme.palette.background.paper,
  padding: "2px 6px",
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
}));

const ConnectButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  textTransform: "none",
  fontSize: "12px",
  fontWeight: "600",
  padding: theme.spacing(1, 3),
  borderRadius: "20px",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
  gap: "8px",
  whiteSpace: "nowrap",
}));

const Header = ({ toggleMobileSidebar }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        {isSmallScreen && (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileSidebar}
            sx={{ mr: 1 }}
          >
            <IconMenu2 size={24} />
          </IconButton>
        )}

        <Box display="flex" alignItems="center" gap={1} mr={4}>
          <LogoText component="span">BitInsight AI</LogoText>
          {/* <VersionText component="span">v0.2</VersionText> */}
        </Box>

        {/* <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ minWidth: "fit-content" }}
        >
          <IconWorld size={24} stroke={1.5} />
          <Typography fontWeight="bold" component="div" noWrap>
            Banking
          </Typography>
          <IconButton size="small">
            <IconChevronDown size={20} />
          </IconButton>
        </Stack> */}

        {/* {!isTablet && (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 'fit-content' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton sx={{ p: 1 }}>
                <CubeIcon size={20} />
              </IconButton>
              <Typography component="span" noWrap>Agents</Typography>
              <IconButton size="small">
                <IconChevronDown size={20} />
              </IconButton>
            </Stack>

            <ConnectButton
              variant="contained"
              startIcon={<IconPlugConnected size={20} stroke={1.5} />}
            >
              Connect
            </ConnectButton>
          </Stack>
        )} */}

        <Box sx={{ flexGrow: 1 }} />

        {/* Right side components */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ minWidth: "fit-content" }}
        >
          {/* <FeedbackPopover /> */}

          {/* <NotificationPopover /> */}

          <IconButton>
            <IconHelp size={24} stroke={1.5} />
          </IconButton>

          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Header;
