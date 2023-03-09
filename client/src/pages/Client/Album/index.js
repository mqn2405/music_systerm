import React, { useEffect, useState } from "react";
import { getAllAlbum } from "../../../services/album";
import AlbumList from "./components/AlbumList";
import FilterList from "./components/FilterList";

const PAGE_LIMIT = 24;

export default function AlbumPage() {
  const [filterKey, setFilterKey] = useState("al");
  const [albumList, setAlbumList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const getAlbumList = async () => {
    try {
      const result = await getAllAlbum(PAGE_LIMIT, page, filterKey);
      if (result?.data?.success) {
        setAlbumList(result?.data?.payload?.album);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("get album error >>> ", error);
    }
  };

  useEffect(() => {
    getAlbumList();
  }, [filterKey, page]);

  useEffect(() => {
    setPage(0)
  }, [filterKey])

  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <h2>Danh sách Album</h2>
        </div>
      </section>

      <section className="album-catagory section-padding-100-0">
        <div className="container">
          <div className="row">
            <FilterList
              setFilterKey={(key) => setFilterKey(key)}
              filterKey={filterKey}
            />
          </div>
          <div style={{ marginBottom: "100px" }}>
            <AlbumList
              albumList={albumList}
              page={page}
              totalPage={totalPage}
              setPage={setPage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
