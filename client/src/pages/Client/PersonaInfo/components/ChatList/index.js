import React from "react";
import { useState } from "react";
import ListUserHaveChat from "./components/ListUser";
import UserChat from "./components/UserChat";

export default function ChatList() {
  const [userSelected, setUserSelected] = useState("");

  return (
    <div
      className="row"
      style={{ padding: "20px 40px", border: "1px solid black" }}
    >
      <div className="col-5">
        <ListUserHaveChat
          changeUserSelected={(user) => {
            setUserSelected(user);
          }}
        />
      </div>

      <div className="col-7">
        <UserChat user={userSelected} />
      </div>
    </div>
  );
}
