import React from "react";
import { useNavigate } from "react-router-dom";

export default function Prominent() {
  const navigate = useNavigate();

  return (
    <div className="prominent">
      <div className="title category-title">Nổi bật</div>
      <div className="list category-list">
        <div
          className="category-list-item list-item item1"
          onClick={() => {
            navigate("/new-song");
          }}
        >
          Nhạc mới
        </div>
        <div
          className="category-list-item list-item item2"
          onClick={() => {
            navigate("/top-100");
          }}
        >
          Top 100
        </div>
      </div>
    </div>
  );
}
