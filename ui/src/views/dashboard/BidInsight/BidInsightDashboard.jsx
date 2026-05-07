import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTender, getTenderCriteria, getTenderOcr, uploadTenderInput } from "../../../api/tenders";
import { getJobStatus } from "../../../api/jobs";

const BidInsightDashboard = () => {
  const [tenderId, setTenderId] = useState("");
  const [jobId, setJobId] = useState("");
  const [rawText, setRawText] = useState("");
  const [files, setFiles] = useState([]);

  const createTenderMutation = useMutation({
    mutationFn: createTender,
    onSuccess: (data) => {
      setTenderId(data.tender_id);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!tenderId) throw new Error("Create a tender first");
      return uploadTenderInput(tenderId, { rawText, files });
    },
    onSuccess: (data) => {
      setJobId(data.processing_job_id);
    },
  });

  const jobStatusQuery = useQuery({
    queryKey: ["jobStatus", jobId],
    queryFn: () => getJobStatus(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (q) => {
      const status = q?.state?.data?.status;
      return status && ["completed", "failed", "manual_review_required"].includes(status) ? false : 2000;
    },
  });

  const criteriaQuery = useQuery({
    queryKey: ["criteria", tenderId],
    queryFn: () => getTenderCriteria(tenderId),
    enabled: Boolean(tenderId) && ["completed", "manual_review_required"].includes(jobStatusQuery.data?.status || ""),
  });

  const ocrQuery = useQuery({
    queryKey: ["ocr", tenderId],
    queryFn: () => getTenderOcr(tenderId),
    enabled: Boolean(tenderId) && ["Parser Engine", "LLM extraction", "Context Builder", "completed", "manual_review_required"].includes(jobStatusQuery.data?.current_step || jobStatusQuery.data?.status || ""),
  });

  const isBusy = createTenderMutation.isPending || uploadMutation.isPending;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">BidInsight AI</Typography>
        <Typography variant="body2" color="text.secondary">
          This UI calls the FastAPI backend (no mock/simulation). Create a tender, upload text/files, poll job status, and view extracted criteria.
        </Typography>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">1) Create Tender</Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Tender Title"
                  fullWidth
                  value={createTenderMutation.variables?.tender_title || ""}
                  onChange={(e) =>
                    createTenderMutation.reset() ||
                    createTenderMutation.mutate({
                      tender_title: e.target.value,
                      department: createTenderMutation.variables?.department || "Department",
                      description: createTenderMutation.variables?.description || "",
                      created_by: createTenderMutation.variables?.created_by || "ui",
                    })
                  }
                  helperText="Edit fields by typing; click Create to submit."
                />
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Department"
                  fullWidth
                  value={createTenderMutation.variables?.department || ""}
                  onChange={(e) =>
                    createTenderMutation.mutate({
                      tender_title: createTenderMutation.variables?.tender_title || "Tender",
                      department: e.target.value,
                      description: createTenderMutation.variables?.description || "",
                      created_by: createTenderMutation.variables?.created_by || "ui",
                    })
                  }
                />
                <TextField
                  label="Created By"
                  fullWidth
                  value={createTenderMutation.variables?.created_by || ""}
                  onChange={(e) =>
                    createTenderMutation.mutate({
                      tender_title: createTenderMutation.variables?.tender_title || "Tender",
                      department: createTenderMutation.variables?.department || "Department",
                      description: createTenderMutation.variables?.description || "",
                      created_by: e.target.value,
                    })
                  }
                />
              </Stack>

              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={2}
                value={createTenderMutation.variables?.description || ""}
                onChange={(e) =>
                  createTenderMutation.mutate({
                    tender_title: createTenderMutation.variables?.tender_title || "Tender",
                    department: createTenderMutation.variables?.department || "Department",
                    description: e.target.value,
                    created_by: createTenderMutation.variables?.created_by || "ui",
                  })
                }
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  disabled={isBusy || !createTenderMutation.variables?.tender_title}
                  onClick={() =>
                    createTenderMutation.mutate({
                      tender_title: createTenderMutation.variables?.tender_title || "Tender",
                      department: createTenderMutation.variables?.department || "Department",
                      description: createTenderMutation.variables?.description || "",
                      created_by: createTenderMutation.variables?.created_by || "ui",
                    })
                  }
                >
                  Create
                </Button>
                <Typography variant="body2">Tender ID: {tenderId || "-"}</Typography>
              </Stack>
              {createTenderMutation.error ? (
                <Typography color="error">{createTenderMutation.error.message}</Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">2) Upload Input</Typography>
              <TextField
                label="Raw Text (optional)"
                fullWidth
                multiline
                minRows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />

              <Button variant="outlined" component="label">
                Select Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
              </Button>
              <Typography variant="body2" color="text.secondary">
                Selected: {files.length ? files.map((f) => f.name).join(", ") : "none"}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" disabled={isBusy || !tenderId} onClick={() => uploadMutation.mutate()}>
                  Upload & Start Job
                </Button>
                <Typography variant="body2">Job ID: {jobId || "-"}</Typography>
              </Stack>
              {uploadMutation.error ? <Typography color="error">{uploadMutation.error.message}</Typography> : null}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">3) Job Status</Typography>
              <Divider />
              <Typography variant="body2">
                Status: {jobStatusQuery.data?.status || "-"} | Progress: {jobStatusQuery.data?.progress ?? "-"}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {jobStatusQuery.data?.current_step || ""}
              </Typography>
              {jobStatusQuery.error ? <Typography color="error">{jobStatusQuery.error.message}</Typography> : null}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">4) OCR Output</Typography>
              <Divider />
              {ocrQuery.isFetching ? <Typography>Loading OCR text…</Typography> : null}
              {ocrQuery.data?.text ? (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "grey.100",
                    maxHeight: 300,
                    overflow: "auto",
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {ocrQuery.data.text}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No OCR text available yet. Run a job first.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">5) Extracted Criteria</Typography>
              <Divider />
              {criteriaQuery.isFetching ? <Typography>Loading…</Typography> : null}
              {criteriaQuery.data?.criteria?.length ? (
                <Stack spacing={1}>
                  {criteriaQuery.data.criteria.map((c) => (
                    <Card key={c.criterion_id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2">{c.category || "general"}</Typography>
                        <Typography>{c.text}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          mandatory={String(c.mandatory ?? true)} confidence={c.confidence ?? "-"}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No criteria yet.
                </Typography>
              )}
              {criteriaQuery.error ? <Typography color="error">{criteriaQuery.error.message}</Typography> : null}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default BidInsightDashboard;
