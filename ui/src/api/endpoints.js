export const API_PREFIX = "/api";

export const endpoints = {
  tenders: `${API_PREFIX}/tenders`,
  tenderInput: (tenderId) => `${API_PREFIX}/tenders/${tenderId}/input`,
  tenderCriteria: (tenderId) => `${API_PREFIX}/tenders/${tenderId}/criteria`,
  jobsStatus: (jobId) => `${API_PREFIX}/jobs/${jobId}/status`,
  jobsLogs: (jobId) => `${API_PREFIX}/jobs/${jobId}/logs`,
  jobsComputerStatus: (jobId) => `${API_PREFIX}/jobs/${jobId}/computer-status`,
  jobsLivePreview: (jobId) => `${API_PREFIX}/jobs/${jobId}/live-preview`,
  tenderOcr: (tenderId) => `${API_PREFIX}/tenders/${tenderId}/ocr`,
};
