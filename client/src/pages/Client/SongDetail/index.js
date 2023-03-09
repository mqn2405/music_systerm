import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeUserFavouriteSong,
  getSongById,
  getUserFavouriteSong,
  updateSongView,
} from "../../../services/song";
import "./style.scss";
import PlayIcon from "../../../assets/image/play-music.svg";
import StopIcon from "../../../assets/image/stop-music.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setSongPlaying,
  setSongState,
  songData,
} from "../../../slices/songSlice";
import SongReview from "./components/SongReview";
import ControlList from "./components/ControlList";
import { parseJSON } from "../../../utils/utils";
import { USER_KEY } from "../../../utils/constants";
import DislikeFill from "@mui/icons-material/ThumbDownAlt";
import DislikeOutline from "@mui/icons-material/ThumbDownOffAlt";
import LikeFill from "@mui/icons-material/ThumbUpAlt";
import LikeOutline from "@mui/icons-material/ThumbUpOffAlt";
import { toast } from "react-hot-toast";

export default function SongDetail() {
  const [songDetail, setSongDetail] = useState({});
  const [songFavourite, setSongFavourite] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const userInfo = parseJSON(localStorage.getItem(USER_KEY));
  const navigate = useNavigate();

  const getSongDetail = async () => {
    try {
      const result = await getSongById(id);
      if (result?.data?.success) {
        setSongDetail(result?.data?.payload);
      }
    } catch (error) {
      console.log("get song detail error >>> ", error);
    }
  };

  useEffect(() => {
    getSongDetail();
  }, []);

  useEffect(() => {
    (async () => {
      await updateSongView(id);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo) {
        const favourite = await getUserFavouriteSong(id, userInfo?._id);
        if (favourite?.data?.success)
          setSongFavourite(favourite?.data?.payload);
      }
    })();
  }, []);

  const changeUserFavourite = async (status) => {
    try {
      if (userInfo) {
        const favourite = await changeUserFavouriteSong(
          id,
          userInfo?._id,
          status
        );

        if (favourite?.data?.success) {
          const song = { ...songDetail };
          if (status === 1) {
            song.total_favourite = Number(song.total_favourite) + 1;
            if (songFavourite === 0) {
              song.total_unfavourite = Number(song.total_unfavourite) - 1;
            }
            setSongFavourite(1);
          }

          if (status === 0) {
            song.total_unfavourite = Number(song.total_unfavourite) + 1;
            if (songFavourite === 1) {
              song.total_favourite = Number(song.total_favourite) - 1;
            }
            setSongFavourite(0);
          }

          if (status === -1) {
            if (songFavourite === 1) {
              song.total_favourite = Number(song.total_favourite) - 1;
            }

            if (songFavourite === 0) {
              song.total_unfavourite = Number(song.total_unfavourite) - 1;
            }
            setSongFavourite(-1);
          }
          setSongDetail(song);
          return toast.success("Thả cảm xúc thành công");
        }
        return toast.error("Thả cảm xúc thất bại");
      }
      return toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
    } catch (error) {
      toast.error("Thay đổi trạng thái yêu thích thất bại");
    }
  };

  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(/img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <h2 style={{ marginLeft: "20px" }}>Bài hát: {songDetail?.name}</h2>
        </div>
      </section>

      <div style={{ padding: "20px 60px" }} className="song-detail">
        <div className="song-about">Về bài hát: {songDetail?.name}</div>
        <div className="song-detail row">
          <div className="song-avatar col-12 col-sm-4 col-md-3">
            <img src={songDetail?.avatar} alt="" />
            <div className="song-detail-singer">
              Ca sĩ:{" "}
              {songDetail?.singer?.length
                ? songDetail?.singer?.map((it, id) => (
                    <span
                      style={{ color: "black", cursor: 'pointer', textDecoration: 'underline' }}
                      key={`song-singer-${id}`}
                      onClick={() => navigate(`/singer/${it?._id}`)}
                    >
                      {it?.name} {id < songDetail?.singer?.length - 1 ? ', ' : ''}
                    </span>
                  ))
                : ""}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "50px",
                marginTop: "20px",
                border: "0.5px solid #F2F2F2",
                padding: "10px",
                borderRadius: "10px",
                background: "#F2F2F2",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {songFavourite === 1 ? (
                  <LikeFill
                    sx={{ cursor: "pointer" }}
                    onClick={() => changeUserFavourite(-1)}
                  />
                ) : (
                  <LikeOutline
                    sx={{ cursor: "pointer" }}
                    onClick={() => changeUserFavourite(1)}
                  />
                )}
                <div>{songDetail?.total_favourite}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {songFavourite === 0 ? (
                  <DislikeFill
                    sx={{ cursor: "pointer" }}
                    onClick={() => changeUserFavourite(-1)}
                  />
                ) : (
                  <DislikeOutline
                    sx={{ cursor: "pointer" }}
                    onClick={() => changeUserFavourite(0)}
                  />
                )}
                <div>{songDetail?.total_unfavourite}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-8 col-md-9">
            <div className="song-desc">{songDetail?.description}</div>
            <ControlList songId={id} />
            <div className="song-player-button">
              <button>
                <div>Phát nhạc</div>
                <div style={{ marginLeft: "10px" }}>
                  {song?._id === songDetail?._id && song?.playing ? (
                    <img
                      src={StopIcon}
                      alt="play music"
                      style={{ width: "25px", height: "25px" }}
                      onClick={() => {
                        dispatch(setSongState(false));
                      }}
                    />
                  ) : (
                    <img
                      src={PlayIcon}
                      alt="play music"
                      style={{ width: "25px", height: "25px" }}
                      onClick={() => {
                        dispatch(
                          setSongPlaying({ ...songDetail, playing: true })
                        );
                      }}
                    />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 60px" }} className="song-review">
        <SongReview songId={id} />
      </div>
    </div>
  );
}
