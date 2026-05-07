import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import { Icon } from "@iconify/react";

const TaskPanelHeader = ({ onMinimize }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(1); // 0 for Computer, 1 for Live Preview

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      {/* Tab Bar */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: "40px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTab-root": {
              minHeight: "40px",
              padding: "8px 16px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "8px 8px 0 0",
              marginRight: "4px",
              backgroundColor: "transparent",
              color: theme.palette.text.secondary,
              border: "1px solid transparent",
              "&.Mui-selected": {
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.primary.main}`,
                borderBottom: "none",
              },
            },
          }}
        >
          <Tab label="Computer" />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Live Preview
                <Icon icon="mdi:fullscreen" width={14} />
               
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Task List Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: "48px",
        }}
      >
        {/* Left side - Task List Title with Progress */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            4/9
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
            Task execution tracking
          </Typography>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
          >
            <Icon icon="mdi:content-copy" width={16} />
          </IconButton>
          <IconButton
            onClick={onMinimize}
            sx={{ color: theme.palette.text.secondary, padding: 0.5 }}
          >
            <Icon icon="mdi:chevron-right" width={16} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskPanelHeader;
