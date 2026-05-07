import React, { useEffect } from "react";
import { Alert, Box, Divider, Stack, Typography, useTheme, Chip, IconButton, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "../../../api/httpClient";
import { httpClient } from "../../../api/httpClient";
import { endpoints } from "../../../api/endpoints";

function toWsUrl(httpUrl) {
  if (httpUrl.startsWith("https://")) return httpUrl.replace("https://", "wss://");
  if (httpUrl.startsWith("http://")) return httpUrl.replace("http://", "ws://");
  return httpUrl;
}

async function getDocumentSummary(tenderId) {
  const { data } = await httpClient.get(`${endpoints.tenders}/${tenderId}/document-summary`);
  return data;
}

const FinalSummaryPanel = ({ tenderId, jobId, jobStatus, onRegenerate }) => {
  const theme = useTheme();
  const qc = useQueryClient();

  const enabled = Boolean(tenderId) && Boolean(jobStatus) && ["completed", "manual_review_required", "failed"].includes(jobStatus);

  const summaryQuery = useQuery({
    queryKey: ["tenderDocumentSummary", tenderId],
    queryFn: () => getDocumentSummary(tenderId),
    enabled: Boolean(tenderId),
    refetchInterval: (q) => {
      const data = q?.state?.data;
      return data?.overall_status ? false : 3000;
    },
  });

  useEffect(() => {
    if (!jobId) return;
    const ws = new WebSocket(`${toWsUrl(apiBaseUrl)}/api/ws/jobs/${jobId}`);
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "summary_ready" || msg?.type === "preview") {
          qc.invalidateQueries({ queryKey: ["tenderDocumentSummary", tenderId] });
        }
      } catch {
        // ignore
      }
    };
    return () => ws.close();
  }, [jobId, qc, tenderId]);

  if (!tenderId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No tender data available.</Typography>
      </Box>
    );
  }

  const s = summaryQuery.data;

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Stack spacing={4}>
        {/* Header with Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700}>Evaluation Summary</Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              startIcon={<Icon icon="mdi:file-pdf-box" />} 
              variant="contained" 
              size="small"
              onClick={() => window.open(`${apiBaseUrl}/api/tenders/${tenderId}/report`, "_blank")}
              disabled={!s || !s.overall_status}
            >
              Download PDF
            </Button>
            <Button 
              startIcon={<Icon icon="mdi:refresh" />} 
              variant="outlined" 
              size="small"
              onClick={onRegenerate}
              disabled={jobStatus === "processing"}
            >
              Regenerate
            </Button>
          </Stack>
        </Box>

        {!enabled ? (
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Final Summary will appear here once the processing is complete.
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
              Current status: {jobStatus || "initializing"}
            </Typography>
          </Box>
        ) : (
          <>
            {(() => {
              // If we only have basic summary (fallback)
              if (s && s.summary && !s.overall_status) {
                return (
                  <Box sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography variant="h6">Tender Analysis In Progress</Typography>
                      <Divider />
                      <Typography color="text.secondary">Generating rich evaluation report...</Typography>
                    </Stack>
                  </Box>
                );
              }

              if (!s || !s.overall_status) {
                return (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">Loading rich evaluation summary…</Typography>
                  </Box>
                );
              }
              
              const getStatusColor = (status) => {
                if (status === "Eligible" || status === "Pass") return theme.palette.success.main;
                if (status === "Not Eligible" || status === "Fail") return theme.palette.error.main;
                return theme.palette.warning.main;
              };

              const getStatusIcon = (status) => {
                if (status === "Eligible" || status === "Pass") return "mdi:check-circle";
                if (status === "Not Eligible" || status === "Fail") return "mdi:close-circle";
                return "mdi:alert-circle";
              };

              return (
                <Stack spacing={4}>
                  {/* Vendor Status Card */}
                  <Box sx={{ 
                    backgroundColor: theme.palette.background.paper, 
                    borderRadius: "16px", 
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden"
                  }}>
                    <Box sx={{ p: 3, backgroundColor: theme.palette.primary.main, color: "white" }}>
                      <Typography variant="h5" fontWeight={700}>{s.vendor_name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>Vendor ID: {s.vendor_id}</Typography>
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
                        <Box>
                          <Typography variant="overline" color="text.secondary">Overall Status</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                            <Icon icon={getStatusIcon(s.overall_status)} color={getStatusColor(s.overall_status)} width={24} />
                            <Typography variant="h6" fontWeight={700} color={getStatusColor(s.overall_status)}>
                              {s.overall_status}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="overline" color="text.secondary">Confidence Score</Typography>
                          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 0.5 }}>
                            <Typography variant="h6" fontWeight={700}>{s.overall_confidence_score}%</Typography>
                            <Typography variant="caption" color="text.secondary">AI analysis</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ gridColumn: { sm: "span 2" } }}>
                          <Typography variant="overline" color="text.secondary">Final Recommendation</Typography>
                          <Typography variant="body1" fontWeight={600} color="primary" sx={{ mt: 0.5 }}>
                            {s.final_recommendation}
                          </Typography>
                        </Box>
                      </Box>

                      {s.risk_flags?.length > 0 && (
                        <Box sx={{ mt: 3, p: 2, backgroundColor: "#FFF3CD", borderRadius: "8px", border: "1px solid #FFEAA7" }}>
                          <Typography variant="subtitle2" color="#856404" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Icon icon="mdi:alert" /> Risk Flags
                          </Typography>
                          {s.risk_flags.map((flag, idx) => (
                            <Typography key={idx} variant="body2" color="#856404" sx={{ mt: 0.5 }}>
                              ⚠ {flag}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Criterion Table */}
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Criterion-Level Evaluation</Typography>
                    <Box sx={{ 
                      border: `1px solid ${theme.palette.divider}`, 
                      borderRadius: "12px", 
                      overflow: "hidden" 
                    }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <thead>
                          <tr style={{ backgroundColor: theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <th style={{ padding: "12px", textAlign: "left" }}>Criterion</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Required</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Found</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Confidence</th>
                            <th style={{ padding: "12px", textAlign: "left" }}>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.criteria_evaluation?.map((c, idx) => (
                            <tr key={idx} style={{ borderBottom: idx === s.criteria_evaluation.length - 1 ? "none" : `1px solid ${theme.palette.divider}` }}>
                              <td style={{ padding: "12px", fontWeight: 600 }}>{c.criterion_name}</td>
                              <td style={{ padding: "12px" }}>{c.required_value}</td>
                              <td style={{ padding: "12px" }}>{c.found_value}</td>
                              <td style={{ padding: "12px" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: getStatusColor(c.status) }}>
                                  <Icon icon={getStatusIcon(c.status)} width={16} />
                                  <span style={{ fontWeight: 600 }}>{c.status}</span>
                                </Box>
                              </td>
                              <td style={{ padding: "12px" }}>
                                <Typography variant="body2" fontWeight={600} color={c.confidence_score > 80 ? "success.main" : "warning.main"}>
                                  {c.confidence_score}%
                                </Typography>
                              </td>
                              <td style={{ padding: "12px", color: theme.palette.text.secondary }}>
                                {c.source_document} (p.{c.page_number})
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>

                  {/* Final Procurement Summary */}
                  <Box sx={{ p: 3, backgroundColor: theme.palette.grey[50], borderRadius: "16px", border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Final Procurement Summary</Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      Vendor <strong>{s.vendor_name}</strong> satisfies the mandatory financial and technical eligibility criteria identified during document extraction.
                    </Typography>
                    {s.manual_review_required && (
                      <Typography variant="body1" sx={{ mt: 2, color: theme.palette.warning.dark }}>
                        <strong>Notice:</strong> Certain registration documents require manual officer verification due to low OCR confidence or document ambiguity. Final eligibility status remains pending until officer review.
                      </Typography>
                    )}
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" color="text.disabled">
                        Processed at: {new Date(s.audit_summary?.processed_at).toLocaleString()}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: s.audit_summary?.review_required ? theme.palette.warning.main : theme.palette.success.main }}>
                          Audit Ready
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              );
            })()}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default FinalSummaryPanel;

