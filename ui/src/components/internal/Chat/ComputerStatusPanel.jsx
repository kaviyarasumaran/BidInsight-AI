import React, { useEffect } from "react";
import { Box, Chip, Divider, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "../../../api/httpClient";
import { getJobComputerStatus } from "../../../api/jobs";

function toWsUrl(httpUrl) {
  if (httpUrl.startsWith("https://")) return httpUrl.replace("https://", "wss://");
  if (httpUrl.startsWith("http://")) return httpUrl.replace("http://", "ws://");
  return httpUrl;
}

const statusColor = (status) => {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "info";
    case "failed":
      return "error";
    case "manual_review_required":
      return "warning";
    case "queued":
      return "default";
    default:
      return "default";
  }
};

const ComputerStatusPanel = ({ jobId }) => {
  const theme = useTheme();
  const qc = useQueryClient();

  const computerQuery = useQuery({
    queryKey: ["jobComputerStatus", jobId],
    queryFn: () => getJobComputerStatus(jobId),
    enabled: Boolean(jobId),
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (!jobId) return;
    const ws = new WebSocket(`${toWsUrl(apiBaseUrl)}/api/ws/jobs/${jobId}`);
    ws.onmessage = () => {
      qc.invalidateQueries({ queryKey: ["jobComputerStatus", jobId] });
    };
    ws.onerror = () => {
      // ignore; polling will keep UI updated
    };
    return () => ws.close();
  }, [jobId, qc]);

  if (!jobId) {
    return (
      <Box sx={{ p: 3, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Start a job to see engine status.</Typography>
      </Box>
    );
  }

  const data = computerQuery.data;

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Processing Engine Status</Typography>
        <Typography variant="body2" color="text.secondary">
          Job: {jobId}
        </Typography>

        <Divider />

        {computerQuery.isFetching && !data ? <Typography>Loading…</Typography> : null}
        {computerQuery.error ? <Typography color="error">{computerQuery.error.message}</Typography> : null}

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="body2">Overall Progress</Typography>
            <Typography variant="body2">{data?.overall_progress ?? 0}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={data?.overall_progress ?? 0}
            sx={{ mt: 1, height: 8, borderRadius: 999 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            Current: {data?.current_stage || "-"}
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={1}>
          {(data?.stages || []).map((s) => (
            <Box
              key={s.name}
              sx={{
                p: 1.25,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {s.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {s.duration ? (
                    <Typography variant="caption" color="text.secondary">
                      {s.duration}
                    </Typography>
                  ) : null}
                  <Chip size="small" label={s.status} color={statusColor(s.status)} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ComputerStatusPanel;
