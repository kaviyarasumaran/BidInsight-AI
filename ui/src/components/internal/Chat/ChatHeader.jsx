import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";

const ChatHeader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: "60px",
      }}
    >
      {/* Left side - Space holder */}
      <Box sx={{ flex: 1 }} />

      {/* Center/Right side - Space holder */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }} />
    </Box>
  );
};

export default ChatHeader;
