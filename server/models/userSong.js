const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  createUserSong: async (userId, songData) => {
    try {
      const { name, link, avatar } = songData;

      const result = await postgresql.query(
        `INSERT INTO user_upload_song(user_id, song_name, link, avatar, created_day) VALUES(${Number(
          userId
        )}, '${name}', '${link}', '${avatar}', Now())`
      );

      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateUserSong: async (userSongId, songData) => {
    try {
      const { name, link, avatar } = songData;

      const result =
        await postgresql.query(`UPDATE user_upload_song SET song_name='${name}', link='${link}', avatar='${avatar}' WHERE _id=${Number(userSongId)}`);

      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getListUserSong: async (
    limit,
    offset,
    userId
  ) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT * FROM user_upload_song WHERE user_id=${Number(userId)}
        ORDER BY created_day DESC ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalUserSong: async (userId) => {
    try {
      const result = await postgresql.query(
        `SELECT COUNT(_id) as total_song 
        FROM user_upload_song 
        WHERE user_id=${Number(userId)}`
      );
      return result?.rows?.[0]?.total_song || 0;
    } catch (error) {
      return 0;
    }
  },

  deleteUserSong: async (userSongId) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM user_upload_song WHERE _id = ${Number(userSongId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
};
