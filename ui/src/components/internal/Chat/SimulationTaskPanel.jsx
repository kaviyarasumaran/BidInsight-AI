import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Chip, LinearProgress } from "@mui/material";
import { Icon } from "@iconify/react";

const SimulationTaskPanel = ({ taskData, isSimulationMode = false }) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    if (taskData) {
      setTasks(taskData.tasks || []);
      setStats({
        total: taskData.total || 0,
        pending: taskData.pending || 0,
        inProgress: taskData.inProgress || 0,
        completed: taskData.completed || 0,
      });
    }
  }, [taskData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "mdi:circle-outline";
      case "in_progress":
        return "mdi:lightning-bolt";
      case "completed":
        return "mdi:check-circle";
      default:
        return "mdi:circle-outline";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return theme.palette.text.secondary;
      case "in_progress":
        return "#FF9800";
      case "completed":
        return "#4CAF50";
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "[ ]";
      case "in_progress":
        return "[⚡]";
      case "completed":
        return "[✓]";
      default:
        return "[ ]";
    }
  };

  const extractStatusFromTask = (taskText) => {
    if (taskText.includes("[pending]")) return "pending";
    if (taskText.includes("[in_progress]")) return "in_progress";
    if (taskText.includes("[completed]")) return "completed";
    return "pending";
  };

  const cleanTaskText = (taskText) => {
    return taskText.replace(/\[(pending|in_progress|completed)\]/g, "").trim();
  };

  const progressPercentage =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Task Panel Header */}
      <Box
        sx={{
          padding: "16px",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          📋 Task Panel
        </Typography>

        {/* Progress Summary */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {stats.completed}/{stats.total} completed
          </Typography>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.grey[200],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progressPercentage)}%
          </Typography>
        </Box>

        {/* Progress Points */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Progress Points:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {Array.from({ length: stats.total }, (_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor:
                    index < stats.completed
                      ? "#4CAF50"
                      : index < stats.completed + stats.inProgress
                      ? "#FF9800"
                      : theme.palette.grey[300],
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            ({stats.completed}✓ {stats.inProgress}⚡ {stats.pending}○)
          </Typography>
        </Box>

        {/* Status Chips */}
        <Box
          sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginBottom: 2 }}
        >
          <Chip
            label={`${stats.pending} Pending`}
            size="small"
            variant="outlined"
            sx={{ color: theme.palette.text.secondary }}
          />
          <Chip
            label={`${stats.inProgress} In Progress`}
            size="small"
            variant="outlined"
            sx={{ color: "#FF9800", borderColor: "#FF9800" }}
          />
          <Chip
            label={`${stats.completed} Completed`}
            size="small"
            variant="outlined"
            sx={{ color: "#4CAF50", borderColor: "#4CAF50" }}
          />
        </Box>

        {/* Advanced Progress Metrics */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
            padding: "8px 12px",
            backgroundColor: theme.palette.grey[50],
            borderRadius: "6px",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:speedometer"
              width={16}
              color={theme.palette.primary.main}
            />
            <Typography variant="caption" color="text.secondary">
              Efficiency:
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:clock-outline"
              width={16}
              color={theme.palette.text.secondary}
            />
            <Typography variant="caption" color="text.secondary">
              Avg Time:
            </Typography>
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {stats.completed > 0 ? Math.round(120 / stats.completed) : 0}s
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="mdi:trending-up" width={16} color="#4CAF50" />
            <Typography variant="caption" color="text.secondary">
              Velocity:
            </Typography>
            <Typography variant="caption" fontWeight={600} color="#4CAF50">
              {stats.completed}/min
            </Typography>
          </Box>
        </Box>

        {/* Task Priority Indicator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 2,
            padding: "6px 12px",
            backgroundColor: stats.pending > 3 ? "#FFF3E0" : "#E8F5E8",
            borderRadius: "6px",
            border: `1px solid ${stats.pending > 3 ? "#FFB74D" : "#4CAF50"}`,
          }}
        >
          <Icon
            icon={stats.pending > 3 ? "mdi:alert-circle" : "mdi:check-circle"}
            width={16}
            color={stats.pending > 3 ? "#FF9800" : "#4CAF50"}
          />
          <Typography
            variant="caption"
            color={stats.pending > 3 ? "#E65100" : "#2E7D32"}
            fontWeight={600}
          >
            {stats.pending > 3 ? "High Priority Tasks Pending" : "On Track"}
          </Typography>
        </Box>

        {/* Progress Timeline */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 2,
            padding: "8px 12px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "6px",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Icon
            icon="mdi:timeline"
            width={16}
            color={theme.palette.primary.main}
          />
          <Typography variant="caption" color="text.secondary">
            Timeline:
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, flex: 1 }}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <Box
                key={index}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor:
                    index < (stats.completed / stats.total) * 10
                      ? "#4CAF50"
                      : index <
                        ((stats.completed + stats.inProgress) / stats.total) *
                          10
                      ? "#FF9800"
                      : theme.palette.grey[300],
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {Math.round((stats.completed / stats.total) * 100)}% done
          </Typography>
        </Box>

        {/* Performance Score */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
            padding: "8px 12px",
            backgroundColor: theme.palette.primary.light,
            borderRadius: "6px",
            border: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          <Icon
            icon="mdi:chart-line"
            width={16}
            color={theme.palette.primary.main}
          />
          <Typography variant="caption" color="text.secondary">
            Performance Score:
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.primary">
            {Math.round((stats.completed / stats.total) * 100)}/100
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 4,
              backgroundColor: theme.palette.grey[300],
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${(stats.completed / stats.total) * 100}%`,
                height: "100%",
                backgroundColor: theme.palette.primary.main,
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Task List */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
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
        {tasks.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              textAlign: "center",
            }}
          >
            <Icon
              icon="mdi:clipboard-list-outline"
              width={48}
              color={theme.palette.text.secondary}
              style={{ marginBottom: "16px" }}
            />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ marginBottom: "8px" }}
            >
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasks will appear here as the simulation progresses
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {tasks.map((task, index) => {
              const status = extractStatusFromTask(task);
              const cleanText = cleanTaskText(task);

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    padding: "12px",
                    backgroundColor: theme.palette.background.default,
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Icon
                    icon={getStatusIcon(status)}
                    width={20}
                    color={getStatusColor(status)}
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        lineHeight: 1.4,
                        fontWeight: status === "completed" ? 500 : 400,
                        textDecoration:
                          status === "completed" ? "line-through" : "none",
                        opacity: status === "completed" ? 0.7 : 1,
                      }}
                    >
                      {cleanText}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginTop: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: getStatusColor(status),
                          fontWeight: 600,
                          fontSize: "10px",
                        }}
                      >
                        {getStatusText(status)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          textTransform: "uppercase",
                          fontSize: "10px",
                        }}
                      >
                        {status.replace("_", " ")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Simulation Status */}
      {isSimulationMode && (
        <Box
          sx={{
            padding: "12px 16px",
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              "@keyframes pulse": {
                "0%": {
                  opacity: 1,
                  transform: "scale(1)",
                },
                "50%": {
                  opacity: 0.5,
                  transform: "scale(1.2)",
                },
                "100%": {
                  opacity: 1,
                  transform: "scale(1)",
                },
              },
              animation: "pulse 2s infinite",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Live simulation running
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SimulationTaskPanel;
