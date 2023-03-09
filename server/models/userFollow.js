const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  createUserFollow: async (user_id, followed) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO user_flow(user_id, followed, created_day) VALUES(${Number(
          user_id
        )}, ${Number(followed)}, now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteUserFollow: async (user_id, followed) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM user_flow WHERE user_id=${Number(
          user_id
        )} AND followed=${Number(followed)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getUserFollow: async (limit, offset, user_id) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);

      const result = await postgresql.query(
        `SELECT uf.*, ur.name as follower_name, ur.email as follower_email 
        FROM user_flow uf JOIN users ur ON uf.followed = ur._id 
        WHERE uf.user_id=${Number(
          user_id
        )} ORDER BY uf.created_day DESC ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalUserFollow: async (user_id) => {
    try {
      const result = await postgresql.query(
        `SELECT COUNT(*) as total_item FROM user_flow
        WHERE user_id=${Number(user_id)}`
      );
      return result?.rows?.[0]?.total_item || 0;
    } catch (error) {
      return 0;
    }
  },

  checkUserFollower: async (userId, followed) => {
    try {
      const result = await postgresql.query(
        `SELECT * FROM user_flow WHERE user_id=${Number(
          userId
        )} AND followed=${Number(followed)}`
      );
      return result?.rows?.length ? true : false;
    } catch (error) {
      return false;
    }
  },
};
