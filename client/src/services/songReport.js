import { request } from "../utils/request";

export async function getAllReportSong(limit, offset) {
  return request({
    method: "GET",
    url: `/song-report?limit=${limit}&offset=${offset}`,
  });
}

export async function createNewReportSong(user_id, song_id, reason) {
  return request({
    method: "POST",
    url: "/song-report",
    body: {
      user_id,
      song_id,
      reason
    },
  });
}

export async function deleteReportSong(id) {
  return request({
    method: "DELETE",
    url: `/song-report/${id}`,
  });
}