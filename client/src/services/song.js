import { request } from "../utils/request";

export async function getAllSong(
  limit,
  offset,
  album,
  category,
  country,
  singer,
  searchText
) {
  return request({
    method: "GET",
    url: `/song?limit=${limit}&offset=${offset}&album=${album}&category=${category}&country=${country}&singer=${singer}&searchText=${searchText}`,
  });
}

export async function createNewSong(data) {
  return request({
    method: "POST",
    url: "/song",
    body: {
      ...data,
    },
  });
}

export async function updateSong(id, data) {
  return request({
    method: "PUT",
    url: `/song/${id}`,
    body: {
      ...data,
    },
  });
}

export async function deleteSongData(id) {
  return request({
    method: "DELETE",
    url: `/song/${id}`,
  });
}

export async function getSongById(id) {
  return request({
    method: "GET",
    url: `/song/${id}`,
  });
}

export async function updateSongView(id) {
  return request({
    method: "GET",
    url: `/song/view/${id}`,
  });
}

export async function getHotSongList() {
  return request({
    method: "GET",
    url: `/song/hot/list`,
  });
}

export async function createSongDownload(songId, userId) {
  return request({
    method: "POST",
    url: `/song/${songId}/download`,
    body: {
      userId,
    },
  });
}

export async function getUserFavouriteSong(songId, userId) {
  return request({
    method: "GET",
    url: `/song/favourite/data?songId=${songId}&userId=${userId}`,
  });
}

export async function changeUserFavouriteSong(songId, userId, status) {
  return request({
    method: "PUT",
    url: `/song/favourite/data?songId=${songId}&userId=${userId}`,
    body: {
      status,
    },
  });
}

export async function createUserListenHistory(songId, userId) {
  return request({
    method: "POST",
    url: `/song/${songId}/user/listen`,
    body: {
      userId,
    },
  });
}

export async function getUserListen(userId) {
  return request({
    method: "GET",
    url: `/song/user/listen?userId=${userId}`,
  });
}

export async function getMostListen() {
  return request({
    method: "GET",
    url: `/song/most-listen/list`,
  });
}

export async function getMostFavourite() {
  return request({
    method: "GET",
    url: `/song/most-favourite/list`,
  });
}