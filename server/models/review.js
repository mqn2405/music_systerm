const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getReviewBySongId: async (songId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const reviewRes = await postgresql.query(
        `SELECT sr.*, ur.name as user_name, ur.email as user_email FROM song_review sr JOIN users ur ON sr.user_id = ur._id WHERE sr.song_id=${Number(
          songId
        )} ORDER BY created_day DESC ${limitOffset}`
      );

      const reviewData = [...(reviewRes?.rows || [])];

      for (let i = 0; i < reviewData?.length; i++) {
        const userChildrenReview = await postgresql.query(
          `SELECT src.*, ur.name as user_name, ur.email as user_email FROM song_review_children src JOIN users ur ON src.user_id = ur._id WHERE review_id=${Number(
            reviewData?.[i]?._id
          )}`
        );

        reviewData[i].children_review = [...(userChildrenReview?.rows || [])];
      }

      return reviewData || [];
    } catch (error) {
      console.log('error >> ', error);
      return [];
    }
  },

  getTotalReviewBySongId: async (songId) => {
    try {
      const allItem = await postgresql.query(
        `select COUNT(song_review._id) as total_item from song_review WHERE song_id=${Number(
          songId
        )}`
      );

      return allItem?.rows?.[0]?.total_item || 0;
    } catch (error) {
      return 0;
    }
  },

  createNewReviewData: async (user_id, review, song_id) => {
    try {
      const reviewRes = await postgresql.query(
        `INSERT INTO song_review(created_day, user_id, review, song_id, status) VALUES(Now(), ${Number(
          user_id
        )}, '${review}', ${Number(song_id)}, 1)`
      );
      return reviewRes?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeReviewStatus: async (reviewId, status) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE song_review SET status=${Number(
          status
        )} WHERE _id=${reviewId}`
      );

      return updateRes?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getAllReview: async () => {
    try {
      const review = await postgresql.query(
        `SELECT sr.*, s.name as song_name, s.avatar as song_avatar, ur.name as user_name, (SELECT COUNT(*) AS total_review FROM song_review 
        WHERE song_id = sr.song_id) 
        FROM song_review sr JOIN users ur ON sr.user_id = ur._id JOIN songs s ON s._id = sr.song_id`
      );
      return review?.rows || [];
    } catch (error) {
      return [];
    }
  },

  deleteReviewData: async (reviewId) => {
    try {
      await postgresql.query(
        `DELETE FROM song_review_children WHERE review_id=${Number(
          reviewId
        )}`
      );

      const response = await postgresql.query(
        `DELETE FROM song_review WHERE _id=${Number(reviewId)}`
      );

      return response?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateReviewData: async (reviewId, review) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE song_review SET review='${review}' WHERE _id=${reviewId}`
      );

      return updateRes?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  createReviewChildren: async (review_id, user_id, review) => {
    try {
      const response =
        await postgresql.query(`INSERT INTO song_review_children(review_id, user_id, review, status, created_day) 
      VALUES(${Number(review_id)}, ${Number(
          user_id
        )}, '${review}', 1, Now())`);
      return response?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteReviewChildren: async (childrenId) => {
    try {
      const response = await postgresql.query(
        `DELETE FROM song_review_children WHERE _id=${Number(
          childrenId
        )}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateReviewChildrenStatus: async (childrenId, status) => {
    try {
      const response = await postgresql.query(
        `UPDATE song_review_children SET status = ${Number(
          status
        )} WHERE _id=${Number(childrenId)}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateUserReviewChildren: async (childrenId, review) => {
    try {
      const response = await postgresql.query(
        `UPDATE song_review_children SET review = '${review}' WHERE _id=${Number(
          childrenId
        )}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
}