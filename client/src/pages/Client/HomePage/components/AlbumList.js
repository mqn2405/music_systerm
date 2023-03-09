import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAlbum } from "../../../../services/album";

const PAGE_LIMIT = 12;

export default function AlbumList() {
  const [albumList, setAlbumList] = useState([]);
  const navigate = useNavigate();

  const getAlbumList = async () => {
    try {
      const result = await getAllAlbum(PAGE_LIMIT, 0, "al");
      if (result?.data?.success) {
        setAlbumList(result?.data?.payload?.album);
      }
    } catch (error) {
      console.log("get album list error >>> ", error);
    }
  };

  useEffect(() => {
    getAlbumList();
  }, []);

  return (
    <section className="oneMusic-buy-now-area has-fluid bg-gray section-padding-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="section-heading style-2">
              <p>Điều gì mới</p>
              <h2>Album mới nhất</h2>
            </div>
          </div>
        </div>

        <div className="row">
          {albumList?.map((item, index) => {
            return (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-2"
                key={`album-item-${index}`}
              >
                <div
                  className="single-album-area"
                  data-wow-delay="100ms"
                >
                  <div
                    className="album-thumb"
                    style={{
                      minWidth: "192px",
                      minHeight: "192px",
                      border: "0.5px solid gray",
                       cursor: 'pointer'
                    }}
                    onClick={() => {
                      navigate(`/album/${item?._id}`);
                    }}
                  >
                    <img
                      src={item?.avatar}
                      alt=""
                      style={{ width: "192px", height: "192px" }}
                    />
                  </div>
                  <div className="album-info">
                    <a href={`/album/${item?._id}`}>
                      <h5>{item?.name}</h5>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col-12">
            <div
              className="load-more-btn text-center"
              data-wow-delay="300ms"
            >
              <a href="/album" className="btn oneMusic-btn">
                Xem thêm <i className="fa fa-angle-double-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
