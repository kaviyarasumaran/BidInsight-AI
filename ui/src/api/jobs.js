import { endpoints } from "./endpoints";
import { httpClient } from "./httpClient";

/**
 * @param {string} jobId
 * @returns {Promise<import("./types").JobStatusResponse>}
 */
export async function getJobStatus(jobId) {
  const { data } = await httpClient.get(endpoints.jobsStatus(jobId));
  return data;
}

/**
 * @param {string} jobId
 * @param {{ offset?: number, limit?: number, order?: "asc"|"desc" }} params
 * @returns {Promise<import("./types").JobLogsResponse>}
 */
export async function getJobLogs(jobId, params = {}) {
  const { offset = 0, limit = 50, order = "desc" } = params;
  const { data } = await httpClient.get(endpoints.jobsLogs(jobId), {
    params: { offset, limit, order },
  });
  return data;
}

/**
 * @param {string} jobId
 * @returns {Promise<import("./types").JobComputerStatusResponse>}
 */
export async function getJobComputerStatus(jobId) {
  const { data } = await httpClient.get(endpoints.jobsComputerStatus(jobId));
  return data;
}

/**
 * @param {string} jobId
 * @returns {Promise<import("./types").JobLivePreviewResponse>}
 */
export async function getJobLivePreview(jobId) {
  const { data } = await httpClient.get(endpoints.jobsLivePreview(jobId));
  return data;
}
