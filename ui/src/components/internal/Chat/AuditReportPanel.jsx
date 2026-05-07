import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Paper,
  Chip,
  LinearProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";

const AuditReportPanel = ({ reportData }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  if (!reportData) {
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
          icon="mdi:file-document-outline"
          width={64}
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
          No Report Available
        </Typography>
        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "14px",
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          Complete the audit to view the report
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "md":
        return "mdi:file-document";
      case "json":
        return "mdi:code-json";
      case "csv":
        return "mdi:file-delimited";
      default:
        return "mdi:file";
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "md":
        return "#1976d2";
      case "json":
        return "#ff9800";
      case "csv":
        return "#4caf50";
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Report Header */}
      <Box
        sx={{
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 2,
          }}
        >
          <Icon
            icon="mdi:file-document-check"
            width={24}
            color={theme.palette.primary.main}
          />
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Audit Report
          </Typography>
          <Chip
            label="Complete"
            size="small"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "10px",
            }}
          />
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            marginBottom: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {reportData.totalClaims}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
              }}
            >
              Total Claims
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#4CAF50",
              }}
            >
              {reportData.compliantClaims}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
              }}
            >
              Compliant
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#F44336",
              }}
            >
              {reportData.nonCompliantClaims}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: theme.palette.text.secondary,
              }}
            >
              Non-Compliant
            </Typography>
          </Box>
        </Box>

        {/* Compliance Rate */}
        <Box sx={{ marginBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Compliance Rate
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              {reportData.complianceRate}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={reportData.complianceRate}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  reportData.complianceRate >= 80 ? "#4CAF50" : "#FF9800",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Box>

      {/* Document Tabs */}
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "40px",
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
            },
            "& .MuiTab-root": {
              minHeight: "40px",
              padding: "8px 16px",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
          }}
        >
          {reportData.reports.map((report, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Icon
                    icon={getFileIcon(report.type)}
                    width={16}
                    color={getFileColor(report.type)}
                  />
                  {report.name}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Document Content */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {reportData.reports[activeTab] && (
          <Paper
            sx={{
              padding: "16px",
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginBottom: 2,
              }}
            >
              <Icon
                icon={getFileIcon(reportData.reports[activeTab].type)}
                width={20}
                color={getFileColor(reportData.reports[activeTab].type)}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {reportData.reports[activeTab].name}
              </Typography>
              <Chip
                label={reportData.reports[activeTab].type.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getFileColor(
                    reportData.reports[activeTab].type
                  ),
                  color: "white",
                  fontSize: "10px",
                }}
              />
            </Box>

            <Box
              sx={{
                fontFamily:
                  reportData.reports[activeTab].type === "json"
                    ? "monospace"
                    : "inherit",
                fontSize: "12px",
                lineHeight: 1.6,
                whiteSpace:
                  reportData.reports[activeTab].type === "json"
                    ? "pre"
                    : "pre-wrap",
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                padding: "12px",
                borderRadius: "4px",
                border: `1px solid ${theme.palette.divider}`,
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {reportData.reports[activeTab].content}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AuditReportPanel;
