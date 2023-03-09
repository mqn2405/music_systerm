const { postgresql } = require("../config/connect");

module.exports = {
  getListCountry: async () => {
    try {
      const result = await postgresql.query(`SELECT * FROM countries`);
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getCountryById: async(id) => {
    try {
      const result = await postgresql.query(`SELECT * FROM countries WHERE _id=${Number(id)}`)
      return result?.rows?.[0] || {}
    } catch (error) {
      return {};
    }
  },

  createNewCountry: async (name) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO countries(name, created_day) VALUES('${name}', Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateCountryData: async (id, name) => {
    try {
      const result = await postgresql.query(
        `UPDATE countries SET name='${name}' WHERE _id=${Number(
          id
        )}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteCountryData: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM countries WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
};
