import { request } from "../utils/request";

export async function getAllCountry() {
  return request({
    method: "GET",
    url: "/country",
  });
}

export async function getCountryById(id) {
  return request({
    method: "GET",
    url: `/country/${id}`,
  });
}

export async function createNewCountry(name) {
  return request({
    method: "POST",
    url: "/country",
    body: {
      name,
    },
  });
}

export async function updateCountry(id, name) {
  return request({
    method: "PUT",
    url: `/country/${id}`,
    body: {
      name,
    },
  });
}

export async function deleteCountryData(id) {
  return request({
    method: "DELETE",
    url: `/country/${id}`,
  });
}
