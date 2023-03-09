import React from "react";
import { useNavigate } from "react-router-dom";

export default function AlbumList({ albumList }) {
  const navigate = useNavigate();

  return (
    <div className="country-album">
      <div className="title">Album</div>
      <div className="album-list">
        <div className="row oneMusic-albums" style={{marginTop: '20px'}}>
          {albumList?.map((item, index) => {
            return (
              <div
                className="col-12 col-sm-4 col-md-3 col-lg-2 single-album-item"
                key={`album-item-${index}`}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/album/${item?._id}`)}
              >
                <div className="single-album" style={{width: '160px'}}>
                  <img
                    src={item?.avatar}
                    alt=""
                    style={{
                      width: "160px",
                      height: "160px",
                      minWidth: "160px",
                      minHeight: "160px",
                      border: "0.5px solid gray",
                    }}
                  />
                  <div className="album-info">
                    <a>
                      <h5>{item?.name}</h5>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
