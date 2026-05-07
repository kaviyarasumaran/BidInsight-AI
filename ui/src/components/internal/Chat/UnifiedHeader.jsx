import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";

const UnifiedHeader = ({ onMinimizeTaskPanel, isTaskPanelMinimized }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: "48px",
      }}
    >
      {/* Left side - Chat Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Icon icon="mdi:chat" width={20} color={theme.palette.primary.main} />
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Chat
        </Typography>
      </Box>

      {/* Center - Drag Handle (when task panel is visible) */}
      {!isTaskPanelMinimized && (
        <Box
          sx={{
            width: "1px",
            height: "24px",
            backgroundColor: theme.palette.divider,
            margin: "0 16px",
          }}
        />
      )}

      {/* Right side - Task List Title and Actions */}
      {!isTaskPanelMinimized ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Icon
            icon="mdi:format-list-bulleted"
            width={20}
            color={theme.palette.primary.main}
          />
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Task List
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: 2,
            }}
          >
            <IconButton
              sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
            >
              <Icon icon="mdi:content-copy" width={16} />
            </IconButton>
            <IconButton
              onClick={onMinimizeTaskPanel}
              sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
            >
              <Icon icon="mdi:chevron-right" width={16} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
          >
            <Icon icon="mdi:fullscreen" width={16} />
          </IconButton>
          <IconButton
            sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
          >
            <Icon icon="mdi:dots-vertical" width={16} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default UnifiedHeader;
