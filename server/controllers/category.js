const asyncHandler = require("express-async-handler");
const {
  getListCategory,
  createNewCategory,
  updateCategoryData,
  deleteCategoryData,
  getTotalCategory,
  getCategoryById,
} = require("../models/category");
const { getListSong, getSongSinger } = require("../models/song");

module.exports = {
  getAllCategory: asyncHandler(async (req, res) => {
    try {
      const { limit, offset } = req?.query;
      const listCategory = await getListCategory(limit, offset);
      const totalItem = await getTotalCategory();
      return res.send({
        success: true,
        payload: { category: listCategory, totalItem },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách thể loại thất bại",
      });
    }
  }),

  createCategoty: asyncHandler(async (req, res) => {
    try {
      const { name, description } = req?.body;
      const result = await createNewCategory(name, description);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo thể loại thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo thể loại thất bại",
      });
    }
  }),

  updateCategoty: asyncHandler(async (req, res) => {
    try {
      const { name, description } = req?.body;
      const { categoryId } = req?.params;
      const result = await updateCategoryData(categoryId, name, description);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Cập nhật thể loại thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật thể loại thất bại",
      });
    }
  }),

  deleteCategoty: asyncHandler(async (req, res) => {
    try {
      const { categoryId } = req?.params;
      const result = await deleteCategoryData(categoryId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá thể loại thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá thể loại thất bại",
      });
    }
  }),

  getCategorySong: asyncHandler(async (req, res) => {
    try {
      const listCategory = await getListCategory();
      const newCategory = [...listCategory]?.slice(0, 10)
      const categoryFullData = [];

      for (let i = 0; i < newCategory?.length; i++) {
        const song = await getListSong(10, 0, newCategory?.[i]?._id);

        for (let j = 0; j < song?.length; j++) {
          const singer = await getSongSinger(song?.[j]?._id);
          song[j].singer = [...singer];
        }
        categoryFullData?.push({
          ...newCategory?.[i],
          song,
        });
      }
      return res.send({ success: true, payload: categoryFullData });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách bài hát thất bại",
      });
    }
  }),

  getCategoryDetail: asyncHandler(async (req, res) => {
    try {
      const { categoryId } = req?.params;
      const categoryDetail = await getCategoryById(categoryId);
      return res.send({ success: true, payload: categoryDetail });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách bài hát thất bại",
      });
    }
  }),
};
