const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getSongReport: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT rsl.*, s.name as song_name, ur.email as user_email
        FROM report_song_list rsl JOIN songs s ON rsl.song_id=s._id 
        JOIN users ur ON ur._id = rsl.user_id
        ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalSongReport: async () => {
    try {
      const result = await postgresql.query(
        `SELECT COUNT(*) AS total_item FROM report_song_list`
      );
      return result?.rows?.[0]?.total_item || 0;
    } catch (error) {
      return 0;
    }
  },

  createSongReport: async (user_id, song_id, reason) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO report_song_list(user_id, song_id, reason, created_day) VALUES(${Number(
          user_id
        )}, ${Number(song_id)}, '${reason}', Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteSongReport: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM report_song_list WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
};
