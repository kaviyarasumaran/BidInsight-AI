import React, { useMemo, useState } from "react";
import { Box, Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getJobLogs } from "../../../api/jobs";

const JobLogsPanel = ({ jobId }) => {
  const theme = useTheme();
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const logsQuery = useQuery({
    queryKey: ["jobLogs", jobId, offset, limit],
    queryFn: () => getJobLogs(jobId, { offset, limit, order: "desc" }),
    enabled: Boolean(jobId),
    refetchInterval: (q) => {
      const total = q?.state?.data?.total ?? 0;
      return total === 0 ? 1000 : false;
    },
  });

  const total = logsQuery.data?.total ?? 0;
  const canPrev = offset + limit < total;
  const canNext = offset > 0;

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="h6">Job Logs</Typography>
        <Typography variant="body2" color="text.secondary">
          {jobId ? `Job: ${jobId}` : "No job selected"}
        </Typography>
        <Divider />

        {logsQuery.isFetching && !logsQuery.data ? <Typography>Loading…</Typography> : null}
        {logsQuery.error ? (
          <Typography color="error">{logsQuery.error.message}</Typography>
        ) : null}

        {logsQuery.data?.lines?.length ? (
          <Box
            sx={{
              fontFamily: "monospace",
              fontSize: "12px",
              whiteSpace: "pre-wrap",
              maxHeight: "60vh",
              overflow: "auto",
              p: 1.5,
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
            }}
          >
            {logsQuery.data.lines.map((l, idx) => (
              <div key={idx}>
                {l.ts} [{l.level}] {l.message}
              </div>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No logs yet.
          </Typography>
        )}

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            total={total} offset={offset} limit={limit}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" disabled={!canPrev} onClick={() => setOffset((o) => o + limit)}>
              Older
            </Button>
            <Button size="small" variant="outlined" disabled={!canNext} onClick={() => setOffset((o) => Math.max(0, o - limit))}>
              Newer
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default JobLogsPanel;
