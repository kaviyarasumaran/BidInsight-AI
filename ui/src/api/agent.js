import { httpClient } from "./httpClient";
import { API_PREFIX } from "./endpoints";

export const agentEndpoints = {
  chat: `${API_PREFIX}/agent/chat`,
  context: (jobId) => `${API_PREFIX}/agent/context/${jobId}`,
};

/**
 * @param {{ job_id: string, message: string }} payload
 */
export async function agentChat(payload) {
  const { data } = await httpClient.post(agentEndpoints.chat, payload);
  return data;
}

export async function getAgentContext(jobId) {
  const { data } = await httpClient.get(agentEndpoints.context(jobId));
  return data;
}

