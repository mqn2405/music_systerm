import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAlbum } from "../../../../services/album";

const PAGE_LIMIT = 20;
export default function AlbumList({ singerId }) {
  const [albumList, setAlbumList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const getAlbumList = async () => {
    try {
      const result = await getAllAlbum(
        PAGE_LIMIT,
        page,
        undefined,
        undefined,
        singerId
      );
      if (result?.data?.success) {
        setAlbumList(result?.data?.payload?.album);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("country album error >>> ", error);
    }
  };

  useEffect(() => {
    getAlbumList();
  }, [page]);

  return (
    <div className="country-album">
      <div className="title" style={{ marginTop: "30px" }}>
        Album
      </div>
      <div className="album-list">
        <div className="row oneMusic-albums" style={{ marginTop: "20px" }}>
          {albumList?.map((item, index) => {
            return (
              <div
                className="col-12 col-sm-4 col-md-3 col-lg-2 single-album-item"
                key={`album-item-${index}`}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/album/${item?._id}`)}
              >
                <div className="single-album" style={{ width: "160px" }}>
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
          {totalPage > 1 ? (
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
                      <a className="btn oneMusic-btn">Sau</a>
                    </div>
                    <div className="load-more-btn text-center">
                      <a
                        className="btn oneMusic-btn"
                        style={{
                          padding: 0,
                          minWidth: "100px",
                          width: "100px",
                        }}
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
                      <a className="btn oneMusic-btn">Trước</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
