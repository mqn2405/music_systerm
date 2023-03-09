const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getUserReport: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT ur.*, u.email as user_email, u1.email as reported_email FROM user_report ur JOIN users u ON ur.user_id = u._id JOIN users u1 ON ur.reported = u1._id
        ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalUserReport: async () => {
    try {
      const result = await postgresql.query(
        `SELECT COUNT(*) AS total_item FROM user_report`
      );
      return result?.rows?.[0]?.total_item || 0;
    } catch (error) {
      return 0;
    }
  },

  createUserReport: async (user_id, reported, reason) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO user_report(user_id, reported, reason, created_day) VALUES(${Number(
          user_id
        )}, ${Number(reported)}, '${reason}', Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteUserReport: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM user_report WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
};
