import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AlbumList from "./components/AlbumList";
import SingerList from "./components/SingerList";
import SongList from "./components/SongList";

export default function SearchPage() {
  const search = useLocation().search;
  const searchText = new URLSearchParams(search).get("search");

  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <h2 style={{ fontSize: "20px", letterSpacing: "1px" }}>
            Kết quả tìm kiếm với từ khoá " {searchText} "
          </h2>
        </div>
      </section>
      <div style={{padding: '20px 40px'}}>
        <AlbumList searchText={searchText}/>
      </div>
      <div style={{padding: '20px 40px'}}>
        <SingerList searchText={searchText}/>
      </div>
      <div style={{padding: '20px 40px'}}>
        <SongList searchText={searchText}/>
      </div>
    </div>
  );
}
