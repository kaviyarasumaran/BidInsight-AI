import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  useTheme,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { Icon } from "@iconify/react";
import MarkdownReader from "./MarkdownReader";

import { useQuery } from "@tanstack/react-query";
import { getTenderOcr } from "../../../api/tenders";

const DocumentsPanel = ({ auditReportData, tenderId, jobId, jobStatus }) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch real OCR data
  const ocrQuery = useQuery({
    queryKey: ["ocr", tenderId],
    queryFn: () => getTenderOcr(tenderId),
    enabled: Boolean(tenderId),
  });

  // Base documents data
  const baseDocuments = [
    {
      id: "ocr-text",
      name: "OCR_Extracted_Text.md",
      type: "md",
      size: ocrQuery.data?.text ? `${Math.round(ocrQuery.data.text.length / 1024)}KB` : "0KB",
      uploadDate: new Date().toISOString().split("T")[0],
      status: ocrQuery.data?.text ? "processed" : "pending",
      path: `tender/${tenderId}/ocr`,
      content: ocrQuery.data?.text || "Processing OCR...",
      isGenerated: true,
    }
  ];

  // Add audit report files if available
  const auditReportFiles =
    auditReportData?.reports?.map((report, index) => ({
      id: 100 + index,
      name: report.name,
      type: report.type,
      size: `${Math.round(report.content.length / 1000)}KB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "generated",
      path: `/home/user/Desktop/data/generated_files/${report.name}`,
      content: report.content,
      isAuditReport: true,
    })) || [];

  const documents = [...baseDocuments, ...auditReportFiles];

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return "mdi:file-pdf";
      case "json":
        return "mdi:code-json";
      case "xlsx":
        return "mdi:file-excel";
      case "md":
        return "mdi:file-document";
      default:
        return "mdi:file";
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "pdf":
        return "#d32f2f";
      case "json":
        return "#ff9800";
      case "xlsx":
        return "#2e7d32";
      case "md":
        return "#1976d2";
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "#4caf50";
      case "generated":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      default:
        return theme.palette.text.secondary;
    }
  };

  // If audit report data is available, show the report preview instead of document list
  if (auditReportData) {
    return (
      <Box
        sx={{
          height: "100%",
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Audit Report Header */}
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
                {auditReportData.totalClaims}
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
                {auditReportData.compliantClaims}
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
                {auditReportData.nonCompliantClaims}
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
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                }}
              >
                {auditReportData.complianceRate}%
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                }}
              >
                Compliance Rate
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Report Content */}
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
          {auditReportData.reports && auditReportData.reports.length > 0 && (
            <Box
              sx={{
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  marginBottom: 2,
                }}
              >
                {auditReportData.reports[0].name}
              </Typography>
              <MarkdownReader
                content={auditReportData.reports[0].content}
                type={auditReportData.reports[0].type}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Documents Header */}
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
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:file-document-multiple"
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
              Documents
            </Typography>
            <Chip
              label={`${documents.length} files`}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                fontSize: "10px",
              }}
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon icon="mdi:upload" width={16} />}
            sx={{
              textTransform: "none",
              fontSize: "12px",
            }}
          >
            Upload
          </Button>
        </Box>

        {/* File Type Filter */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label="All"
            size="small"
            variant="filled"
            sx={{ fontSize: "10px" }}
          />
          <Chip
            label="PDF"
            size="small"
            variant="outlined"
            sx={{ fontSize: "10px" }}
          />
          <Chip
            label="JSON"
            size="small"
            variant="outlined"
            sx={{ fontSize: "10px" }}
          />
          <Chip
            label="Excel"
            size="small"
            variant="outlined"
            sx={{ fontSize: "10px" }}
          />
        </Box>
      </Box>

      {/* Documents List */}
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
        }}
      >
        <List sx={{ padding: 0 }}>
          {documents.map((doc, index) => (
            <React.Fragment key={doc.id}>
              <ListItem
                sx={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedFile?.id === doc.id
                      ? theme.palette.action.hover
                      : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => setSelectedFile(doc)}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <Icon
                    icon={getFileIcon(doc.type)}
                    width={24}
                    color={getFileColor(doc.type)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {doc.name}
                      </Typography>
                      <Chip
                        label={doc.type.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getFileColor(doc.type),
                          color: "white",
                          fontSize: "8px",
                          height: "16px",
                        }}
                      />
                      <Chip
                        label={doc.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(doc.status),
                          color: "white",
                          fontSize: "8px",
                          height: "16px",
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        fontSize: "12px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      <Typography variant="caption">{doc.size}</Typography>
                      <Typography variant="caption">•</Typography>
                      <Typography variant="caption">
                        {doc.uploadDate}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton size="small" title="Download">
                    <Icon icon="mdi:download" width={16} />
                  </IconButton>
                  <IconButton size="small" title="Preview">
                    <Icon icon="mdi:eye" width={16} />
                  </IconButton>
                  <IconButton size="small" title="Delete">
                    <Icon icon="mdi:delete" width={16} />
                  </IconButton>
                </Box>
              </ListItem>
              {index < documents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Selected File Details */}
      {selectedFile && (
        <Box
          sx={{
            padding: "16px 20px",
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: 1,
            }}
          >
            Selected: {selectedFile.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: theme.palette.text.secondary,
              fontFamily: "monospace",
              wordBreak: "break-all",
              marginBottom: 2,
            }}
          >
            {selectedFile.path}
          </Typography>

          {/* File Content Preview */}
          {selectedFile.content && (
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
                padding: "12px",
                marginTop: 2,
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
              <MarkdownReader
                content={selectedFile.content}
                type={selectedFile.type}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DocumentsPanel;
