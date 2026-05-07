import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

const TaskListPanel = ({ taskData }) => {
  const theme = useTheme();
  const tasks = taskData?.tasks || []; // Use real task data if available
  const sampleTasks = [
    {
      id: 1,
      title:
        "Load and review Claims Handling Standards document to understand all 8 sections",
      status: "completed",
    },
    {
      id: 2,
      title: "Load and review audit criteria mapping document",
      status: "completed",
    },
    {
      id: 3,
      title:
        "Load and analyze sample.xlsx to identify all unique claims for auditing",
      status: "completed",
    },
    {
      id: 4,
      title:
        "Load adjuster_notes.json and communication_logs.json for claim details",
      status: "completed",
    },
    {
      id: 5,
      title: "Create systematic audit framework based on 8 standard sections",
      status: "in_progress",
    },
    {
      id: 6,
      title:
        "Systematically audit each claim against all 8 sections with compliance ratings",
      status: "pending",
    },
    {
      id: 7,
      title:
        "Generate individual_claim_audits.json with detailed results for each claim",
      status: "pending",
    },
    {
      id: 8,
      title:
        "Generate audit_summary_report.md with executive summary and recommendations",
      status: "pending",
    },
    {
      id: 9,
      title:
        "Generate compliance_matrix.csv showing status by claim and standard section",
      status: "pending",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <Icon
            icon="mdi:check"
            width={16}
            color={theme.palette.success.main}
          />
        );
      case "in_progress":
        return (
          <Icon icon="mdi:clock" width={16} color={theme.palette.info.main} />
        );
      case "pending":
        return (
          <Icon
            icon="mdi:circle"
            width={16}
            color={theme.palette.text.secondary}
          />
        );
      default:
        return (
          <Icon
            icon="mdi:circle"
            width={16}
            color={theme.palette.text.secondary}
          />
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return theme.palette.success.main;
      case "in_progress":
        return theme.palette.info.main;
      case "pending":
        return theme.palette.text.secondary;
      default:
        return theme.palette.text.secondary;
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Show empty state if no tasks
  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: theme.palette.background.paper,
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <Icon
          icon="mdi:eye-outline"
          width={40}
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
          Waiting for Activity
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "14px",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          Tool outputs and plans will appear here as the agent works
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden", // Prevent overflow conflicts
      }}
    >
      {/* Task List Header Info */}
      <Box
        sx={{
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 1,
          }}
        >
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
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.secondary,
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 500,
              marginLeft: 1,
            }}
          >
            {completedTasks}/{totalTasks}
          </Box>
          <Box
            sx={{
              width: "1px",
              height: "16px",
              backgroundColor: theme.palette.divider,
              margin: "0 8px",
            }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "12px",
            }}
          >
            Real-time task tracking
          </Typography>
        </Box>

        {/* Real-time status indicators */}
        {totalTasks > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginTop: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.success.main,
                }}
              />
              <Typography
                sx={{ fontSize: "11px", color: theme.palette.text.secondary }}
              >
                {completedTasks} completed
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.info.main,
                }}
              />
              <Typography
                sx={{ fontSize: "11px", color: theme.palette.text.secondary }}
              >
                {inProgressTasks} in progress
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.text.secondary,
                }}
              />
              <Typography
                sx={{ fontSize: "11px", color: theme.palette.text.secondary }}
              >
                {pendingTasks} pending
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Progress Bar */}
      <Box sx={{ padding: "16px 20px" }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.background.default,
            "& .MuiLinearProgress-bar": {
              backgroundColor: theme.palette.success.main,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Task List */}
      <Box
        sx={{
          flex: 1,
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
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.palette.grey[400],
          },
        }}
      >
        <List sx={{ padding: 0 }}>
          {tasks.map((task, index) => (
            <ListItem
              key={task.id}
              sx={{
                padding: "16px 20px",
                borderBottom: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  backgroundColor: theme.palette.background.default,
                },
                backgroundColor:
                  task.status === "in_progress"
                    ? theme.palette.action.hover
                    : "transparent",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: "fit-content",
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    #{task.id}
                  </Typography>
                  {getStatusIcon(task.status)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: getStatusColor(task.status),
                      fontSize: "13px",
                      lineHeight: 1.4,
                      fontWeight: task.status === "in_progress" ? 600 : 400,
                    }}
                  >
                    {task.title}
                  </Typography>

                  {/* Task details */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      marginTop: 1,
                    }}
                  >
                    <Chip
                      label={task.status.replace("_", " ").toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(task.status),
                        color: "white",
                        fontSize: "9px",
                        height: "18px",
                        fontWeight: 500,
                      }}
                    />
                    {task.status === "in_progress" && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.info.main,
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%": { opacity: 1 },
                              "50%": { opacity: 0.5 },
                              "100%": { opacity: 1 },
                            },
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "10px",
                            color: theme.palette.info.main,
                            fontWeight: 500,
                          }}
                        >
                          Processing...
                        </Typography>
                      </Box>
                    )}
                    {task.status === "completed" && (
                      <Typography
                        sx={{
                          fontSize: "10px",
                          color: theme.palette.success.main,
                          fontWeight: 500,
                        }}
                      >
                        ✓ Completed
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          padding: "16px 20px",
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "12px",
            textAlign: "right",
          }}
        >
          {completedTasks} done {inProgressTasks} active {pendingTasks} pending
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "12px",
            textAlign: "right",
          }}
        >
          {Math.round(progressPercentage)}% complete
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskListPanel;
