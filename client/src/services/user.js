import { request } from "../utils/request";

export async function getAllUserAccount(limit, offset, except_id, keySearch) {
  return request({
    method: "GET",
    url: `/user/account?limit=${limit}&offset=${offset}&except_id=${except_id}&keySearch=${keySearch}`,
  });
}

export async function changeUserStatus(userId, status) {
  return request({
    method: "PUT",
    url: `/user/status/${userId}`,
    body: { status },
  });
}

export async function changeUserRank(userId, rank) {
  return request({
    method: "PUT",
    url: `/user/rank/${userId}`,
    body: { rank },
  });
}

export async function getUserById(id) {
  return request({
    method: "GET",
    url: `/user/${id}/info`,
  });
}

export async function updateUserInfo(id, name, email, birthday) {
  return request({
    method: "PUT",
    url: `/user/${id}/info`,
    body: {
      name,
      email,
      birthday,
    },
  });
}

export async function getBase64(url) {
  return request({
    method: "POST",
    url: `/user/get/base64`,
    body: {
      url,
    },
  });
}

export async function changeUserPassword(userId, password) {
  return request({
    method: "PUT",
    url: `/user/password/${userId}`,
    body: { password },
  });
}

export async function checkEmailExist(email) {
  return request({
    method: "POST",
    url: `/user/check-email`,
    body: { email },
  });
}

export async function sendOtp(email) {
  return request({
    method: "POST",
    url: `/user/send-otp`,
    body: { email },
  });
}

export async function confirmOtp(email, otp) {
  return request({
    method: "POST",
    url: `/user/confirm-otp`,
    body: { email, otp },
  });
}

export async function changeForgotPassword(email, password) {
  return request({
    method: "POST",
    url: `/user/change-forgot-password`,
    body: { email, password },
  });
}
