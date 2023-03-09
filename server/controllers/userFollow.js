const asyncHandler = require("express-async-handler");
const {
  getUserFollow,
  createUserFollow,
  deleteUserFollow,
  checkUserFollower,
  getTotalUserFollow,
} = require("../models/userFollow");

module.exports = {
  getUserFollower: asyncHandler(async (req, res) => {
    try {
      const { userId } = req?.params;
      const {limit, offset} = req?.query
      const result = await getUserFollow(limit, offset, userId);
      const totalItem = await getTotalUserFollow(userId);
      return res.send({
        success: true,
        payload: {
          follower: result,
          totalItem: totalItem,
        },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách người theo dõi thất bại",
      });
    }
  }),

  createUserFollower: asyncHandler(async (req, res) => {
    try {
      const { user_id, followed } = req?.body;
      const result = await createUserFollow(user_id, followed);

      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo người theo dõi thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo người theo dõi thất bại",
      });
    }
  }),

  deleteUserFollower: asyncHandler(async (req, res) => {
    try {
      const { followed } = req?.body;
      const { userId } = req?.params;

      const result = await deleteUserFollow(userId, followed);

      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá người theo dõi thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá người theo dõi thất bại",
      });
    }
  }),

  checkUserFollower: asyncHandler(async (req, res) => {
    try {
      const { userId, followed } = req?.params;
      const result = await checkUserFollower(userId, followed);
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy thông tin thất bại",
      });
    }
  }),
};
