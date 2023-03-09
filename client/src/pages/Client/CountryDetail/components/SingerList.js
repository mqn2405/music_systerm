import React from "react";
import { useNavigate } from "react-router-dom";

export default function SingerList({ singerList }) {
  const navigate = useNavigate();

  return (
    <div className="country-singer">
      <div className="title">Nghệ sĩ</div>
      <div className="singer-list">
        {singerList?.map((item, index) => {
          return (
            <div
              key={`singer-item-${index}`}
              className="singer-item"
              onClick={() => navigate(`/singer/${item?._id}`)}
            >
              <div className="singer-image">
                <img src={item?.avatar} alt="" />
              </div>
              <div className="singer-name">{item?.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
