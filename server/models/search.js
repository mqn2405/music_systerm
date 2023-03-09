const { postgresql } = require("../config/connect");

module.exports = {
  createKeyWordSearch: async (search) => {
    try {
      const keyWordRes = await postgresql.query(`SELECT * FROM keyword_search`);
      const allKeyWord = keyWordRes?.rows;
      const searchIndex = allKeyWord?.findIndex(
        (item) => item?.keyword === search
      );

      if (searchIndex < 0) {
        const response = await postgresql.query(
          `INSERT INTO keyword_search(keyword, created_day, search_number) VALUES('${search}', Now(), 0)`
        );
        return response?.rows ? true : false;
      } else {
        const response = await postgresql.query(
          `UPDATE keyword_search SET search_number=${
            Number(allKeyWord[searchIndex]?.search_number) + 1
          } WHERE _id=${Number(allKeyWord[searchIndex]?._id)}`
        );
        return response?.rows ? true : false;
      }
    } catch (error) {
      console.log("createKeyWordSearch error >>>> ", error);
      return false;
    }
  },

  getSongMostSearch: async () => {
    try {
      const keyWordRes = await postgresql.query(
        `SELECT * FROM keyword_search ORDER BY search_number DESC LIMIT 10 OFFSET 0`
      );
      const keyWordList = keyWordRes?.rows;
      const allProduct = [];
      for (let i = 0; i < keyWordList?.length; i++) {
        const product = await postgresql.query(
          `SELECT * FROM songs WHERE lower(unaccent(name)) LIKE '%${keyWordList?.[
            i
          ]?.keyword
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")}%' ORDER BY created_day DESC`
        );
        allProduct?.push(...product?.rows);
      }
      const filterProduct = [];
      allProduct.forEach((item) => {
        const index = filterProduct?.findIndex(
          (it) => it?._id === item?._id
        );
        if (index < 0) {
          filterProduct?.push(item);
        }
      });
      return filterProduct?.slice(0, 10);
    } catch (error) {
      console.log("getProductMostSearch error >>>> ", error);
      return [];
    }
  },
};
