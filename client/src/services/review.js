import { request } from "../utils/request";

export async function getReviewBySong({ songId, limit, page }) {
  return request({
    method: "GET",
    url: `/song/review/${songId}?limit=${limit}&page=${page}`,
  });
}

export async function createUserReview({ user_id, review, song_id }) {
  return request({
    method: "POST",
    url: `/song/review`,
    body: { user_id, review, song_id },
  });
}

export async function createChildrenReview({
  review_id,
  user_id,
  review,
}) {
  return request({
    method: "POST",
    url: `/song/review/children`,
    body: { review_id, user_id, review },
  });
}

export async function updateReviewChildrenStatus(childrenId, status) {
  return request({
    method: "PUT",
    url: `/song/review/children/${childrenId}/status`,
    body: { status },
  });
}

export async function deleteReviewChildren(childrenId) {
  return request({
    method: "DELETE",
    url: `/song/review/children/${childrenId}`,
  });
}

export async function updateUserReviewChildren(childrenId, review) {
  return request({
    method: "PUT",
    url: `/song/review/children/${childrenId}`,
    body: { review },
  });
}

export async function getAllReview() {
  return request({
    method: "GET",
    url: `/song/review`,
  });
}

export async function updateReviewStatus(reviewId, status) {
  return request({
    method: "PUT",
    url: `/song/review/${reviewId}/status`,
    body: { status },
  });
}

export async function deleteReviewData(reviewId) {
  return request({
    method: "DELETE",
    url: `/song/review/${reviewId}`,
  });
}

export async function updateUserReview(reviewId, review) {
  return request({
    method: "PUT",
    url: `/song/review/${reviewId}`,
    body: { review },
  });
}