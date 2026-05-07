import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import SidebarConfig from "../../../../configs/SidebarConfig";

const StyledList = styled(List)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})(({ theme, active }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: active ? "12px" : "8px",
  backgroundColor: active ? theme.palette.background.paper : "transparent",
  color: theme.palette.text.primary,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "80px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    transform: "translateY(-2px)",
  },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})(({ theme, active }) => ({
  minWidth: "auto",
  color: "inherit",
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(1),
}));

const SidebarItems = ({ isCollapsed, onItemClick, activeItem }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isPathActive = (itemPath) => {
    // Handle root path specially
    if (itemPath === "/") {
      return pathname === "/" || pathname === "/dashboards/home";
    }
    // For other paths, check if the current path starts with the item path
    return pathname.startsWith(itemPath);
  };

  const handleClick = (item) => {
    if (item.hasSidePanel) {
      onItemClick(item.id);
    } else {
      onItemClick(null);
    }
  };

  return (
    <StyledList>
      {SidebarConfig.map((item) => {
        const isActive = isPathActive(item.href) || activeItem === item.id;

        const listItem = (
          <StyledListItem
            key={item.id}
            component={Link}
            to={item.href}
            active={isActive ? 1 : 0}
            onClick={() => handleClick(item)}
          >
            <StyledListItemIcon active={isActive ? 1 : 0}>
              <Icon icon={item.icon} width={24} />
            </StyledListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 500,
                margin: 0,
                "& .MuiListItemText-primary": {
                  fontSize: "12px",
                  fontWeight: 500,
                },
              }}
            />
          </StyledListItem>
        );

        return isCollapsed ? (
          <Tooltip key={item.id} title={item.title} placement="right">
            {listItem}
          </Tooltip>
        ) : (
          listItem
        );
      })}
    </StyledList>
  );
};

export default SidebarItems;
