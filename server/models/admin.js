const { postgresql } = require("../config/connect");
const bcrypt = require("bcrypt");

module.exports = {
  getAdminByEmail: async (email) => {
    try {
      const admin = await postgresql.query(
        `SELECT * FROM admins WHERE email='${email}'`
      );
      if (admin?.rows?.length) {
        return admin?.rows[0];
      }
      return {};
    } catch (error) {
      console.log("get admin by email error >>>> ", error);
      return {};
    }
  },

  createNewAccount: async (email, name, password) => {
    try {
      const hash = bcrypt.hashSync(password, 10);
      const signupRes = await postgresql.query(
        `INSERT INTO admins(email, name, password, status, created_day) VALUES('${email}', '${name}', '${hash}', true, now())`
      );
      if (signupRes) return true;
      return false;
    } catch (error) {
      console.log("create admin account error >>>> ", error);
      return false;
    }
  },

  getAllAdminAccount: async () => {
    try {
      const result = await postgresql.query(`SELECT * FROM admins ORDER BY created_day DESC`);
      return result?.rows || [];
    } catch (error) {
      console.log("getAllAdminAccounterror >>>> ", error);
      return [];
    }
  },

  deleteAdminAccount: async (adminId) => {
    try {
      const result = await postgresql.query(
        `DELETE FROM admins WHERE _id = ${Number(adminId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },

  changeAdminStatus: async (adminId, status) => {
    try {
      const result = await postgresql.query(
        `UPDATE admins SET status=${status} WHERE _id=${Number(adminId)}`
      );
      return result?.rows ? true : false;
    } catch (error) {
      return false;
    }
  },
};
