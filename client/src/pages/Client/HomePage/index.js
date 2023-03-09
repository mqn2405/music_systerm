import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSong } from "../../../services/song";
import {
  setListSongPlaying,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../slices/songSlice";
import AlbumList from "./components/AlbumList";
import MostSearchList from "./components/MostSearchList";
import NewHit from "./components/NewHit";
import PopularArtist from "./components/PopularArtist";
import PlayIcon from "../../../assets/image/play-music.svg";
import StopIcon from "../../../assets/image/stop-music.svg";
import UserListen from "./components/UserListen";
import { parseJSON } from "../../../utils/utils";
import { USER_KEY } from "../../../utils/constants";
import MostListenList from "./components/MostListenList";
import MostFavouriteList from "./components/MostFavourietList";

const PAGE_LIMIT = 6;

export default function HomePage() {
  const [listHit, setListHit] = useState([]);
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const { listSongPlaying } = useSelector(songData);
  const userData = parseJSON(localStorage.getItem(USER_KEY));

  const getListHit = async () => {
    try {
      const hit = await getAllSong(PAGE_LIMIT, 0);
      if (hit?.data?.success) {
        setListHit(hit?.data?.payload?.song);
      }
    } catch (error) {
      console.log("get list hit error ", error);
    }
  };

  useEffect(() => {
    getListHit();
  }, []);

  return (
    <>
      <section className="hero-area">
        <div className="hero-slides owl-carousel" style={{ display: "block" }}>
          <div className="single-hero-slide d-flex align-items-center justify-content-center">
            <div
              className="slide-img bg-img"
              style={{ backgroundImage: "url(img/bg-img/bg-1.jpg)" }}
            />
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="hero-slides-content text-center">
                    <h2 data-animation="fadeInUp" data-delay="300ms">
                      MUSIC FOR EVERYONE <span>MUSIC FOR EVERYONE</span>
                    </h2>
                    <a
                      data-animation="fadeInUp"
                      data-delay="500ms"
                      href="/new-song"
                      className="btn oneMusic-btn mt-50"
                    >
                      Nghe ngay <i className="fa fa-angle-double-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AlbumList />

      <section
        className="featured-artist-area section-padding-100 bg-img bg-overlay bg-fixed"
        style={{ backgroundImage: "url(img/bg-img/bg-4.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-end">
            <div className="col-12 col-md-5 col-lg-4">
              <div className="featured-artist-thumb">
                <img
                  src={listHit?.[0]?.avatar}
                  alt=""
                  style={{ width: "350px", height: "350px" }}
                />
              </div>
            </div>
            <div className="col-12 col-md-7 col-lg-8">
              <div className="featured-artist-content">
                {/* Section Heading */}
                <div className="section-heading white text-left mb-30">
                  <p>Điều gì mới</p>
                  <h2>Bài hát mới nhất</h2>
                </div>
                <p
                  style={{
                    height: "140px",
                    overflow: "hidden",
                  }}
                >
                  {listHit?.[0]?.description}
                </p>
                <div
                  className="song-play-area"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="song-name">
                    <p style={{ fontSize: "16px", fontWeight: 700 }}>
                      {listHit?.[0]?.name}
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      {listHit?.[0]?.singer?.length
                        ? listHit?.[0]?.singer
                            ?.map((item) => item?.name)
                            ?.join(", ")
                        : ""}
                    </p>
                  </div>
                  <div>
                    {song?._id === listHit?.[0]?._id && song?.playing ? (
                      <img
                        src={StopIcon}
                        alt="play music"
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          dispatch(setSongState(false));
                        }}
                      />
                    ) : (
                      <img
                        src={PlayIcon}
                        alt="play music"
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          if (listSongPlaying?.length) {
                            dispatch(setListSongPlaying([]));
                          }
                          dispatch(
                            setSongPlaying({ ...listHit?.[0], playing: true })
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {userData?._id && (
        <section className="miscellaneous-area section-padding-100-0">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-12">
                <UserListen />
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className={`miscellaneous-area ${
          !userData?._id ? "section-padding-100-0" : ""
        }`}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <MostSearchList />
            </div>
          </div>
        </div>
      </section>

      <section
        className={`miscellaneous-area`}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <MostListenList />
            </div>
          </div>
        </div>
      </section>

      <section
        className={`miscellaneous-area`}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <MostFavouriteList />
            </div>
          </div>
        </div>
      </section>

      <section className="miscellaneous-area ">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <NewHit listHit={listHit} />
            </div>
            <div className="col-12 col-lg-4">
              <PopularArtist />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}