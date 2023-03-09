const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getListAlbum: async (
    limit,
    offset,
    keyFilter,
    country,
    searchText,
    singer
  ) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT al.*, c.name as country_name
        FROM albums al LEFT JOIN countries c ON al.country_id = c._id 
        WHERE ${
          keyFilter === "al" || !keyFilter || keyFilter === "undefined"
            ? "al._id is not null"
            : keyFilter === "number"
            ? "lower(al.name) SIMILAR TO '[0-9]%'"
            : `lower(al.name) SIMILAR TO '(${keyFilter})%'`
        } AND 
        ${
          country && country !== "undefined"
            ? `al.country_id = ${Number(country)}`
            : "al._id is not null"
        } AND 
        ${
          searchText && searchText !== "undefined"
            ? `lower(al.name) LIKE '%${searchText.toLowerCase()}%'`
            : "al._id is not null"
        } AND 
        ${
          singer && singer !== "undefined"
            ? `${
                Number(singer) +
                " IN (SELECT a.singer_id FROM album_singer a WHERE a.album_id = al._id)"
              }`
            : "al._id is not null"
        }
        ORDER BY al.created_day DESC ${limitOffset}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getAlbumDetail: async (id) => {
    try {
      const result = await postgresql.query(
        `SELECT * FROM albums WHERE _id=${Number(id)}`
      );
      return result?.rows?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  getTotalAlbum: async (keyFilter, country, searchText, singer) => {
    try {
      const result = await postgresql.query(
        `SELECT * FROM albums WHERE ${
          keyFilter === "al" || !keyFilter || keyFilter === "undefined"
            ? "_id is not null"
            : keyFilter === "number"
            ? "lower(name) SIMILAR TO '[0-9]%'"
            : `lower(name) SIMILAR TO '(${keyFilter})%'`
        } AND 
        ${
          country && country !== "undefined"
            ? `country_id = ${Number(country)}`
            : "_id is not null"
        } AND 
        ${
          searchText && searchText !== "undefined"
            ? `lower(name) LIKE '%${searchText.toLowerCase()}%'`
            : "_id is not null"
        }  AND 
        ${
          singer && singer !== "undefined"
            ? `${
                Number(singer) +
                " IN (SELECT a.singer_id FROM album_singer a WHERE a.album_id = _id)"
              }`
            : "_id is not null"
        }`
      );
      return result?.rows?.length || 0;
    } catch (error) {
      return 0;
    }
  },

  createNewAlbum: async (name, description, avatar, countryId) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO albums(name, description, created_day, avatar, country_id) VALUES('${name}', '${description}', Now(), '${avatar}', ${Number(
          countryId
        )})`
      );
      if (result) {
        const getLast = await postgresql.query(
          `SELECT * FROM albums ORDER BY created_day DESC LIMIT 1 OFFSET 0`
        );
        return getLast?.rows?.[0] || false;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  updateAlbumData: async (id, name, description, avatar, countryId) => {
    try {
      const result = await postgresql.query(
        `UPDATE albums SET name='${name}', description='${description}', avatar='${avatar}',country_id=${Number(
          countryId
        )} WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteAlbumData: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM albums WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  createAlbumSinger: async (albumId, singerId) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO album_singer(album_id, singer_id, created_day) VALUES(${Number(
          albumId
        )}, ${Number(singerId)}, Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getAlbumSinger: async (albumId) => {
    try {
      const result = await postgresql.query(
        `SELECT a.singer_id as _id, s.name FROM album_singer a JOIN singers s ON a.singer_id = s._id WHERE a.album_id = ${Number(
          albumId
        )}`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  deleteAlbumSinger: async (albumId) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM album_singer WHERE album_id = ${Number(albumId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
};
