const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getListSinger: async (limit, offset, country, searchText) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(
        `SELECT s.*, c.name as country_name 
        FROM singers s LEFT JOIN countries c ON s.country_id = c._id 
        WHERE ${
          country && country !== "undefined"
            ? `s.country_id = ${Number(country)}`
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

  getTotalSinger: async (country, searchText) => {
    try {
      const result = await postgresql.query(
        `SELECT s.* FROM singers s
        WHERE ${
          country && country !== "undefined"
            ? `s.country_id = ${Number(country)}`
            : "s._id is not null"
        } AND 
        ${
          searchText && searchText !== "undefined"
            ? `lower(s.name) LIKE '%${searchText.toLowerCase()}%'`
            : "s._id is not null"
        }`
      );
      return result?.rows?.length || 0;
    } catch (error) {
      return 0;
    }
  },

  getSingerById: async (singerId) => {
    try {
      const result = await postgresql.query(`SELECT s.*, c.name as country_name 
      FROM singers s LEFT JOIN countries c ON s.country_id = c._id WHERE s._id=${Number(
        singerId
      )}`);
      return result?.rows?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  createNewSinger: async (name, description, avatar, countryId) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO singers(name, description, avatar, created_day, country_id) VALUES('${name}', '${description}', '${avatar}', Now(), ${Number(
          countryId
        )})`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateSingerData: async (id, name, description, avatar, countryId) => {
    try {
      const result = await postgresql.query(
        `UPDATE singers SET name='${name}', description='${description}', avatar='${avatar}', country_id=${Number(
          countryId
        )} WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteSingerData: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM singers WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeSingerEffect: async (id, effect) => {
    try {
      const result = await postgresql.query(
        `UPDATE singers SET effect=${effect} WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getPopularSingerData: async () => {
    try {
      const result = await postgresql.query(
        `SELECT * FROM singers WHERE effect = true`
      );
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },
};
