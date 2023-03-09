import { request } from "../utils/request";

export async function adminLogin(email, password) {
  return request({
    method: "POST",
    url: `/admin/login`,
    body: {
      email,
      password,
    },
  });
}

export async function createAdminAccount({ email, name, password }) {
  return request({
    method: "POST",
    url: "/admin/account",
    body: {
      email,
      name,
      password,
    },
  });
}

export async function getAllAdminAccount() {
  return request({
    method: "GET",
    url: "/admin/account",
  });
}


export async function deleteAdminAccount(adminId) {
  return request({
    method: "DELETE",
    url: `/admin/account/${adminId}`,
  });
}

export async function changeAdminStatus(adminId, status) {
  return request({
    method: "PUT",
    url: `/admin/status/${adminId}`,
    body: {status}
  });
}

export async function getAdminStatistical(fromDate, toDate) {
  return request({
    method: "get",
    url: `/admin/statistical?fromDate=${fromDate}&toDate=${toDate}`,
  });
}
