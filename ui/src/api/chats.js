import { endpoints } from "./endpoints";
import { httpClient } from "./httpClient";

export async function getRecentChats() {
  const { data } = await httpClient.get("/api/chats");
  return data;
}

export async function saveChatSession(payload) {
  const { data } = await httpClient.post("/api/chats", payload);
  return data;
}

export async function getChatSession(chatId) {
  const { data } = await httpClient.get(`/api/chats/${chatId}`);
  return data;
}
