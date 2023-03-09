const { postgresql } = require("../config/connect");

const ChatModel = {
  getUserChatMessage: async (userId, ownerId) => {
    try {
      const userReply =
        await postgresql.query(`SELECT ucr.user_id as client_id, ucr.owner_reply as owner_id, ucr.message AS reply_message, ucr.created_day, urr.name as user_name  
      FROM  user_chat ucr
      LEFT JOIN users urr ON ucr.user_id = urr._id
      WHERE ucr.user_id=${Number(userId)} AND ucr.owner_reply=${Number(ownerId)} ORDER BY created_day ASC`);

      const userChat =
        await postgresql.query(`SELECT ucr.user_id as client_id, ucr.owner_reply as owner_id, ucr.message AS reply_message, ucr.created_day, urr.name as user_name  
      FROM  user_chat ucr
      LEFT JOIN users urr ON ucr.owner_reply = urr._id
      WHERE ucr.owner_reply=${Number(userId)} AND ucr.user_id=${Number(ownerId)} ORDER BY created_day ASC`);
      
      const allChat = (userReply?.rows || []).concat(userChat?.rows || [])
      allChat.sort(function (x, y) {
        return x.created_day - y.created_day;
      });
      return allChat || [];
    } catch (error) {
      console.log("getUserChatMessage error >>>> ", error);
      return [];
    }
  },

  createUserChatReply: async (userId, message, ownerReply) => {
    try {
      const res = await postgresql.query(
        `INSERT INTO user_chat(user_id, owner_reply, message, created_day) VALUES(${Number(
          userId
        )}, ${Number(ownerReply)},'${message}', Now())`
      );
      return res?.rows ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  getAllUserHaveChat: async (userId) => {
    try {
      const userChat = await postgresql.query(
        `SELECT ur._id, ur.name, ur.email FROM user_chat uc JOIN users ur ON uc.owner_reply=ur._id WHERE uc.user_id=${userId}`
      );

      const chatReply = await postgresql.query(
        `SELECT ur._id, ur.name, ur.email FROM user_chat uc JOIN users ur ON uc.user_id=ur._id WHERE uc.owner_reply=${userId}`
      );

      const allUser = [];
      if (userChat?.rows) allUser?.push(...userChat?.rows);
      if (chatReply?.rows) allUser?.push(...chatReply?.rows);

      allUser?.sort(function (x, y) {
        return new Date(y.created_day) - new Date(x.created_day);
      });

      const obj = {};
      for (const item of allUser) {
        if (!obj[item._id]?._id) {
          obj[item._id] = item;
        }
      }

      const output = Object.values(obj);
      output?.sort(function (x, y) {
        return new Date(y.created_day) - new Date(x.created_day);
      });
      return output || [];
    } catch (error) {
      console.log("getAllUserHaveChat error >>>> ", error);
      return [];
    }
  },

  deleteUserChat: async (userId) => {
    try {
      const response = await postgresql.query(
        `DELETE FROM user_chat WHERE user_id=${Number(userId)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = ChatModel;
