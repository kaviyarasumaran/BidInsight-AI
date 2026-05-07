import React from "react";
import { Box, Typography, IconButton, useTheme, Stack } from "@mui/material";
import { Icon } from "@iconify/react";

const MessageBubble = ({
  message,
  type = "user",
  kind,
  steps = [],
  progress,
  current_step,
  showIcon = true,
  showFile = false,
  title,
  activeTab,
  command,
  path,
  files,
  language,
  content,
  toolName,
  filePath,
  fileName,
  fileType,
  summary,
  total,
  pending,
  inProgress,
  completed,
  tasks,
  totalClaims,
  compliantClaims,
  nonCompliantClaims,
  complianceRate,
  reports,
  onViewReport,
  onViewReportClick,
}) => {
  const theme = useTheme();
  const isUser = type === "user";
  const isAssistant = type === "assistant";
  const isThinking = type === "thinking";
  const isFileManager = type === "file-manager";
  const isCommand = type === "command";
  const isCommandResult = type === "command-result";
  const isToolCall = type === "tool-call";
  const isToolResult = type === "tool-result";
  const isFileList = type === "file-list";
  const isTodoSummary = type === "todo-summary";
  const isAuditComplete = type === "audit-complete";
  const isJobStatus = kind === "job_status";

  const getIcon = () => {
    if (isUser) return "mdi:account";
    if (isThinking) return "mdi:robot";
    if (isAssistant) return "mdi:star";
    return "mdi:account";
  };

  const getIconColor = () => {
    if (isThinking) return "#2196F3"; // Blue for robot
    if (isAssistant) return "#9C27B0"; // Purple for star
    return theme.palette.text.primary;
  };

  const getBackgroundColor = () => {
    if (isUser) return theme.palette.background.paper; // White background
    if (isThinking) return "#E3F2FD"; // Light blue background for robot
    if (isAssistant) return "#E1BEE7"; // Light purple background
    return theme.palette.background.paper;
  };

  const getLabel = () => {
    if (isUser) return "Query:";
    if (isThinking) return "thinking";
    if (isAssistant) return "assistant";
    if (isFileManager) return "Available Files";
    if (isCommand) return "Execute Command";
    return "";
  };

  // Render file manager interface
  if (isFileManager) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[100],
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                ml: "auto",
              }}
            >
              <Box
                sx={{
                  padding: "2px 8px",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: "4px",
                  fontSize: "10px",
                }}
              >
                {activeTab}
              </Box>
            </Box>
          </Box>

          {/* Command bar */}
          <Box
            sx={{
              padding: "8px 16px",
              backgroundColor: theme.palette.grey[50],
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                color: theme.palette.text.secondary,
                fontFamily: "monospace",
              }}
            >
              {command} {path}
            </Typography>
          </Box>

          {/* Files list */}
          <Box sx={{ padding: "12px 16px" }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                marginBottom: 1,
              }}
            >
              {getLabel()}
            </Typography>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: "4px 0",
                }}
              >
                <Icon
                  icon="mdi:file-zip"
                  width={16}
                  color={theme.palette.text.secondary}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: theme.palette.text.primary,
                    fontFamily: "monospace",
                  }}
                >
                  {file.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  // Render command interface
  if (isCommand) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.grey[900],
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Command header */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[800],
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon
              icon="mdi:console"
              width={16}
              color={theme.palette.text.secondary}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {getLabel()}
            </Typography>
          </Box>

          {/* Command content */}
          <Box
            sx={{
              padding: "12px 16px",
              fontFamily: "monospace",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.primary,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              $ {message}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Render command result
  if (isCommandResult) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Result header */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[100],
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                sx={{
                  padding: "2px 8px",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: "4px",
                  fontSize: "10px",
                }}
              >
                bash
              </Box>
              <IconButton size="small">
                <Icon icon="mdi:chevron-up" width={14} />
              </IconButton>
            </Box>
          </Box>

          {/* Result content */}
          <Box
            sx={{
              padding: "12px 16px",
              fontFamily: "monospace",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.primary,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              {content}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Render tool call
  if (isToolCall) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Tool header */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[100],
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon
              icon="mdi:code-braces"
              width={16}
              color={theme.palette.text.secondary}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {toolName}
            </Typography>
            {fileName && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  ml: "auto",
                }}
              >
                <Icon
                  icon="mdi:file"
                  width={14}
                  color={theme.palette.text.secondary}
                />
                <Typography
                  sx={{ fontSize: "10px", color: theme.palette.text.secondary }}
                >
                  {fileName}
                </Typography>
                <Box
                  sx={{
                    padding: "1px 4px",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "2px",
                    fontSize: "8px",
                  }}
                >
                  {fileType}
                </Box>
              </Box>
            )}
          </Box>

          {/* Command details */}
          <Box sx={{ padding: "12px 16px" }}>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.primary,
                marginBottom: 1,
              }}
            >
              Command: {command}
            </Typography>
            {filePath && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                  fontFamily: "monospace",
                }}
              >
                File path: {filePath}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Render tool result
  if (isToolResult) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Result header */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[100],
              padding: "8px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon
              icon="mdi:console"
              width={16}
              color={theme.palette.text.secondary}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Tool Call Result #bdrk
            </Typography>
          </Box>

          {/* Result content */}
          <Box
            sx={{
              padding: "12px 16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.primary,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
              }}
            >
              {content}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Render file list
  if (isFileList) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: theme.palette.grey[100],
              padding: "12px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon
              icon="mdi:folder"
              width={16}
              color={theme.palette.text.secondary}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Files list */}
          <Box sx={{ padding: "12px 16px" }}>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: "8px",
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: "6px",
                  marginBottom: 1,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "4px",
                    backgroundColor:
                      file.type === "pdf"
                        ? "#4CAF50"
                        : file.type === "json"
                        ? "#2196F3"
                        : file.type === "xlsx"
                        ? "#FF9800"
                        : "#9C27B0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon icon="mdi:file-document" width={14} color="white" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: theme.palette.text.secondary,
                      fontFamily: "monospace",
                    }}
                  >
                    {file.path}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  // Render audit complete
  if (isAuditComplete) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Audit Complete Header */}
          <Box
            sx={{
              backgroundColor: "#E8F5E8",
              padding: "12px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "4px",
                  backgroundColor: "#4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:check" width={12} color="white" />
              </Box>
              <Box
                sx={{
                  padding: "2px 8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "10px",
                }}
              >
                Audit Complete
              </Box>
            </Box>
            <IconButton size="small">
              <Icon icon="mdi:chevron-up" width={14} />
            </IconButton>
          </Box>

          {/* Audit Summary */}
          <Box sx={{ padding: "12px 16px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                marginBottom: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
                marginBottom: 2,
              }}
            >
              {summary}
            </Typography>

            {/* Audit Statistics */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginBottom: 2,
                padding: "12px",
                backgroundColor: theme.palette.grey[50],
                borderRadius: "6px",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {totalClaims}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Total Claims
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#4CAF50",
                  }}
                >
                  {compliantClaims}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Compliant
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#F44336",
                  }}
                >
                  {nonCompliantClaims}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Non-Compliant
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {complianceRate}%
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Compliance Rate
                </Typography>
              </Box>
            </Box>

            {/* View Report Button */}
            {onViewReport && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <IconButton
                  onClick={onViewReportClick}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: "8px 16px",
                    borderRadius: "6px",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <Icon
                    icon="mdi:file-document"
                    width={16}
                    style={{ marginRight: "8px" }}
                  />
                  <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                    View Audit Report
                  </Typography>
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Render todo summary
  if (isTodoSummary) {
    return (
      <Box
        sx={{
          marginBottom: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Todo header */}
          <Box
            sx={{
              backgroundColor: "#E3F2FD",
              padding: "12px 16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "4px",
                  backgroundColor: "#4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:check" width={12} color="white" />
              </Box>
              <Box
                sx={{
                  padding: "2px 8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "10px",
                }}
              >
                Todo
              </Box>
            </Box>
            <IconButton size="small">
              <Icon icon="mdi:chevron-up" width={14} />
            </IconButton>
          </Box>

          {/* Todo content */}
          <Box sx={{ padding: "12px 16px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                marginBottom: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
                marginBottom: 2,
              }}
            >
              {summary}
            </Typography>

            {/* Warning messages */}
            <Box
              sx={{
                backgroundColor: "#FFF3CD",
                border: "1px solid #FFEAA7",
                borderRadius: "4px",
                padding: "8px 12px",
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Icon icon="mdi:alert" width={16} color="#856404" />
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#856404",
                }}
              >
                IMPORTANT: Todo list updated but NOT COMPLETE! You MUST continue
                working. Total: {total} (Pending: {pending}, In Progress:{" "}
                {inProgress}, Completed: {completed})
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "#F8D7DA",
                border: "1px solid #F5C6CB",
                borderRadius: "4px",
                padding: "8px 12px",
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Icon icon="mdi:alert-circle" width={16} color="#721C24" />
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#721C24",
                }}
              >
                CRITICAL: You have {total} unfinished tasks. DO NOT STOP.
                Continue immediately with the next task.
              </Typography>
            </Box>

            {/* Tasks list */}
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                marginBottom: 1,
              }}
            >
              Incomplete tasks:
            </Typography>
            <Box sx={{ pl: 2 }}>
              {tasks.map((task, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: "11px",
                    color: theme.palette.text.primary,
                    marginBottom: 0.5,
                    lineHeight: 1.4,
                  }}
                >
                  • {task}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Render job status progress tracker
  if (isJobStatus) {
    return (
      <Box sx={{ marginBottom: 2, width: "100%" }}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        >
          {/* Progress Header */}
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Icon icon="mdi:cog" width={20} className={progress < 100 ? "spin" : ""} />
              <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                {progress === 100 ? "Processing Complete" : "Tender Processing"}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Box>

          {/* Steps List */}
          <Box sx={{ padding: "16px" }}>
            <Stack spacing={1.5} sx={{ display: "flex", flexDirection: "column" }}>
              {steps.map((step, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {step.status === "completed" ? (
                      <Icon icon="mdi:check-circle" color={theme.palette.success.main} width={20} />
                    ) : step.status === "processing" ? (
                      <Icon icon="mdi:loading" className="spin" color={theme.palette.primary.main} width={20} />
                    ) : (
                      <Icon icon="mdi:circle-outline" color={theme.palette.text.disabled} width={20} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      sx={{ 
                        fontSize: "13px", 
                        fontWeight: step.status === "processing" ? 600 : 400,
                        color: step.status === "pending" ? theme.palette.text.disabled : theme.palette.text.primary
                      }}
                    >
                      {step.label}
                    </Typography>
                    {step.status === "processing" && current_step && (
                      <Typography sx={{ fontSize: "11px", color: theme.palette.text.secondary }}>
                        {current_step}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
          
          {/* Progress Bar Background */}
          <Box sx={{ height: "4px", backgroundColor: theme.palette.grey[100], width: "100%" }}>
            <Box 
              sx={{ 
                height: "100%", 
                width: `${progress}%`, 
                backgroundColor: theme.palette.primary.main,
                transition: "width 0.5s ease-in-out"
              }} 
            />
          </Box>
        </Box>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spin {
              animation: spin 2s linear infinite;
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginBottom: 2,
        width: "100%",
      }}
    >
      {/* Message Content with Label */}
      <Box
        sx={{
          backgroundColor: getBackgroundColor(),
          borderRadius: "8px",
          padding: "16px",
          position: "relative",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Label with Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            marginBottom: 1,
          }}
        >
          <Icon icon={getIcon()} width={16} color={getIconColor()} />
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "lowercase",
            }}
          >
            {getLabel()}
          </Typography>
        </Box>

        {/* File attachment */}
        {showFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: theme.palette.grey[200],
              borderRadius: "6px",
              padding: "8px 12px",
              marginBottom: 1,
            }}
          >
            <Icon
              icon="mdi:file-zip"
              width={16}
              color={theme.palette.text.primary}
            />
            <Typography
              sx={{ color: theme.palette.text.primary, fontSize: "12px" }}
            >
              claims-data-syn.zip
            </Typography>
            <IconButton
              size="small"
              sx={{ color: theme.palette.text.primary, padding: 0.5 }}
            >
              <Icon icon="mdi:delete" width={14} />
            </IconButton>
          </Box>
        )}

        {/* Message text */}
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: "14px",
            lineHeight: 1.6,
            wordBreak: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
