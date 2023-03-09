import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSinger } from "../../../../services/singer";

const PAGE_LIMIT = 20;

export default function SingerList({ searchText }) {
  const [singerList, setSingerList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const getSingerList = async () => {
    try {
      const result = await getAllSinger(
        PAGE_LIMIT,
        page,
        undefined,
        searchText
      );
      if (result?.data?.success) {
        setSingerList(result?.data?.payload?.singer);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("search album error >>> ", error);
    }
  };

  useEffect(() => {
    getSingerList();
  }, [page]);

  return (
    <div className="country-singer">
      <div className="title">Nghệ sĩ</div>
      <div className="singer-list">
        {singerList?.length ? (
          singerList?.map((item, index) => {
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
          })
        ) : (
          <div
            style={{fontSize: "16px", fontWeight: 600 }}
          >
            Không có ca sĩ phù hợp với kết quả tìm kiếm
          </div>
        )}

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
  );
}
