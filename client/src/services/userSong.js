import { request } from "../utils/request";

export async function getUserSong(
  limit,
  offset,
  userId
) {
  return request({
    method: "GET",
    url: `/user-song?limit=${limit}&offset=${offset}&userId=${userId}`,
  });
}

export async function createUserSong(userId, data) {
  return request({
    method: "POST",
    url: `/user-song?userId=${userId}`,
    body: {
      ...data,
    },
  });
}

export async function updateUserSong(userSongId, data) {
  return request({
    method: "PUT",
    url: `/user-song/${userSongId}`,
    body: {
      ...data,
    },
  });
}

export async function deleteUserSongData(userSongId) {
  return request({
    method: "DELETE",
    url: `/user-song/${userSongId}`,
  });
}