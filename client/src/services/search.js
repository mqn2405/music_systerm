import { request } from "../utils/request";

export async function createKeyWordSearch(search) {
  return request({
    method: "POST",
    url: `/search/keyword`,
    body: {search}
  });
}

export async function getSongMostSearch() {
  return request({
    method: "GET",
    url: `/search/most`,
  });
}
