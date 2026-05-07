import React from "react";
import { Box, Typography, IconButton, useTheme, Button } from "@mui/material";
import { Icon } from "@iconify/react";

const ChatPanelHeader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        minHeight: "48px",
      }}
    >
      <Button
        size="small"
        startIcon={<Icon icon="mdi:plus" />}
        onClick={() => {
          localStorage.removeItem("bidinsight.session.tenderId");
          localStorage.removeItem("bidinsight.session.jobId");
          localStorage.removeItem("bidinsight.session.messages");
          window.location.reload();
        }}
        sx={{ textTransform: "none", color: "text.secondary" }}
      >
        New Chat
      </Button>
      {/* Header intentionally left clean or for future navigation elements */}
    </Box>
  );
};

export default ChatPanelHeader;
