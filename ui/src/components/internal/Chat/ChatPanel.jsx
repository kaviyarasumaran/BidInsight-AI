import React, { useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import MessageBubble from "./MessageBubble";

const ChatPanel = ({
  initialMessage,
  onTaskUpdate,
  onAuditComplete,
  onSwitchToDocuments,
  messages: externalMessages,
  errorMessage,
}) => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);

  const messages = externalMessages || [];

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show conversation when initial message is provided
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Chat Messages Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          padding: "24px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.background.default,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.grey[300],
            borderRadius: "3px",
          },
        }}
      >
        {!messages.length ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
            }}
          >
            <Icon
              icon="mdi:chat-outline"
              width={80}
              color={theme.palette.text.secondary}
              style={{ marginBottom: "24px" }}
            />
            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              No messages yet
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "14px",
                textAlign: "center",
                maxWidth: "320px",
              }}
            >
              Send text and/or attach files to start processing.
            </Typography>
          </Box>
        ) : null}
        {errorMessage ? (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: "10px",
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            }}
          >
            {errorMessage}
          </Box>
        ) : null}
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            type={msg.type}
            kind={msg._kind}
            message={msg.message}
            steps={msg.steps}
            progress={msg.progress}
            current_step={msg.current_step}
            showFile={msg.showFile}
            title={msg.title}
            activeTab={msg.activeTab}
            command={msg.command}
            path={msg.path}
            files={msg.files}
            language={msg.language}
            content={msg.content}
            toolName={msg.toolName}
            filePath={msg.filePath}
            fileName={msg.fileName}
            fileType={msg.fileType}
            summary={msg.summary}
            total={msg.total}
            pending={msg.pending}
            inProgress={msg.inProgress}
            completed={msg.completed}
            tasks={msg.tasks}
            totalClaims={msg.totalClaims}
            compliantClaims={msg.compliantClaims}
            nonCompliantClaims={msg.nonCompliantClaims}
            complianceRate={msg.complianceRate}
            reports={msg.reports}
            onViewReport={msg.onViewReport}
            onViewReportClick={() => {
              if (msg.type === "audit-complete" && onAuditComplete) {
                const reportData = {
                  totalClaims: msg.totalClaims,
                  compliantClaims: msg.compliantClaims,
                  nonCompliantClaims: msg.nonCompliantClaims,
                  complianceRate: msg.complianceRate,
                  reports: msg.reports,
                };
                onAuditComplete(reportData);
                // Switch to Documents tab to view the audit report
                if (onSwitchToDocuments) {
                  onSwitchToDocuments();
                }
              }
            }}
          />
        ))}
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};

export default ChatPanel;
