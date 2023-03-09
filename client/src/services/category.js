import { request } from "../utils/request";

export async function getAllCategory() {
  return request({
    method: "GET",
    url: "/category",
  });
}

export async function getCategoryDetail(id) {
  return request({
    method: "GET",
    url: `/category/${id}`,
  });
}

export async function createNewCategory(name, description) {
  return request({
    method: "POST",
    url: "/category",
    body: {
      name,
      description,
    },
  });
}

export async function updateCategory(id, name, description) {
  return request({
    method: "PUT",
    url: `/category/${id}`,
    body: {
      name,
      description,
    },
  });
}

export async function deleteCategoryData(id) {
  return request({
    method: "DELETE",
    url: `/category/${id}`,
  });
}

export async function getCategorySong() {
  return request({
    method: "GET",
    url: "/category/song/popular",
  });
}
