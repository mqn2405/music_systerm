const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  getListCategory: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const result = await postgresql.query(`SELECT * FROM categorys ORDER BY created_day DESC ${limitOffset}`);
      return result?.rows || [];
    } catch (error) {
      return [];
    }
  },

  getTotalCategory: async () => {
    try {
      const result = await postgresql.query(`SELECT COUNT(_id) as total_category FROM categorys`)
      return result?.rows?.[0]?.total_category || 0
    } catch (error) {
      return 0
    }
  },

  createNewCategory: async (name, description) => {
    try {
      const result = await postgresql.query(
        `INSERT INTO categorys(name, description, created_day) VALUES('${name}', '${description}', Now())`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  updateCategoryData: async (id, name, description) => {
    try {
      const result = await postgresql.query(
        `UPDATE categorys SET name='${name}', description='${description}' WHERE _id=${Number(
          id
        )}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteCategoryData: async (id) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM categorys WHERE _id=${Number(id)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  getCategoryById: async(id) => {
    try {
      const result = await postgresql.query(
        `SELECT * FROM categorys WHERE _id=${Number(id)}`
      );
      return result?.rows?.[0] || {};
    } catch (error) {
      return {};
    }
  }
};
