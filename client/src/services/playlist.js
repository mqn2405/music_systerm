import { request } from "../utils/request";

export async function getAllPlaylist(limit, offset, user_id) {
  return request({
    method: "GET",
    url: `/playlist?limit=${limit}&offset=${offset}&user_id=${user_id}`,
  });
}

export async function createNewPlaylist(user_id, name) {
  return request({
    method: "POST",
    url: "/playlist",
    body: {
      user_id,
      name,
    },
  });
}

export async function updatePlaylistName(id, name, userId) {
  return request({
    method: "PUT",
    url: `/playlist/${id}`,
    body: {
      name,
      userId
    },
  });
}

export async function deletePlaylistData(id) {
  return request({
    method: "DELETE",
    url: `/playlist/${id}`,
  });
}

export async function createPlaylistSong(id, song_id) {
  return request({
    method: "POST",
    url: `/playlist/${id}/song`,
    body: {
      song_id,
    },
  });
}

export async function checkPlaylistSong(id, song_id) {
  return request({
    method: "GET",
    url: `/playlist/${id}/song/${song_id}/check`,
  });
}

export async function getPlaylistSong(id) {
  return request({
    method: "GET",
    url: `/playlist/${id}/song`,
  });
}

export async function deletePlaylistSong(id, song_id) {
  return request({
    method: "DELETE",
    url: `/playlist/${id}/song/${song_id}`,
  });
}
