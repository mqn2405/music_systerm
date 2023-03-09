import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingerById } from "../../../services/singer";
import AlbumList from "./components/AlbumList";
import SongList from "./components/SongList";
import "./style.scss";

export default function SingerDetail() {
  const [singerDetail, setSingerDetail] = useState({});
  const { id } = useParams();

  const getSingerDetail = async () => {
    try {
      const result = await getSingerById(id);
      if (result?.data?.success) {
        setSingerDetail(result?.data?.payload);
      }
    } catch (error) {
      console.log("get singer detail >>> ", error);
    }
  };

  useEffect(() => {
    getSingerDetail();
  }, []);

  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(/img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={singerDetail?.avatar}
              alt=""
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "30px",
                border: "0.5px solid gray",
              }}
            />

            <h2 style={{ marginLeft: "20px" }}>{singerDetail?.name}</h2>
          </div>
        </div>
      </section>
      <div style={{ padding: "20px 60px" }} className='singer-detail'>
        <div className="singer-about">Về {singerDetail?.name}</div>
        <div className="singer-detail row">
          <div className="singer-avatar col-12 col-sm-4 col-md-3">
            <img src={singerDetail?.avatar} alt="" />
          </div>
          <div className="singer-desc col-12 col-sm-8 col-md-9">
            {singerDetail?.description}
          </div>
        </div>
        <div>
          <AlbumList singerId={id} />
        </div>
        <div>
          <SongList singerId={id} />
        </div>
      </div>
    </div>
  );
}
