import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import "./style.scss";
import avatarPlaceholder from "../../../../../../../assets/image/placeholder.png";
import { parseJSON } from "../../../../../../../utils/utils";
import { CHAT_HOST, USER_KEY } from "../../../../../../../utils/constants";
import { createUserChatReply, getUserChat } from "../../../../../../../services/chat";
import { toast } from "react-hot-toast";

export default function UserChat({ user }) {
  const [socketId, setSocketId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [userListMessage, setUserListMessage] = useState([]);
  const userSelected = useRef({});
  const userInfo = parseJSON(localStorage.getItem(USER_KEY));
  const socketRef = useRef();

  useEffect(() => {
    if (user?._id) userSelected.current = user?._id;
  }, [user]);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(CHAT_HOST);
    socketRef.current.on("getId", (data) => {
      setSocketId(data);
    });

    socketRef.current.on("sendDataServer", (dataGot) => {
      const chat = [...dataGot?.data?.chat];
      const find = chat?.findIndex(
        (item) =>
          (Number(item?.owner_id) === Number(userSelected.current) &&
            Number(item?.client_id) === Number(userInfo?._id)) ||
          (Number(item?.client_id) === Number(userSelected.current) &&
            Number(item?.owner_id) === Number(userInfo?._id))
      );
      if (find >= 0) {
        setUserListMessage(dataGot?.data?.chat);
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const userMessage = await getUserChat({
          userId: user?._id,
          ownerId: userInfo?._id,
        });
        if (userMessage?.data?.success) {
          setUserListMessage(userMessage?.data?.payload);
        }
      } else {
        if (userListMessage?.length) setUserListMessage([]);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (setChatMessage?.length) {
      setChatMessage("");
    }
  }, [user]);

  return (
    <div
      style={{
        minHeight: "84vh",
        maxHeight: "84vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "45px",
          padding: "6px 10px",
          boxSizing: "border-box",
          borderTop: "1px solid black",
          borderLeft: "1px solid black",
          borderRight: "1px solid black",
          fontWeight: 700,
        }}
      >
        {user ? (
          <span>
            <img
              src={avatarPlaceholder}
              width={30}
              height={30}
              alt="user_placeholder"
              style={{ borderRadius: "15px" }}
            />
          </span>
        ) : (
          <></>
        )}
        <span style={{ marginLeft: "10px" }}>{user?.email}</span>
      </div>
      <div
        style={{
          position: "absolute",
          height: "calc(84vh - 65px - 45px)",
          overflowY: "auto",
          width: "100%",
          paddingRight: "15px",
        }}
        className={"AdminChatMessageFrame"}
      >
        {userListMessage?.map((item, index) => {
          return (
            <div
              className={`message ${
                Number(item?.owner_id) === Number(userInfo?._id)
                  ? "message-right"
                  : "message-left"
              }`}
              key={`user-chat-item-${index}`}
            >
              <div
                className={`bubble ${
                  Number(item?.owner_id) === Number(userInfo?._id)
                    ? "bubble-dark"
                    : "bubble-light"
                }`}
              >
                {item?.message || item?.reply_message || ""}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div className={"AdminChattypeArea"}>
          <div className="input-wrapper">
            <input
              type="text"
              id="inputText"
              placeholder="Nhập tin nhắn vào đây..."
              value={chatMessage}
              onChange={(event) => {
                setChatMessage(event.target.value);
              }}
            />
          </div>
          <button
            disabled={!user?._id}
            className="button-send"
            onClick={async () => {
              if (!chatMessage?.trim()?.length) {
                return toast.error("Tin nhắn không thể bỏ trống");
              }
              const createRes = await createUserChatReply(
                user?._id,
                chatMessage?.trim(),
                userInfo?._id
              );
              if (createRes?.status === 200) {
                setChatMessage("");
                socketRef.current.emit("sendDataClient", {
                  userId: user?._id,
                  ownerId: userInfo?._id,
                });
              } else {
                toast.error("Gửi tin nhắn thất bại, vui lòng thử lại sau");
              }
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
