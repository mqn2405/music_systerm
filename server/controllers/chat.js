const asyncHandler = require("express-async-handler");
const { getUserChatMessage, createUserChatReply, getAllUserHaveChat } = require("../models/chat");

module.exports = {
  getChatByUserId: asyncHandler(async (req, res) => {
    try {
      const { userId, ownerId } = req?.query;
      const data = await getUserChatMessage(userId, ownerId);
      return res.send({ success: true, payload: data });

    } catch (error) {
      res.send({ success: false, error: "Lấy danh sách đoạn chat thất bại" });
    }
  }),

  createUserChatReply: asyncHandler(async (req, res) => {
    try {
      const { userId } = req?.params;
      const { message, owner_reply } = req?.body;
      const response = await createUserChatReply(
        userId,
        message,
        owner_reply
      );
      if (response) {
        return res.send({ success: true });
      }
      return res.send({ success: false, error: "Gửi đoạn chat thất bại" });
    } catch (error) {
      res.send({ success: false, error: "Gửi đoạn chat thất bại" });
    }
  }),

  getAllUserHaveChat: asyncHandler(async (req, res) => {
    try {
      const {userId} = req?.params
      const data = await getAllUserHaveChat(userId);
      if (data?.length) {
        return res.send({ success: true, payload: data });
      }
      return res.send({ success: false, error: "Lấy danh sách đoạn chat thất bại" });
    } catch (error) {
      res.send({ success: false, error: "Lấy danh sách đoạn chat thất bại" });
    }
  }),
};
