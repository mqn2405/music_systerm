import { request } from "../utils/request";

export async function getAllReportUser(limit, offset) {
  return request({
    method: "GET",
    url: `/user-report?limit=${limit}&offset=${offset}`,
  });
}

export async function createNewReportUser(user_id, reported, reason) {
  return request({
    method: "POST",
    url: "/user-report",
    body: {
      user_id,
      reported,
      reason
    },
  });
}

export async function deleteReportUser(id) {
  return request({
    method: "DELETE",
    url: `/user-report/${id}`,
  });
}