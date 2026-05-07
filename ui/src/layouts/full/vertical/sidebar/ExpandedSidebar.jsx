import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  styled,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "16px",
  width: "calc(100% - 32px)",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SectionContent = styled(Box)(({ theme }) => ({
  padding: "0 16px 16px 16px",
}));

const TaskItem = styled(Paper)(({ theme }) => ({
  padding: "12px",
  marginBottom: "8px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
}));

const FileUploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center",
  marginBottom: "16px",
  backgroundColor: theme.palette.background.default,
}));

const ExpandedSidebar = () => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    tasksHistory: true,
    files: false,
    plans: false,
    integrations: false,
    uploadedFiles: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "background.default",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "divider",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "text.secondary",
        },
      }}
    >
      {/* New Chat Button */}
      <StyledButton
        onClick={() => {
          localStorage.removeItem("bidinsight.session.tenderId");
          localStorage.removeItem("bidinsight.session.jobId");
          localStorage.removeItem("bidinsight.session.messages");
          window.location.reload();
        }}
        startIcon={
          <Icon
            icon="mdi:plus"
            width={20}
            color={theme.palette.primary.contrastText}
          />
        }
      >
        New Chat
      </StyledButton>

      {/* Tasks History Section */}
      <Box>
        <SectionHeader onClick={() => toggleSection("tasksHistory")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:clock-outline"
              width={20}
              color={theme.palette.text.primary}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              Tasks History
            </Typography>
          </Box>
          {expandedSections.tasksHistory ? (
            <Icon
              icon="mdi:chevron-up"
              width={16}
              color={theme.palette.text.primary}
            />
          ) : (
            <Icon
              icon="mdi:chevron-down"
              width={16}
              color={theme.palette.text.primary}
            />
          )}
        </SectionHeader>
        <Collapse in={expandedSections.tasksHistory}>
          <SectionContent>
            <TaskItem>
              <Icon
                icon="mdi:message-circle-outline"
                width={20}
                color={theme.palette.text.secondary}
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Query: I have uploaded the claims data with adj...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  2025/10/18 12:55
                </Typography>
              </Box>
            </TaskItem>
          </SectionContent>
        </Collapse>
      </Box>

      <Divider />

      {/* Files Section */}
      <Box>
        <SectionHeader onClick={() => toggleSection("files")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:file-multiple-outline"
              width={20}
              color={theme.palette.text.primary}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              Files
            </Typography>
          </Box>
          {expandedSections.files ? (
            <Icon
              icon="mdi:chevron-up"
              width={16}
              color={theme.palette.text.primary}
            />
          ) : (
            <Icon
              icon="mdi:chevron-down"
              width={16}
              color={theme.palette.text.primary}
            />
          )}
        </SectionHeader>
        <Collapse in={expandedSections.files}>
          <SectionContent>
            <FileUploadArea>
              <Icon
                icon="mdi:upload-outline"
                width={48}
                color={theme.palette.text.secondary}
              />
              <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                Drag & drop files here or click to browse
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    <Icon
                      icon="mdi:plus"
                      width={16}
                      color={theme.palette.primary.contrastText}
                    />
                  }
                >
                  Select Files
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <Icon
                      icon="mdi:folder-outline"
                      width={16}
                      color={theme.palette.text.primary}
                    />
                  }
                >
                  Select Folder
                </Button>
              </Box>
            </FileUploadArea>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2" fontWeight={600}>
                Files (3)
              </Typography>
              <IconButton size="small">
                <Icon
                  icon="mdi:refresh"
                  width={16}
                  color={theme.palette.text.secondary}
                />
              </IconButton>
            </Box>

            {/* Uploaded Files List */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => toggleSection("uploadedFiles")}
              >
                <Icon
                  icon={
                    expandedSections.uploadedFiles
                      ? "mdi:chevron-up"
                      : "mdi:chevron-down"
                  }
                  width={16}
                  color={theme.palette.text.primary}
                />
                <Icon
                  icon="mdi:folder-outline"
                  width={16}
                  color={theme.palette.text.primary}
                />
                <Typography variant="body2">Uploaded Files (3)</Typography>
              </Box>

              <Collapse in={expandedSections.uploadedFiles}>
                <Box sx={{ ml: 3, mt: 1 }}>
                  {/* Sample uploaded files */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      p: 1,
                      backgroundColor: "background.paper",
                      borderRadius: "4px",
                    }}
                  >
                    <Icon
                      icon="mdi:file-pdf-outline"
                      width={16}
                      color="#d32f2f"
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      claims_data.pdf
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton size="small" title="Download">
                        <Icon icon="mdi:download" width={14} />
                      </IconButton>
                      <IconButton size="small" title="Preview">
                        <Icon icon="mdi:eye" width={14} />
                      </IconButton>
                      <IconButton size="small" title="Remove">
                        <Icon icon="mdi:close" width={14} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      p: 1,
                      backgroundColor: "background.paper",
                      borderRadius: "4px",
                    }}
                  >
                    <Icon
                      icon="mdi:file-excel-outline"
                      width={16}
                      color="#2e7d32"
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      medical_records.xlsx
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton size="small" title="Download">
                        <Icon icon="mdi:download" width={14} />
                      </IconButton>
                      <IconButton size="small" title="Preview">
                        <Icon icon="mdi:eye" width={14} />
                      </IconButton>
                      <IconButton size="small" title="Remove">
                        <Icon icon="mdi:close" width={14} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      p: 1,
                      backgroundColor: "background.paper",
                      borderRadius: "4px",
                    }}
                  >
                    <Icon
                      icon="mdi:file-document-outline"
                      width={16}
                      color="#1976d2"
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      discharge_summary.docx
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton size="small" title="Download">
                        <Icon icon="mdi:download" width={14} />
                      </IconButton>
                      <IconButton size="small" title="Preview">
                        <Icon icon="mdi:eye" width={14} />
                      </IconButton>
                      <IconButton size="small" title="Remove">
                        <Icon icon="mdi:close" width={14} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </SectionContent>
        </Collapse>
      </Box>

      <Divider />

      {/* Plans Section */}
      <Box>
        <SectionHeader onClick={() => toggleSection("plans")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:clipboard-list-outline"
              width={20}
              color={theme.palette.text.primary}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              Plans
            </Typography>
          </Box>
          {expandedSections.plans ? (
            <Icon
              icon="mdi:chevron-up"
              width={16}
              color={theme.palette.text.primary}
            />
          ) : (
            <Icon
              icon="mdi:chevron-down"
              width={16}
              color={theme.palette.text.primary}
            />
          )}
        </SectionHeader>
        <Collapse in={expandedSections.plans}>
          <SectionContent>
            <Typography
              variant="body2"
              textAlign="center"
              color="text.secondary"
            >
              No plans available
            </Typography>
          </SectionContent>
        </Collapse>
      </Box>

      <Divider />

      {/* Integrations Section */}
      <Box>
        <SectionHeader onClick={() => toggleSection("integrations")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon
              icon="mdi:power-plug-outline"
              width={20}
              color={theme.palette.text.primary}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              Integrations
            </Typography>
          </Box>
          {expandedSections.integrations ? (
            <Icon
              icon="mdi:chevron-up"
              width={16}
              color={theme.palette.text.primary}
            />
          ) : (
            <Icon
              icon="mdi:chevron-down"
              width={16}
              color={theme.palette.text.primary}
            />
          )}
        </SectionHeader>
        <Collapse in={expandedSections.integrations}>
          <SectionContent>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2">Servers (0)</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small">
                  <Icon
                    icon="mdi:refresh"
                    width={16}
                    color={theme.palette.text.secondary}
                  />
                </IconButton>
                <IconButton size="small">
                  <Icon
                    icon="mdi:plus"
                    width={16}
                    color={theme.palette.text.secondary}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Icon
                icon="mdi:power-plug-outline"
                width={48}
                color={theme.palette.text.secondary}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, mb: 2 }}
              >
                No MCP servers configured
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={
                  <Icon
                    icon="mdi:plus"
                    width={16}
                    color={theme.palette.primary.contrastText}
                  />
                }
              >
                + Add MCP Server
              </Button>
            </Box>
          </SectionContent>
        </Collapse>
      </Box>

      <Divider />

      {/* System Prompt Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            backgroundColor: "background.paper",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <Icon
            icon="mdi:cog-outline"
            width={20}
            color={theme.palette.text.primary}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            System Prompt
          </Typography>
        </Box>
      </Box>

      {/* Bug Report Button */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={
            <Icon
              icon="mdi:bug-outline"
              width={16}
              color={theme.palette.text.primary}
            />
          }
          fullWidth
          sx={{ textTransform: "none" }}
        >
          Bug Report
        </Button>
      </Box>
    </Box>
  );
};

export default ExpandedSidebar;
