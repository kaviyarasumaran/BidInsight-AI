import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { marked } from "marked";

const MarkdownReader = ({ content, type = "md" }) => {
  const theme = useTheme();

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const renderContent = () => {
    if (type === "md") {
      // Render markdown content
      const htmlContent = marked(content);
      return (
        <Box
          sx={{
            "& h1": {
              fontSize: "24px",
              fontWeight: 700,
              color: theme.palette.text.primary,
              marginBottom: "16px",
              marginTop: "24px",
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              paddingBottom: "8px",
            },
            "& h2": {
              fontSize: "20px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: "12px",
              marginTop: "20px",
            },
            "& h3": {
              fontSize: "18px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: "10px",
              marginTop: "16px",
            },
            "& h4": {
              fontSize: "16px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: "8px",
              marginTop: "12px",
            },
            "& p": {
              fontSize: "14px",
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              marginBottom: "12px",
            },
            "& ul, & ol": {
              marginBottom: "12px",
              paddingLeft: "20px",
            },
            "& li": {
              fontSize: "14px",
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              marginBottom: "4px",
            },
            "& strong": {
              fontWeight: 600,
              color: theme.palette.text.primary,
            },
            "& em": {
              fontStyle: "italic",
              color: theme.palette.text.secondary,
            },
            "& code": {
              backgroundColor: theme.palette.background.default,
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: theme.palette.primary.main,
            },
            "& pre": {
              backgroundColor: theme.palette.background.default,
              padding: "12px",
              borderRadius: "6px",
              overflow: "auto",
              marginBottom: "12px",
              border: `1px solid ${theme.palette.divider}`,
            },
            "& pre code": {
              backgroundColor: "transparent",
              padding: 0,
              fontSize: "12px",
              fontFamily: "monospace",
              color: theme.palette.text.primary,
            },
            "& blockquote": {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              paddingLeft: "16px",
              marginLeft: 0,
              marginBottom: "12px",
              fontStyle: "italic",
              color: theme.palette.text.secondary,
            },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "12px",
            },
            "& th, & td": {
              border: `1px solid ${theme.palette.divider}`,
              padding: "8px 12px",
              textAlign: "left",
            },
            "& th": {
              backgroundColor: theme.palette.background.default,
              fontWeight: 600,
              color: theme.palette.text.primary,
            },
            "& td": {
              color: theme.palette.text.primary,
            },
            "& hr": {
              border: "none",
              borderTop: `1px solid ${theme.palette.divider}`,
              margin: "20px 0",
            },
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } else if (type === "json") {
      // Render JSON with syntax highlighting
      try {
        const parsed = JSON.parse(content);
        return (
          <Box
            sx={{
              fontFamily: "monospace",
              fontSize: "12px",
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.default,
              padding: "12px",
              borderRadius: "4px",
              border: `1px solid ${theme.palette.divider}`,
              overflow: "auto",
            }}
          >
            <pre>{JSON.stringify(parsed, null, 2)}</pre>
          </Box>
        );
      } catch (error) {
        return (
          <Box
            sx={{
              fontFamily: "monospace",
              fontSize: "12px",
              lineHeight: 1.6,
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.default,
              padding: "12px",
              borderRadius: "4px",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <pre>{content}</pre>
          </Box>
        );
      }
    } else if (type === "csv") {
      // Render CSV as table
      const lines = content.split("\n");
      const headers = lines[0]?.split(",") || [];
      const rows = lines.slice(1).filter((line) => line.trim());

      return (
        <Box
          sx={{
            overflow: "auto",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "4px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: theme.palette.background.default }}>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "8px 12px",
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: "12px",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {header.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const cells = row.split(",");
                return (
                  <tr key={rowIndex}>
                    {cells.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          padding: "8px 12px",
                          border: `1px solid ${theme.palette.divider}`,
                          fontSize: "12px",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      );
    } else {
      // Default plain text rendering
      return (
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {content}
        </Typography>
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        "& *": {
          maxWidth: "100%",
        },
      }}
    >
      {renderContent()}
    </Box>
  );
};

export default MarkdownReader;
