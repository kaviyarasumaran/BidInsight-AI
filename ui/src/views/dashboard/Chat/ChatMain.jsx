import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  useTheme,
  Fade,
  Slide,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ChatPanelHeader from "../../../components/internal/Chat/ChatPanelHeader";
import TaskPanelHeader from "../../../components/internal/Chat/TaskPanelHeader";
import ChatPanel from "../../../components/internal/Chat/ChatPanel";
import TaskListPanel from "../../../components/internal/Chat/TaskListPanel";
import DocumentsPanel from "../../../components/internal/Chat/DocumentsPanel";
import JobLogsPanel from "../../../components/internal/Chat/JobLogsPanel";
import ComputerStatusPanel from "../../../components/internal/Chat/ComputerStatusPanel";
import LivePreviewPanel from "../../../components/internal/Chat/LivePreviewPanel";
import FinalSummaryPanel from "../../../components/internal/Chat/FinalSummaryPanel";
import ChatInput from "../../../components/internal/Chat/ChatInput";
import InitialChatView from "../../../components/internal/Chat/InitialChatView";
import { createTender, uploadTenderInput, regenerateTender } from "../../../api/tenders";
import { getJobStatus } from "../../../api/jobs";
import { agentChat, getAgentContext } from "../../../api/agent";
import { getRecentChats, saveChatSession } from "../../../api/chats";

const RECENT_CHATS_KEY = "bidinsight.recentChats.v1";
const SESSION_TENDER_KEY = "bidinsight.session.tenderId";
const SESSION_JOB_KEY = "bidinsight.session.jobId";
const SESSION_MESSAGES_KEY = "bidinsight.session.messages";

