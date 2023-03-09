const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getPlaylist: async (limit, offset, user_id) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT pl.* FROM playlist pl WHERE ${
          user_id && user_id !== "undefined"
            ? `pl.user_id = ${Number(user_id)}`
            : "pl._id is not null"
        } ORDER BY created_day DESC ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalPlaylist: async (user_id) => {
    try {
      const result = await postgresql.query(
        `SELECT COUNT(*) AS total_item FROM playlist pl WHERE ${
          user_id && user_id !== "undefined"
            ? `pl.user_id = ${Number(user_id)}`
            : "pl._id is not null"
        }`
      );
      return result?.rows?.[0]?.total_item || 0;
    } catch (error) {
      return 0;
    }
  },

  createPlaylist: async (user_id, name) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO playlist(user_id, name, created_day) VALUES(${Number(
          user_id
        )}, '${name}', Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deletePlaylist: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM playlist WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  createPlayListDetail: async (playListId, song_id) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO playlist_detail(playlist_id, song_id, created_day) VALUES(${Number(
          playListId
        )}, ${Number(song_id)}, Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deletePlayListDetail: async (playlist_id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM playlist_detail WHERE playlist_id=${Number(playlist_id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteSongPlayListDetail: async (playlist_id, song_id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM playlist_detail WHERE playlist_id=${Number(
          playlist_id
        )} AND song_id=${Number(song_id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getPlayListDetail: async (playListId) => {
    try {
      const result = await postgresql.query(
        `SELECT pd.created_day playlist_song_created, s.* FROM playlist_detail pd JOIN songs s ON pd.song_id = s._id WHERE pd.playlist_id = ${Number(
          playListId
        )}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getSongPlayList: async (playlistId, songId) => {
    try {
      const result = await postgresql.query(
        `SELECT * FROM playlist_detail WHERE playlist_id=${Number(
          playlistId
        )} AND song_id=${Number(songId)}`
      );
      return result?.rows?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  updatePlaylistName: async (playlistId, name) => {
    try {
      const result = await postgresql.query(
        `UPDATE playlist SET name='${name}' WHERE _id=${Number(playlistId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  checkPlaylistName: async (name, userId) => {
    try {
      const result = await postgresql.query(`SELECT * FROM playlist WHERE name='${name}' AND user_id=${Number(userId)}`);
      return result?.rows?.length ? true : false;
    } catch (error) {
      return false;
    }
  },
};
