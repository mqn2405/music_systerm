const asyncHandler = require("express-async-handler");
const {
  getReviewBySongId,
  getTotalReviewBySongId,
  createNewReviewData,
  changeReviewStatus,
  getAllReview,
  deleteReviewData,
  updateReviewData,
  createReviewChildren,
  deleteReviewChildren,
  updateReviewChildrenStatus,
  updateUserReviewChildren
} = require("../models/review");

module.exports = {
  getReviewBySongId: asyncHandler(async (req, res) => {
    const { songId } = req.params;
    const { limit, page } = req.query;
    const response = await getReviewBySongId(songId, limit, page);
    const total = await getTotalReviewBySongId(songId);
    res.send({
      success: true,
      payload: { review: response, totalItem: total },
    });
  }),

  createNewReview: asyncHandler(async (req, res) => {
    const { user_id, review, song_id } = req.body;
    const response = await createNewReviewData(user_id, review, song_id);
    res.send({ success: response });
  }),

  changeReviewStatus: asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { status } = req.body;
    const response = await changeReviewStatus(reviewId, status);
    res.send({ success: response });
  }),

  getAllReview: asyncHandler(async (req, res) => {
    const response = await getAllReview();
    res.send({ success: true, payload: response });
  }),

  deleteReviewData: asyncHandler(async (req, res) => {
    const { reviewId } = req?.params;
    const response = await deleteReviewData(reviewId);
    res.send({ success: response });
  }),

  updateUserReview: asyncHandler(async (req, res) => {
    const { reviewId } = req?.params;
    const { review } = req?.body;
    const response = await updateReviewData(reviewId, review);
    res.send({ success: response });
  }),

  createReviewChildren: asyncHandler(async (req, res) => {
    const { review_id, user_id, review, author_type } = req?.body;
    const response = await createReviewChildren(
      review_id,
      user_id,
      review,
      author_type
    );
    res.send({ success: response });
  }),

  deleteReviewChildren: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const response = await deleteReviewChildren(childrenId);
    res.send({ success: response });
  }),

  updateReviewChildrenStatus: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const { status } = req?.body;
    const response = await updateReviewChildrenStatus(childrenId, status);
    res.send({ success: response });
  }),

  updateUserReviewChildren: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const { review } = req?.body;
    const response = await updateUserReviewChildren(childrenId, review);
    res.send({ success: response });
  }),
};