const ChatMain = () => {
  const theme = useTheme();
  
  const [tenderId, setTenderId] = useState(() => localStorage.getItem(SESSION_TENDER_KEY) || "");
  const [jobId, setJobId] = useState(() => localStorage.getItem(SESSION_JOB_KEY) || "");
  const [chatId, setChatId] = useState(() => localStorage.getItem("bidinsight.session.chatId") || "");
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_MESSAGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isChatStarted, setIsChatStarted] = useState(() => Boolean(localStorage.getItem(SESSION_JOB_KEY)));
  const [initialMessage, setInitialMessage] = useState("");
  const [taskPanelWidth, setTaskPanelWidth] = useState(0); // Will be calculated as 50% of screen width
  const [isResizing, setIsResizing] = useState(false);
  const [isTaskPanelMinimized, setIsTaskPanelMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Summary, 1: Computer, 2: Preview, 3: Documents, 4: Logs
  const [taskData, setTaskData] = useState(null);
  const [auditReportData, setAuditReportData] = useState(null);
  const containerRef = useRef(null);
  const [lastJobStatus, setLastJobStatus] = useState(null);

  // Persistence Effects
  React.useEffect(() => {
    localStorage.setItem(SESSION_TENDER_KEY, tenderId);
  }, [tenderId]);

  React.useEffect(() => {
    localStorage.setItem(SESSION_JOB_KEY, jobId);
  }, [jobId]);

  React.useEffect(() => {
    localStorage.setItem(SESSION_MESSAGES_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);
  const [recentChats, setRecentChats] = useState(() => {
    try {
      const raw = localStorage.getItem(RECENT_CHATS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const addRecentChat = (text, tId, jId, msgs) => {
    const cleaned = (text || "").trim();
    if (!cleaned) return;
    setRecentChats((prev) => {
      const newItem = { text: cleaned, tenderId: tId, jobId: jId, messages: msgs, timestamp: new Date().toISOString() };
      const next = [newItem, ...prev.filter((x) => x.text !== cleaned)].slice(0, 15);
      try {
        localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleStartChat = (input) => {
    // If input is a history object
    if (input && typeof input === "object" && input.tenderId) {
      setTenderId(input.tenderId);
      setJobId(input.jobId || "");
      setChatMessages(input.messages || []);
      setIsChatStarted(true);
      return;
    }

    const text = typeof input === "string" ? input : input?.text || "";
    const files = typeof input === "string" ? [] : input?.files || [];

    setInitialMessage(text || "New chat");
    setIsChatStarted(true);
    if (text?.trim() || files.length) {
      setChatMessages([{ type: "user", message: text?.trim() ? text : "(files uploaded)" }]);
      uploadMutation.mutate({ text, files });
    }
  };


  const handleTaskUpdate = (newTaskData) => {
    setTaskData(newTaskData);
  };

  const handleAuditComplete = (reportData) => {
    setAuditReportData(reportData);
    // Automatically switch to Documents tab to show audit reports
    setActiveTab(2);
  };

  const createTenderMutation = useMutation({
    mutationFn: createTender,
    onSuccess: (data) => setTenderId(data.tender_id),
    onError: (err) => {
      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", message: `Failed to create tender: ${err?.message || err}` },
      ]);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ text, files }) => {
      let id = tenderId;
      if (!id) {
        setChatMessages((prev) => [...prev, { type: "assistant", message: "Creating tender…" }]);
        const created = await createTender({
          tender_title: "Tender from UI chat",
          department: "Department",
          description: "",
          created_by: "ui",
        });
        id = created.tender_id;
        setTenderId(id);
      }
      setChatMessages((prev) => [...prev, { type: "assistant", message: "Uploading input and starting processing…" }]);
      return uploadTenderInput(id, { rawText: text, files });
    },
    onSuccess: (data) => {
      setJobId(data.processing_job_id);
      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", message: `Started job: ${data.processing_job_id}` },
      ]);
    },
    onError: (err) => {
      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", message: `Request failed: ${err?.message || err}` },
      ]);
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

  React.useEffect(() => {
    if (!jobStatusQuery.data) return;
    const s = jobStatusQuery.data;
    setLastJobStatus(s);
    setChatMessages((prev) => {
      const next = prev.filter((m) => m._kind !== "job_status");
      
      const progress = parseInt(s.progress) || 0;
      const steps = [
        { label: "Input Received", status: "completed" },
        { label: "OCR Processing", status: progress > 15 ? "completed" : (progress > 5 ? "processing" : "pending") },
        { label: "Document Parsing", status: progress > 40 ? "completed" : (progress > 15 ? "processing" : "pending") },
        { label: "Criteria Extraction", status: progress > 70 ? "completed" : (progress > 40 ? "processing" : "pending") },
        { label: "Finalizing", status: progress === 100 ? "completed" : (progress > 70 ? "processing" : "pending") },
      ];

      next.push({
        _kind: "job_status",
        type: "assistant",
        job_id: s.job_id,
        status: s.status,
        progress: s.progress,
        current_step: s.current_step,
        message: `Processing Tender: ${s.status} (${s.progress}%)`,
        steps: steps
      });
      return next;
    });

    if (s.status === "completed" && (s.progress === 100 || s.progress === "100")) {
      setChatMessages((prev) => {
        const already = prev.some((m) => m._kind === "agent_ready" && m.job_id === s.job_id);
        if (already) return prev;
        return [
          ...prev,
          {
            _kind: "agent_ready",
            job_id: s.job_id,
            type: "assistant",
            message:
              "Extraction completed. Ask questions in the chat (agent mode). Tip: send `/context` to see extracted KB counts.",
          },
        ];
      });
    }
  }, [jobStatusQuery.data]);

  const recentChatsQuery = useQuery({
    queryKey: ["recentChats"],
    queryFn: getRecentChats,
    initialData: recentChats, // Use local as fallback
  });

  const saveChatMutation = useMutation({
    mutationFn: saveChatSession,
    onSuccess: (data) => {
      if (data.chat_id) {
        setChatId(data.chat_id);
        localStorage.setItem("bidinsight.session.chatId", data.chat_id);
      }
      recentChatsQuery.refetch();
    }
  });

  // Sync to history list (Local + DB)
  React.useEffect(() => {
    if (isChatStarted && chatMessages.length > 0 && tenderId) {
      const firstUserMsg = chatMessages.find(m => m.type === "user")?.message || "Evaluation Session";
      
      // Update DB
      saveChatMutation.mutate({
        chat_id: chatId,
        tender_id: tenderId,
        job_id: jobId,
        text: firstUserMsg,
        messages: chatMessages
      });

      // Also keep local as secondary cache
      addRecentChat(firstUserMsg, tenderId, jobId, chatMessages);
    }
  }, [chatMessages, tenderId, jobId, isChatStarted]);

  const agentMutation = useMutation({
    mutationFn: ({ message }) => agentChat({ job_id: jobId, message }),
    onSuccess: (data) => {
      setChatMessages((prev) => [...prev, { type: "assistant", message: data?.answer || "OK" }]);
    },
    onError: (err) => {
      setChatMessages((prev) => [...prev, { type: "assistant", message: `Agent error: ${err?.message || err}` }]);
    },
  });

  const agentContextMutation = useMutation({
    mutationFn: () => getAgentContext(jobId),
    onSuccess: (data) => {
      const criteriaCount = data?.tender_criteria?.criteria?.length ?? 0;
      const evidenceCount = data?.vendor_evidence?.evidence?.length ?? 0;
      setChatMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          message: `Agent context loaded. criteria=${criteriaCount} evidence=${evidenceCount} job_status=${data?.status?.status || "-"}`,
        },
      ]);
    },
    onError: (err) => {
      setChatMessages((prev) => [...prev, { type: "assistant", message: `Context error: ${err?.message || err}` }]);
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (tid) => regenerateTender(tid),
    onSuccess: (data) => {
      setJobId(data.processing_job_id);
      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", message: "Regeneration started. Monitoring new job..." },
      ]);
    },
    onError: (err) => {
      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", message: `Regeneration failed: ${err?.message || err}` },
      ]);
    },
  });

  const handleRegenerate = () => {
    if (!tenderId) return;
    regenerateMutation.mutate(tenderId);
  };

  const handleSendMessage = ({ text, files }) => {
    const hasText = Boolean(text?.trim());
    const hasFiles = Boolean(files && files.length);
    if (!hasText && !hasFiles) return;

    if (hasText) addRecentChat(text);
    setChatMessages((prev) => [...prev, { type: "user", message: hasText ? text : "(files uploaded)" }]);

    // If a processing job exists, treat messages as agent questions (clean chat).
    // File uploads still start/continue processing.
    if (jobId && hasText && !hasFiles) {
      const msg = text.trim();
      if (msg === "/context") {
        agentContextMutation.mutate();
        return;
      }
      agentMutation.mutate({ message: msg });
      return;
    }

    // Start/continue processing flow (text+files ingestion).
    setChatMessages((prev) => [
      ...prev,
      {
        _kind: "job_status",
        type: "assistant",
        status: "processing",
        message: "Input Received",
        steps: [
          { label: "Input Received", status: "completed" },
          { label: "Initializing Job", status: "processing" },
          { label: "Document Extraction", status: "pending" },
          { label: "Criteria Parsing", status: "pending" },
        ]
      }
    ]);
    uploadMutation.mutate({ text, files });
  };

  // Set initial width to 50% of screen when chat starts
  React.useEffect(() => {
    if (isChatStarted && containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setTaskPanelWidth(containerWidth / 2);
    }
  }, [isChatStarted]);

  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.width - e.clientX + containerRect.left;
      const minWidth = 300;
      const maxWidth = containerRect.width - 300;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setTaskPanelWidth(newWidth);
      }
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const toggleTaskPanel = () => {
    setIsTaskPanelMinimized(!isTaskPanelMinimized);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Ensure panel is expanded for main diagnostic tabs
    if ([0, 1, 2, 3].includes(newValue)) {
      setIsTaskPanelMinimized(false);
    }
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Initial Welcome Screen */}
      <Fade in={!isChatStarted} timeout={300}>
        <Box
          sx={{
            position: isChatStarted ? "absolute" : "relative",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: isChatStarted ? 0 : 1,
          }}
        >
          {!isChatStarted && (
            <InitialChatView
              onStartChat={handleStartChat}
              recentChats={recentChatsQuery.data || recentChats}
            />
          )}
        </Box>
      </Fade>

      {/* Full Chat Interface */}
      <Fade in={isChatStarted} timeout={500}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            opacity: isChatStarted ? 1 : 0,
            transform: isChatStarted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-in-out",
          }}
        >
          {/* Unified Header */}
          <Slide direction="down" in={isChatStarted} timeout={600}>
            <Box
              sx={{
                display: "flex",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* Chat Panel Header */}
              <Box
                sx={{
                  width: isTaskPanelMinimized
                    ? "100%"
                    : taskPanelWidth > 0
                    ? `calc(100% - ${taskPanelWidth}px)`
                    : "50%",
                }}
              >
                <ChatPanelHeader />
              </Box>

              {/* Task Panel Header */}
              {!isTaskPanelMinimized && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: taskPanelWidth > 0 ? `${taskPanelWidth}px` : "50%",
                  }}
                >
                  {/* Tab Bar with Actions */}
                  <Box
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 16px 0 16px",
                    }}
                  >
                    {/* Tabs */}
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
                      <Tab
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            Summary
                            <Icon icon="mdi:file-chart" width={14} />
                          </Box>
                        }
                      />
                      <Tab label="Computer" />
                      <Tab
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            Live Preview
                            <Icon icon="mdi:fullscreen" width={14} />
                          </Box>
                        }
                      />
                      <Tab
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            Documents
                            <Icon
                              icon="mdi:file-document-multiple"
                              width={14}
                            />
                          </Box>
                        }
                      />
                      <Tab
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            Logs
                            <Icon icon="mdi:format-list-bulleted" width={14} />
                          </Box>
                        }
                      />
                    </Tabs>

                  {/* Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "center",
                      height: "100%",
                      marginTop: "-12px",
                    }}
                  >
                    <IconButton
                      sx={{
                        color: theme.palette.text.secondary,
                        padding: 0.5,
                      }}
                      >
                        <Icon icon="mdi:content-copy" width={16} />
                      </IconButton>
                      <IconButton
                        onClick={toggleTaskPanel}
                        sx={{
                          color: theme.palette.text.secondary,
                          padding: 0.5,
                        }}
                      >
                        <Icon icon="mdi:chevron-right" width={16} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Slide>

          {/* Main Content Area */}
          <Slide direction="up" in={isChatStarted} timeout={700}>
            <Box
              ref={containerRef}
              sx={{
                display: "flex",
                flex: 1,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Left Panel - Chat */}
              <Slide direction="right" in={isChatStarted} timeout={800}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    height: "100%",
                    overflow: "hidden",
                    width: isTaskPanelMinimized
                      ? "100%"
                      : taskPanelWidth > 0
                      ? `calc(100% - ${taskPanelWidth}px)`
                      : "50%",
                  }}
                >
                  <ChatPanel
                    initialMessage={initialMessage}
                    onTaskUpdate={handleTaskUpdate}
                    onAuditComplete={handleAuditComplete}
                    onSwitchToDocuments={() => setActiveTab(2)}
                    messages={chatMessages}
                    errorMessage={uploadMutation.error?.message || createTenderMutation.error?.message || null}
                  />
                  <ChatInput onSend={handleSendMessage} isBusy={uploadMutation.isPending || createTenderMutation.isPending} />
                </Box>
              </Slide>

              {/* Resize Handle - Only show when task panel is not minimized */}
              {!isTaskPanelMinimized && (
                <Box
                  onMouseDown={handleMouseDown}
                  sx={{
                    width: "8px",
                    backgroundColor: isResizing
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                    cursor: "col-resize",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                    transition: "background-color 0.2s ease",
                    position: "relative",
                    minHeight: "100%",
                  }}
                >
                  {/* Vertical Drag Indicator */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      opacity: isResizing ? 1 : 0.4,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.text.secondary,
                      }}
                    />
                    <Box
                      sx={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.text.secondary,
                      }}
                    />
                    <Box
                      sx={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.text.secondary,
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Right Panel - Content based on active tab */}
              {!isTaskPanelMinimized && (
                <Slide direction="left" in={isChatStarted} timeout={900}>
                  <Box
                    sx={{
                      width: taskPanelWidth > 0 ? `${taskPanelWidth}px` : "50%",
                      minWidth: "300px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ flex: 1, overflow: "auto" }}>
                      {activeTab === 0 ? (
                        <FinalSummaryPanel 
                          tenderId={tenderId} 
                          jobId={jobId} 
                          jobStatus={lastJobStatus?.status} 
                          onRegenerate={handleRegenerate}
                        />
                      ) : activeTab === 1 ? (
                        <ComputerStatusPanel jobId={jobId} />
                      ) : activeTab === 2 ? (
                        <LivePreviewPanel jobId={jobId} />
                      ) : activeTab === 3 ? (
                        <DocumentsPanel tenderId={tenderId} jobId={jobId} jobStatus={lastJobStatus?.status} />
                      ) : (
                        <JobLogsPanel jobId={jobId} />
                      )}
                    </Box>
                  </Box>
                </Slide>
              )}

              {/* Minimize/Maximize Button - Only show when task panel is minimized */}
              {isTaskPanelMinimized && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <Box
                    onClick={toggleTaskPanel}
                    sx={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.background.default,
                        borderColor: theme.palette.primary.main,
                      },
                      transition: "all 0.2s ease",
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <Icon
                      icon="mdi:chevron-left"
                      width={16}
                      color={theme.palette.text.primary}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Box>
  );
};

export default ChatMain;
