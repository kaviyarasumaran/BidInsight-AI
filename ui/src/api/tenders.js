import { endpoints } from "./endpoints";
import { httpClient } from "./httpClient";

/**
 * @param {import("./types").TenderCreateRequest} payload
 * @returns {Promise<import("./types").TenderCreateResponse>}
 */
export async function createTender(payload) {
  const { data } = await httpClient.post(endpoints.tenders, payload);
  return data;
}

/**
 * Multipart: raw_text + files[]
 * @param {string} tenderId
 * @param {{ rawText?: string, files?: File[] }} input
 * @returns {Promise<import("./types").TenderInputResponse>}
 */
export async function uploadTenderInput(tenderId, input) {
  const form = new FormData();
  if (input?.rawText) form.append("raw_text", input.rawText);
  (input?.files || []).forEach((f) => form.append("files", f));

  const { data } = await httpClient.post(endpoints.tenderInput(tenderId), form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * @param {string} tenderId
 * @returns {Promise<import("./types").CriteriaResponse>}
 */
export async function getTenderCriteria(tenderId) {
  const { data } = await httpClient.get(endpoints.tenderCriteria(tenderId));
  return data;
}

/**
 * @param {string} tenderId
 * @returns {Promise<{text: string, pages: Array, tender_id: string}>}
 */
export async function getTenderOcr(tenderId) {
  const { data } = await httpClient.get(endpoints.tenderOcr(tenderId));
  return data;
}

/**
 * @param {string} tenderId
 * @returns {Promise<{processing_job_id: string}>}
 */
export async function regenerateTender(tenderId) {
  const { data } = await httpClient.post(`${endpoints.tenders}/${tenderId}/regenerate`);
  return data;
}
