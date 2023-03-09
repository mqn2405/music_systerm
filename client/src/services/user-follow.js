import { request } from "../utils/request";

export async function createUserFollow(user_id, followed) {
  return request({
    method: "POST",
    url: "/user-follow",
    body: {
      user_id,
      followed,
    },
  });
}

export async function deleteUserFollow(user_id, followed) {
  return request({
    method: "DELETE",
    url: `/user-follow/${user_id}`,
    body: {
      followed,
    },
  });
}

export async function getUserFollow(limit, offset, user_id) {
  return request({
    method: "GET",
    url: `/user-follow/${user_id}?limit=${limit}&offset=${offset}`,
  });
}

export async function checkUserFollower(user_id, followed) {
  return request({
    method: "GET",
    url: `/user-follow/${user_id}/check/${followed}`,
  });
}
