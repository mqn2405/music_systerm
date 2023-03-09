import { request } from "../utils/request";

export async function getAllSinger(limit, offset, country, searchText) {
  return request({
    method: "GET",
    url: `/singer?limit=${limit}&offset=${offset}&country=${country}&searchText=${searchText}`,
  });
}

export async function getSingerById(id) {
  return request({
    method: "GET",
    url: `/singer/${id}`,
  });
}

export async function createNewSinger(name, description, avatar, countryId) {
  return request({
    method: "POST",
    url: "/singer",
    body: {
      name,
      description,
      avatar,
      countryId,
    },
  });
}

export async function updateSinger(id, name, description, avatar, countryId) {
  return request({
    method: "PUT",
    url: `/singer/${id}`,
    body: {
      name,
      description,
      avatar,
      countryId,
    },
  });
}

export async function deleteSingerData(id) {
  return request({
    method: "DELETE",
    url: `/singer/${id}`,
  });
}

export async function changeSingerEffect(id, effect) {
  return request({
    method: "PUT",
    url: `/singer/effect/${id}`,
    body: { effect },
  });
}

export async function getPopularSinger() {
  return request({
    method: "GET",
    url: `/singer/effect/list`,
  });
}
