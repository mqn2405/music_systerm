import React from "react";
import { useNavigate } from "react-router-dom";

export default function AlbumList({ albumList, page, totalPage, setPage }) {
  const navigate = useNavigate();

  return (
    <div className="row oneMusic-albums">
      {!albumList?.length ? (
        <div
          className="col-12"
          style={{
            textAlign: "center",
            marginBottom: "100px",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          Không có album phù hợp với từ khoá tìm kiếm
        </div>
      ) : (
        albumList?.map((item, index) => {
          return (
            <div
              className="col-12 col-sm-4 col-md-3 col-lg-2 single-album-item"
              key={`album-item-${index}`}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/album/${item?._id}`)}
            >
              <div className="single-album">
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
                  {/* <p>Second Song</p> */}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="load-more-btn text-center"
                onClick={() => {
                  if (page > 0) {
                    setPage(page - 1);
                  }
                }}
              >
                <a className="btn oneMusic-btn" >
                  Sau
                </a>
              </div>
              <div className="load-more-btn text-center">
                <a
                  
                  className="btn oneMusic-btn"
                  style={{ padding: 0, minWidth: "100px", width: "100px" }}
                >
                  {page + 1} / {totalPage}
                </a>
              </div>

              <div
                className="load-more-btn text-center"
                onClick={() => {
                  if (page + 1 < totalPage) {
                    setPage(page + 1);
                  }
                }}
              >
                <a className="btn oneMusic-btn" >Trước</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
