const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");
const moment = require("moment");

module.exports = {
  createNewSong: async (songData) => {
    try {
      const {
        name,
        link,
        description,
        category_id,
        album_id,
        country_id,
        avatar,
      } = songData;
      const result =
        await postgresql.query(`INSERT INTO songs(name, link, description, category_id, album_id, country_id, status, created_day, avatar, view) 
      VALUES('${name}', '${link}', '${description}', ${Number(category_id)}, ${
          album_id === -1 ? null : Number(album_id)
        }, ${Number(country_id)}, true, Now(), '${avatar}', 0)`);

      if (result) {
        const getLast = await postgresql.query(
          `SELECT * FROM songs ORDER BY created_day DESC LIMIT 1 OFFSET 0`
        );
        return getLast?.rows?.[0] || false;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  createSongSinger: async (songId, singerId) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO song_singer(song_id, singer_id, created_day) VALUES(${Number(
          songId
        )}, ${Number(singerId)}, Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateSongData: async (songId, songData) => {
    try {
      const {
        name,
        link,
        description,
        category_id,
        album_id,
        country_id,
        avatar,
      } = songData;

      const result =
        await postgresql.query(`UPDATE songs SET name='${name}', link='${link}', description='${description}',
      category_id=${Number(category_id)}, album_id=${
          album_id === -1 ? null : Number(album_id)
        }, country_id=${Number(
          country_id
        )}, avatar='${avatar}' WHERE _id=${Number(songId)}`);

      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getListSong: async (
    limit,
    offset,
    category,
    album,
    country,
    singer,
    searchText
  ) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT s.*, c.name as country_name, al.name as album_name, ct.name as category_name
        FROM songs s JOIN countries c ON s.country_id = c._id 
        LEFT JOIN albums al ON s.album_id = al._id  
        JOIN categorys ct ON s.category_id = ct._id
        WHERE ${
          category && category !== "undefined"
            ? `s.category_id = ${category}`
            : "s._id is not null"
        } AND 
        ${
          album && album !== "undefined"
            ? `s.album_id = ${album}`
            : "s._id is not null"
        } AND 
        ${
          country && country !== "undefined"
            ? `s.country_id = ${Number(country)}`
            : "s._id is not null"
        } AND 
        ${
          singer && singer !== "undefined"
            ? `${
                Number(singer) +
                " IN (SELECT ss.singer_id FROM song_singer ss WHERE ss.song_id = s._id)"
              }`
            : "s._id is not null"
        } AND 
        ${
          searchText && searchText !== "undefined"
            ? `lower(s.name) LIKE '%${searchText.toLowerCase()}%'`
            : "s._id is not null"
        }
        ORDER BY s.created_day DESC ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalSong: async (category, album, country, singer, searchText) => {
    try {
      const result = await postgresql.query(
        `SELECT COUNT(_id) as total_song 
        FROM songs 
        WHERE ${
          category && category !== "undefined"
            ? `category_id = ${category}`
            : "_id is not null"
        } AND 
        ${
          album && album !== "undefined"
            ? `album_id = ${album}`
            : "_id is not null"
        } AND 
        ${
          country && country !== "undefined"
            ? `country_id = ${Number(country)}`
            : "_id is not null"
        } AND 
        ${
          singer && singer !== "undefined"
            ? `${
                Number(singer) +
                " IN (SELECT ss.singer_id FROM song_singer ss WHERE ss.song_id = _id)"
              }`
            : "_id is not null"
        } AND 
        ${
          searchText && searchText !== "undefined"
            ? `lower(name) LIKE '%${searchText.toLowerCase()}%'`
            : "_id is not null"
        }`
      );
      return result?.rows?.[0]?.total_song || 0;
    } catch (error) {
      return 0;
    }
  },

  getSongSinger: async (songerId) => {
    try {
      const result = await postgresql.query(
        `SELECT ss.singer_id as _id, s.name FROM song_singer ss JOIN singers s ON ss.singer_id = s._id WHERE ss.song_id = ${Number(
          songerId
        )}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  deleteSongSinger: async (songId) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM song_singer WHERE song_id = ${Number(songId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteSong: async (songId) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM songs WHERE _id = ${Number(songId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getSongById: async (songId) => {
    try {
      const result = await postgresql.query(
        `SELECT s.*, (SELECT COUNT(sf.song_id) FROM song_favourite sf WHERE sf.song_id = s._id AND sf.favourite = 1) as total_favourite, 
        (SELECT COUNT(sf.song_id) FROM song_favourite sf WHERE sf.song_id = s._id AND sf.favourite = 0) as total_unfavourite
         FROM songs s WHERE s._id=${Number(songId)}`
      );
      return result?.rows?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  getSongView: async (songId) => {
    try {
      const result = await postgresql.query(
        `SELECT view FROM songs WHERE _id=${Number(songId)}`
      );
      return result?.rows?.[0]?.view || 0;
    } catch (error) {
      return 0;
    }
  },

  updateSongView: async (songId, view) => {
    try {
      const result = await postgresql.query(
        `UPDATE songs SET view=${Number(view)} WHERE _id=${Number(songId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getHotSongData: async () => {
    try {
      const result = await postgresql.query(
        `SELECT s.*, c.name as country_name, al.name as album_name, ct.name as category_name
        FROM songs s JOIN countries c ON s.country_id = c._id 
        LEFT JOIN albums al ON s.album_id = al._id  
        JOIN categorys ct ON s.category_id = ct._id
        ORDER BY s.view DESC LIMIT 100 OFFSET 0`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  createSongDownloadData: async (songId, userId) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO song_download(created_day, song_id, user_id) VALUES(now(), ${Number(
          songId
        )}, ${Number(userId) === -1 ? null : Number(userId)})`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getSongDownloadData: async (fromDate, toDate) => {
    try {
      const date_from =
        fromDate && fromDate !== "undefined"
          ? moment(
              moment(fromDate, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD hh:mm:ss")
          : "";

      const date_to =
        toDate && toDate !== "undefined"
          ? moment(moment(toDate, "YYYY-MM-DD")?.endOf("day").toDate()).format(
              "YYYY-MM-DD hh:mm:ss"
            )
          : "";

      const result = await postgresql.query(
        `SELECT COUNT(song_id) as total_download FROM song_download WHERE ${
          date_from && date_from !== "undefined"
            ? `date(created_day) >= date('${date_from}')`
            : " created_day is not null "
        } AND ${
          date_to && date_to !== "undefined"
            ? `date(created_day) <= date('${date_to}')`
            : "created_day is not null "
        } `
      );
      return result?.rows?.[0]?.total_download || 0;
    } catch (error) {
      return 0;
    }
  },

  getUserSongFavourite: async (userId, songId) => {
    try {
      const userFavourite = await postgresql.query(
        `SELECT * FROM song_favourite WHERE song_id=${Number(
          songId
        )} AND user_id=${Number(userId)}`
      );
      return userFavourite?.rows?.[0]?.favourite !== 0 &&
        userFavourite?.rows?.[0]?.favourite !== 1
        ? -1
        : userFavourite?.rows?.[0]?.favourite;
    } catch (error) {
      console.log("getUserBlogFavourite error >>>> ", error);
      return -1;
    }
  },

  changeUserFavouriteSong: async (userId, songId, status) => {
    try {
      await postgresql.query(
        `DELETE FROM song_favourite WHERE song_id=${Number(
          songId
        )} AND user_id=${Number(userId)}`
      );

      if (Number(status) !== -1) {
        await postgresql.query(
          `INSERT INTO song_favourite(user_id, song_id, favourite, created_day) VALUES(${Number(
            userId
          )}, ${Number(songId)}, ${Number(status)}, now())`
        );
      }

      return true;
    } catch (error) {
      console.log("changeUserFavouriteBlog error >>>> ", error);
      return false;
    }
  },

  getSongFavouriteData: async (fromDate, toDate) => {
    try {
      const date_from =
        fromDate && fromDate !== "undefined"
          ? moment(
              moment(fromDate, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD hh:mm:ss")
          : "";

      const date_to =
        toDate && toDate !== "undefined"
          ? moment(moment(toDate, "YYYY-MM-DD")?.endOf("day").toDate()).format(
              "YYYY-MM-DD hh:mm:ss"
            )
          : "";

      const result = await postgresql.query(
        `SELECT COUNT(song_id) as total_favourite FROM song_favourite WHERE ${
          date_from && date_from !== "undefined"
            ? `date(created_day) >= date('${date_from}')`
            : " created_day is not null "
        } AND ${
          date_to && date_to !== "undefined"
            ? `date(created_day) <= date('${date_to}')`
            : "created_day is not null "
        } AND favourite = 1`
      );
      return result?.rows?.[0]?.total_favourite || 0;
    } catch (error) {
      return 0;
    }
  },

  getTotalSongByDate: async (fromDate, toDate) => {
    try {
      const date_from =
        fromDate && fromDate !== "undefined"
          ? moment(
              moment(fromDate, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD hh:mm:ss")
          : "";

      const date_to =
        toDate && toDate !== "undefined"
          ? moment(moment(toDate, "YYYY-MM-DD")?.endOf("day").toDate()).format(
              "YYYY-MM-DD hh:mm:ss"
            )
          : "";

      const result = await postgresql.query(
        `SELECT COUNT(_id) as total_song FROM songs WHERE ${
          date_from && date_from !== "undefined"
            ? `date(created_day) >= date('${date_from}')`
            : " created_day is not null "
        } AND ${
          date_to && date_to !== "undefined"
            ? `date(created_day) <= date('${date_to}')`
            : "created_day is not null "
        }`
      );
      return result?.rows?.[0]?.total_song || 0;
    } catch (error) {
      return 0;
    }
  },

  createUserListenSong: async (userId, songId) => {
    try {
      const userHistory = await postgresql.query(
        `SELECT * FROM user_listen_time WHERE user_id=${Number(
          userId
        )} AND song_id=${Number(songId)}`
      );

      if (userHistory?.rows?.length) {
        const time = userHistory?.rows?.[0]?.time;
        const updateRes = await postgresql.query(
          `UPDATE user_listen_time SET time=${
            Number(time) + 1
          } WHERE user_id=${Number(userId)} AND song_id=${Number(songId)}`
        );
        return updateRes?.rows ? true : false;
      }
      const createRes = await postgresql.query(
        `INSERT INTO user_listen_time(user_id, song_id, time) VALUES(${Number(
          userId
        )}, ${Number(songId)}, 1)`
      );
      return createRes?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getUserListenData: async (userId) => {
    try {
      const list =
        await postgresql.query(`SELECT COUNT(s.category_id) as total_category, s.category_id FROM user_listen_time ult JOIN songs s ON ult.song_id = s._id WHERE ult.user_id = ${Number(
          userId
        )} group by s.category_id order by total_category DESC limit 10 offset 0;
      `);
      const listRow = list?.rows;

      const fullList = [];
      let listIndex = 0;

      while (fullList?.length < 10 && listIndex <= listRow?.length - 1) {
        const song =
          await postgresql.query(`SELECT s.*, c.name as country_name, al.name as album_name, ct.name as category_name
        FROM songs s JOIN countries c ON s.country_id = c._id 
        LEFT JOIN albums al ON s.album_id = al._id  
        JOIN categorys ct ON s.category_id = ct._id
        WHERE s.category_id=${Number(
          listRow[listIndex]?.category_id
        )} ORDER BY created_day ASC`);

        fullList?.push(...song?.rows);
        listIndex = listIndex + 1;
      }
      return fullList;
    } catch (error) {
      console.log("error >>> ", error);
      return [];
    }
  },

  getSongMostListen: async () => {
    try {
      const result =
        await postgresql.query(`SELECT s.*, c.name as country_name, al.name as album_name, ct.name as category_name, sum(ult.time) as total_listen
        FROM songs s JOIN user_listen_time ult ON s._id = ult.song_id 
       JOIN countries c ON s.country_id = c._id 
       LEFT JOIN albums al ON s.album_id = al._id  
       JOIN categorys ct ON s.category_id = ct._id 
       GROUP BY (s._id, c.name, al.name, ct.name) 
       ORDER BY sum(ult.time) DESC LIMIT 10 OFFSET 0`);

      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getSongMostFavourite: async () => {
    try {
      const result =
        await postgresql.query(`SELECT s.*, c.name as country_name, al.name as album_name, ct.name as category_name, COUNT(sf.song_id) as total_favourite
        FROM songs s JOIN song_favourite sf ON s._id = sf.song_id 
       JOIN countries c ON s.country_id = c._id 
       LEFT JOIN albums al ON s.album_id = al._id  
       JOIN categorys ct ON s.category_id = ct._id 
       WHERE sf.favourite = 1
       GROUP BY (s._id, c.name, al.name, ct.name) 
       ORDER BY COUNT(sf.song_id) DESC LIMIT 10 OFFSET 0`);

      return result?.rows || [];

    } catch (error) {
      return []
    }
  }
};
