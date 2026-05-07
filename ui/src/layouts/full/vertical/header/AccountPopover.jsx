import React from "react";
import { useState } from "react";
import {
  Box,
  Avatar,
  Popover,
  Typography,
  Stack,
  Divider,
  styled,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

const PopoverContent = styled(Box)(({ theme }) => ({
  width: 240,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const MenuItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AccountPopover = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Avatar
        onClick={handleClick}
        sx={{
          width: 36,
          height: 36,
          cursor: "pointer",
          border: "2px solid transparent",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        <Icon icon="mdi:account" width={20} />
      </Avatar>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <PopoverContent>
          {/* Profile Section */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <Icon icon="mdi:account" width={24} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                HelixAudit User
              </Typography>
              <Typography variant="body2" color="text.secondary">
                user@helixaudit.ai
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 1 }} />

          {/* Menu Items */}
          <MenuItem>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              onClick={handleClose}
            >
              <Icon
                icon="mdi:account-outline"
                width={20}
                color={theme.palette.text.primary}
              />
              <Typography>Profile</Typography>
            </Stack>
          </MenuItem>

          <MenuItem>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              onClick={handleClose}
            >
              <Icon
                icon="mdi:cog-outline"
                width={20}
                color={theme.palette.text.primary}
              />
              <Typography>Preferences</Typography>
            </Stack>
          </MenuItem>

          <MenuItem>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              onClick={handleClose}
            >
              <Icon
                icon="mdi:shield-account-outline"
                width={20}
                color={theme.palette.text.primary}
              />
              <Typography>Security</Typography>
            </Stack>
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              onClick={handleClose}
              sx={{ color: "error.main" }}
            >
              <Icon
                icon="mdi:logout"
                width={20}
                color={theme.palette.error.main}
              />
              <Typography>Logout</Typography>
            </Stack>
          </MenuItem>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AccountPopover;
