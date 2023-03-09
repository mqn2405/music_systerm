import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import SearchOutlined from "@mui/icons-material/Search";
import "./style.scss";
import socketIOClient from "socket.io-client";
import { parseJSON } from "../../../../../../../utils/utils";
import { CHAT_HOST, USER_KEY } from "../../../../../../../utils/constants";
import { getAllUserHaveChat } from "../../../../../../../services/chat";
import { getAllUserAccount } from "../../../../../../../services/user";
import { Avatar, Divider } from "@mui/material";

export default function ListUserHaveChat({ changeUserSelected }) {
  const [listUser, setListUser] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const searchText = useRef("");
  const [searchList, setSearchList] = useState([]);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const userInfo = parseJSON(localStorage.getItem(USER_KEY));
  const socketRef = useRef();

  const getListUserHaveChat = async () => {
    const response = await getAllUserHaveChat(userInfo?._id);
    if (response?.data?.success) {
      setListUser(response?.data?.payload);
    }
  };

  const searchData = async (keyWord) => {
    if (keyWord?.length) {
      const searchList = await getAllUserAccount(
        undefined,
        undefined,
        undefined,
        keyWord?.trim()
      );
      if (searchList?.data?.payload?.user) {
        setSearchList(
          searchList?.data?.payload?.user?.filter(
            (item) => item?._id !== userInfo?._id
          )
        );
      }
    } else {
      setSearchList([]);
    }
  };

  useEffect(() => {
    getListUserHaveChat();
  }, []);

  const debounceSearch = useCallback(
    _.debounce(() => {
      searchData(searchText.current);
    }, 200),
    []
  );

  useEffect(() => {
    socketRef.current = socketIOClient.connect(CHAT_HOST);

    socketRef.current.on("sendDataServer", (dataGot) => {
      const listUser = [...dataGot?.data?.listUser?.user];
      const owner = dataGot?.data?.listUser?.owner;
      if (Number(owner) === Number(userInfo?._id)) {
        setListUser(listUser);
      }
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "84vh",
        maxHeight: "84vh",
        overflowY: "auto",
      }}
    >
      <div className="homeSearchBar">
        <div style={{ position: "relative" }}>
          <div className="search" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="searchTerm"
              placeholder="Nhập email khách hàng muốn tìm kiếm tại đây?"
              onChange={(event) => (searchText.current = event.target.value)}
              onKeyUp={(event) => {
                if (event?.code === "Backspace") {
                  debounceSearch();
                }
              }}
              style={{ width: "80%" }}
              onClick={() => {
                if (!isComponentVisible) {
                  setIsComponentVisible(true);
                }
              }}
            />
            <button
              type="submit"
              className="searchButton"
              onClick={() => {
                if (!isComponentVisible) {
                  setIsComponentVisible(true);
                }
                searchData(searchText.current);
              }}
            >
              <SearchOutlined />
            </button>
          </div>
          {(searchList?.length && isComponentVisible && (
            <ul
              ref={ref}
              style={{
                maxHeight: "300px",
                overflow: "auto",
                background: "white",
                position: "absolute",
                width: "80%",
                zIndex: 50,
                padding: "10px",
                borderBottom: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
                listStyleType: "none",
              }}
            >
              {searchList?.map((item, index) => {
                return (
                  <>
                    <li
                      key={`search-list-item-${index}`}
                      style={{ cursor: "pointer", textAlign: "left" }}
                      onClick={() => {
                        const checkUser = listUser?.find(
                          (it) => it?._id === item?._id
                        );
                        if (!checkUser?._id) {
                          const ur = [...listUser];
                          ur?.push(item);
                          setListUser(ur);
                        }
                        changeUserSelected?.(item);
                        setUserSelected(item?._id);
                        setIsComponentVisible(false);
                      }}
                    >
                      {item?.email}
                    </li>
                    {index < searchList?.length - 1 && (
                      <Divider
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          border: "0.5px solid black",
                        }}
                      />
                    )}
                  </>
                );
              })}
            </ul>
          )) ||
            ""}
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        {listUser?.map((item, index) => {
          return (
            <div
              key={`user-chat-item-${index}`}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "10px 5px",
                cursor: "pointer",
                border: item?._id === userSelected ? "1px solid black" : "",
              }}
              onClick={() => {
                if (item?._id !== userSelected) {
                  changeUserSelected?.(item);
                  setUserSelected(item?._id);
                }
              }}
            >
              <div>
                <Avatar
                  style={{
                    backgroundColor: "black",
                    verticalAlign: "middle",
                    color: 'white',
                    fontWeight: 700
                  }}
                  size="large"
                >
                  {item?.email?.charAt(0)?.toUpperCase()}
                </Avatar>
              </div>
              <div style={{ marginLeft: "10px" }}>{item?.email}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
