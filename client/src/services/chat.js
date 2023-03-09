import { request } from "../utils/request";

export async function getAllUserHaveChat(userId) {
  return request({
    method: "GET",
    url: `/chat/user/list/${userId}`,
  });
}

export async function getUserChat({userId, ownerId}) {
  return request({
    method: "GET",
    url: `/chat/user?userId=${userId}&ownerId=${ownerId}`,
  });
}

export async function createUserChatReply(userId, message, owner_reply) {
  return request({
    method: "POST",
    url: `/chat/user/reply/${userId}`,
    body: {
      message,
      owner_reply,
    },
  });
}
