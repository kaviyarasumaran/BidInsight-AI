import React, { useEffect } from "react";
import { Alert, Box, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "../../../api/httpClient";
import { getJobLivePreview } from "../../../api/jobs";

function toWsUrl(httpUrl) {
  if (httpUrl.startsWith("https://")) return httpUrl.replace("https://", "wss://");
  if (httpUrl.startsWith("http://")) return httpUrl.replace("http://", "ws://");
  return httpUrl;
}

const LivePreviewPanel = ({ jobId }) => {
  const theme = useTheme();
  const qc = useQueryClient();

  const previewQuery = useQuery({
    queryKey: ["jobLivePreview", jobId],
    queryFn: () => getJobLivePreview(jobId),
    enabled: Boolean(jobId),
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (!jobId) return;
    const ws = new WebSocket(`${toWsUrl(apiBaseUrl)}/api/ws/jobs/${jobId}`);
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "preview") {
          qc.invalidateQueries({ queryKey: ["jobLivePreview", jobId] });
        }
      } catch {
        // ignore
      }
    };
    return () => ws.close();
  }, [jobId, qc]);

  if (!jobId) {
    return (
      <Box sx={{ p: 3, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Start a job to see live extraction preview.</Typography>
      </Box>
    );
  }

  const detected = previewQuery.data?.detected_criteria || [];
  const warnings = previewQuery.data?.warnings || [];

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Live Extraction Preview</Typography>
        <Typography variant="body2" color="text.secondary">
          Job: {jobId}
        </Typography>

        <Divider />

        {previewQuery.isFetching && !previewQuery.data ? <Typography>Loading…</Typography> : null}
        {previewQuery.error ? <Typography color="error">{previewQuery.error.message}</Typography> : null}

        {warnings.length ? (
          <Stack spacing={1}>
            {warnings.map((w, idx) => (
              <Alert key={idx} severity="warning">
                {w}
              </Alert>
            ))}
          </Stack>
        ) : null}

        <Stack spacing={1}>
          {detected.length ? (
            detected.map((c, idx) => (
              <Box
                key={`${c.criterion}-${idx}`}
                sx={{
                  p: 1.25,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontWeight: 600, pr: 1 }}>
                    {c.criterion}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {c.source ? (
                      <Typography variant="caption" color="text.secondary">
                        {c.source}
                      </Typography>
                    ) : null}
                    {c.status ? <Chip size="small" label={c.status} /> : null}
                  </Stack>
                </Stack>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No preview yet.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LivePreviewPanel;

