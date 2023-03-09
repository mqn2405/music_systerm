import { request } from "../utils/request";

export async function userSignup(email, password) {
  return request({
    method: "POST",
    url: "/auth/signup",
    body: {
      email,
      password,
    },
  });
}

export async function userLogin(email, password) {
  return request({
    method: "POST",
    url: `/auth/login`,
    body: {
      email,
      password,
    },
  });
}
