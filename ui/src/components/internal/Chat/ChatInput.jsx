import React, { useRef, useState } from "react";
import { Box, TextField, IconButton, Button, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";

const ChatInput = ({ onSend, isBusy = false }) => {
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() && !files.length) return;
    onSend?.({ text: message.trim(), files });
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
        padding: "16px 24px",
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: theme.palette.background.default,
          borderRadius: "12px",
          padding: "8px 16px",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Microphone icon */}
        <IconButton sx={{ color: theme.palette.text.secondary, padding: 0.5 }}>
          <Icon icon="mdi:microphone" width={20} />
        </IconButton>

        {/* Attachment icon */}
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
          placeholder="Ask the agent to do anything"
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: theme.palette.text.primary,
              fontSize: "14px",
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
          disabled={isBusy || (!message.trim() && !files.length)}
          sx={{
            color: message.trim() || files.length
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            padding: 0.5,
          }}
        >
          <Icon icon="mdi:arrow-up" width={20} />
        </IconButton>
      </Box>
      {files.length ? (
        <Box sx={{ mt: 1, color: theme.palette.text.secondary, fontSize: "12px" }}>
          Attached: {files.map((f) => f.name).join(", ")}
        </Box>
      ) : null}
    </Box>
  );
};

export default ChatInput;
