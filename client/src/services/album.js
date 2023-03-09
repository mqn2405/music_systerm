import { request } from "../utils/request";

export async function getAllAlbum(
  limit,
  offset,
  keyFilter,
  country,
  singer,
  searchText
) {
  return request({
    method: "GET",
    url: `/album?limit=${limit}&offset=${offset}&keyFilter=${keyFilter}&country=${country}&singer=${singer}&searchText=${searchText}`,
  });
}

export async function getAlbumById(id) {
  return request({
    method: "GET",
    url: `/album/${id}`,
  });
}

export async function createNewAlbum(
  name,
  description,
  avatar,
  singer,
  countryId
) {
  return request({
    method: "POST",
    url: "/album",
    body: {
      name,
      description,
      avatar,
      singer,
      countryId,
    },
  });
}

export async function updateAlbum(
  id,
  name,
  description,
  avatar,
  singer,
  countryId
) {
  return request({
    method: "PUT",
    url: `/album/${id}`,
    body: {
      name,
      description,
      avatar,
      singer,
      countryId,
    },
  });
}

export async function deleteAlbumData(id) {
  return request({
    method: "DELETE",
    url: `/album/${id}`,
  });
}
