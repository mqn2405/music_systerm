import React from "react";
import PlayIcon from "../../../../assets/image/play-music-black.svg";
import StopIcon from "../../../../assets/image/stop-music-black.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../../slices/songSlice";
import { useNavigate } from "react-router-dom";

export default function NewHit({listHit}) {
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const navigate = useNavigate();
  const { listSongPlaying } = useSelector(songData);
  const { listType } = useSelector(songData);

  return (
    <div className="new-hits-area mb-100" style={{minHeight: '750px'}}>
      <div
        className="section-heading text-left mb-50"
        data-wow-delay="50ms"
      >
        <p>Điều gì mới</p>
        <h2>Danh sách bài hát mới nhất</h2>
      </div>
      {listHit?.map((item, index) => {
        return (
          <div
            className="single-new-item d-flex align-items-center justify-content-between"
            data-wow-delay="100ms"
            key={`album-item-${index}`}
          >
            <div className="first-part d-flex align-items-center">
              <div
                className="thumbnail"
                style={{
                  minWidth: "73px",
                  minHeight: "73px",
                  border: "0.5px solid gray",
                  cursor: 'pointer'
                }}
                onClick={() => {
                  navigate(`/song/${item?._id}`);
                }}
              >
                <img
                  src={item?.avatar}
                  alt=""
                  style={{ width: "73px", height: "73px" }}
                />
              </div>
              <div className="content-">
                <h6
                  onClick={() => {
                    navigate(`/song/${item?._id}`);
                  }}
                  style={{cursor: 'pointer'}}
                >
                  {item?.name}
                </h6>
                <p>
                  {item?.singer?.length
                    ? item?.singer?.map((it) => it?.name).join(", ")
                    : ""}
                </p>
              </div>
            </div>
            <div>
              {song?._id === item?._id && song?.playing ? (
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
                    if (!listSongPlaying?.length || listType?.type !== "new-hit"){
                      dispatch(setListSongPlaying(listHit))                 
                      dispatch(
                        setListType({
                          type: "new-hit",
                          ...listType
                        })
                      );
                    }
                    dispatch(setSongPlaying({ ...item, playing: true }));
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
