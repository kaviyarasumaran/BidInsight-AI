import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  useTheme,
  Stack,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";

const InitialChatView = ({ onStartChat, recentChats = [] }) => {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() && !files.length) return;
    onStartChat({ text: message.trim(), files });
    setMessage("");
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: "40px",
      }}
    >
      {/* Welcome Message */}
      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: "32px",
          fontWeight: 600,
          marginBottom: "60px",
          textAlign: "center",
        }}
      >
        How can I help you today?
      </Typography>

      {/* Main Input Area */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "16px",
          padding: "20px",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
        }}
      >
        {/* Input Field */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: theme.palette.background.default,
            borderRadius: "12px",
            padding: "12px 16px",
            border: `1px solid ${theme.palette.divider}`,
            marginBottom: "24px",
          }}
        >
          {/* Microphone icon */}
          <IconButton
            sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
          >
            <Icon icon="mdi:microphone" width={20} />
          </IconButton>

          {/* Paperclip icon */}
          <IconButton
            sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
            onClick={() => fileRef.current?.click()}
          >
            <Icon icon="mdi:paperclip" width={20} />
          </IconButton>
          <input
            ref={fileRef}
            type="file"
            hidden
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          {/* Input field */}
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a "
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                color: theme.palette.text.primary,
                fontSize: "16px",
                "&::placeholder": {
                  color: theme.palette.text.secondary,
                },
              },
            }}
            sx={{
              flex: 1,
              "& .MuiInput-root": {
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              },
            }}
          />

          {/* Send button */}
          <IconButton
            onClick={handleSend}
            disabled={!message.trim() && !files.length}
            sx={{
              color: message.trim()
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              padding: 1,
              backgroundColor: message.trim()
                ? theme.palette.primary.main
                : "transparent",
              "&:hover": {
                backgroundColor: message.trim()
                  ? theme.palette.primary.dark
                  : theme.palette.background.paper,
              },
              "&:disabled": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Icon
              icon="mdi:arrow-up"
              width={20}
              color={
                message.trim()
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary
              }
            />
          </IconButton>
        </Box>

        {files.length ? (
          <Box sx={{ mb: "20px", color: theme.palette.text.secondary, fontSize: "13px" }}>
            Attached: {files.map((f) => f.name).join(", ")}
          </Box>
        ) : null}

        {/* Recent chats */}
        {recentChats?.length ? (
          <Box sx={{ mb: "20px" }}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "13px", mb: 1 }}>
              Recent
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {recentChats.map((t, idx) => (
                <Chip
                  key={idx}
                  label={t.text || t}
                  onClick={() => onStartChat?.(t)}
                  sx={{
                    maxWidth: "100%",
                    "& .MuiChip-label": { maxWidth: 520, overflow: "hidden", textOverflow: "ellipsis" },
                  }}
                />
              ))}
            </Stack>
          </Box>
        ) : null}

        {/* Footer placeholder if needed */}
      </Box>
    </Box>
  );
};

export default InitialChatView;
