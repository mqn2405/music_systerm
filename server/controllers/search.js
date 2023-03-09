const asyncHandler = require("express-async-handler");
const { createKeyWordSearch, getSongMostSearch } = require("../models/search");
const { getSongSinger } = require("../models/song");

module.exports = {
  createKeyWordSearch: asyncHandler(async (req, res) => {
    const { search } = req?.body;
    const response = await createKeyWordSearch(search);
    res.send({ success: response });
  }),

  getSongMostSearch: asyncHandler(async (req, res) => {
    try {
      const result = await getSongMostSearch();
      if (result) {
        for (let i = 0; i < result?.length; i++) {
          const singer = await getSongSinger(result?.[i]?._id);
          result[i].singer = [...singer];
        }
      }
      res.send({ success: true, payload: result });
    } catch (error) {
      console.log("error >> ", error);
      return res.send({
        success: false,
        error: "Lấy danh sách nhạc thất bại",
      });
    }
  }),
};
