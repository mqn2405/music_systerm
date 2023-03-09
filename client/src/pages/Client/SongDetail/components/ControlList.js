import React, { useState } from "react";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import ReportIcon from "@mui/icons-material/Report";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import CustomModal from "../../../../components/CustomModal";
import LoadingButton from "@mui/lab/LoadingButton";
import { parseJSON } from "../../../../utils/utils";
import { USER_KEY } from "../../../../utils/constants";
import { toast } from "react-hot-toast";
import {
  checkPlaylistSong,
  createNewPlaylist,
  createPlaylistSong,
  getAllPlaylist,
} from "../../../../services/playlist";
import AddIcon from "@mui/icons-material/Add";
import RTextField from "../../../../components/RedditTextField";
import { createNewReportSong } from "../../../../services/songReport";
import ShareIcon from "@mui/icons-material/Share";

export default function ControlList({ songId, color }) {
  const [visiblePlaylistModal, setVisiblePlaylistModal] = useState(false);
  const [visibleReportModal, setVisibleReportModal] = useState(false);
  const [visibleCreatePlModal, setVisibleCreatePlModal] = useState(false);
  const [listPlaylist, setListPlayList] = useState([]);
  const [playListAdd, setPlayListAdd] = useState(-1);
  const [playListName, setPlayListName] = useState("");
  const [reportReason, setReportReason] = useState("");

  const userData = parseJSON(localStorage.getItem(USER_KEY), {});

  const getUserPlayList = async () => {
    try {
      const result = await getAllPlaylist(undefined, undefined, userData?._id);
      if (result?.data?.success) {
        setListPlayList(result?.data?.payload?.playlist);
      }
    } catch (error) {
      console.log("get user playlist error >>> ", error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!playListName?.trim()?.length) {
        return toast.error("Tên playlist không được bỏ trống");
      }

      const result = await createNewPlaylist(userData?._id, playListName);
      if (result?.data?.success) {
        toast.success("Thêm mới playlist thành công");
        getUserPlayList();
        setVisibleCreatePlModal(false);
        setVisiblePlaylistModal(true);
        return setPlayListName("");
      }
      toast.error(result?.data?.error || "Thêm mới playlist thất bại");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Thêm mới playlist thất bại");
    }
  };

  const handleCreatePlaylistSong = async () => {
    try {
      if (playListAdd === -1) {
        return toast.error("Bạn chưa lựa chọn playlist thêm vào");
      }
      const check = await checkPlaylistSong(playListAdd, songId);
      if (check?.data?.payload) {
        return toast?.error("Bài hát đã tồn tại trong playlist");
      }
      const result = await createPlaylistSong(playListAdd, songId);
      if (result?.data?.success) {
        toast.success("Thêm bài nhạc vào playlist thành công");
        setVisiblePlaylistModal(false);
        return setPlayListAdd(-1);
      }
      return toast.error("Thêm bài nhạc vào playlist thất bại");
    } catch (error) {
      toast.error("Thêm bài nhạc vào playlist thất bại");
      console.log("create playlist error >>> ", error);
    }
  };

  const handleCreateSongReport = async () => {
    try {
      if (!reportReason?.trim()?.length) {
        return toast.error("Lí do báo cáo không thể bỏ trống");
      }

      const result = await createNewReportSong(
        userData?._id,
        songId,
        reportReason
      );
      if (result?.data?.success) {
        toast.success(
          "Báo cáo bài hát thành công, đang đợi quản trị viên duyệt"
        );
        setVisibleReportModal(false);
        return setReportReason("");
      }
      toast.error("Báo cáo bài hát thất bại");
    } catch (error) {
      toast.error("Báo cáo bài hát thất bại");
    }
  };

  return (
    <div className="control-list">
      {visiblePlaylistModal && (
        <CustomModal
          visible={visiblePlaylistModal}
          onClose={() => setVisiblePlaylistModal(false)}
          title={"Xác nhận thêm vào playlist"}
          content={
            <div style={{ minWidth: "900px" }}>
              <div style={{ fontSize: "20px" }}>
                Lựa chọn Playlist để thêm vào{" "}
              </div>
              <div>
                {listPlaylist?.length ? (
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                      onChange={(event) => {
                        setPlayListAdd(event.target.value);
                      }}
                    >
                      {listPlaylist?.map((item, index) => {
                        return (
                          <FormControlLabel
                            key={`playlist-item-${index}`}
                            value={item?._id}
                            control={<Radio />}
                            label={item?.name}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      marginTop: "20px",
                    }}
                  >
                    Không có playlist sẵn có
                  </div>
                )}
              </div>
              <div>
                <Button
                  variant="text"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setVisiblePlaylistModal(false);
                    setVisibleCreatePlModal(true);
                  }}
                >
                  Thêm mới playlist
                </Button>
              </div>
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreatePlaylistSong();
              }}
            >
              {"Thêm mới"}
            </LoadingButton>
          }
        />
      )}

      {visibleCreatePlModal && (
        <CustomModal
          visible={visibleCreatePlModal}
          onClose={() => {
            setVisiblePlaylistModal(true);
            setVisibleCreatePlModal(false);
          }}
          title={"Tạo mới Playlist"}
          content={
            <div>
              <RTextField
                label="Name"
                value={playListName || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) => setPlayListName(event?.target?.value)}
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreatePlaylist();
              }}
            >
              {"Thêm mới"}
            </LoadingButton>
          }
        />
      )}

      {visibleReportModal && (
        <CustomModal
          visible={visibleReportModal}
          onClose={() => {
            setReportReason("");
            setVisibleReportModal(false);
          }}
          title={"Báo cáo bài hát"}
          content={
            <div>
              <RTextField
                label="Lí do"
                value={reportReason || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) => setReportReason(event?.target?.value)}
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreateSongReport();
              }}
            >
              {"Báo cáo"}
            </LoadingButton>
          }
        />
      )}

      <div className="control-item">
        <Tooltip title="Thêm vào playlist" placement="top">
          <PlaylistAddCircleIcon
            onClick={() => {
              if (!userData?._id) {
                return toast.error(
                  "Cần đăng nhập để thực hiện chức năng này ???"
                );
              }
              getUserPlayList();
              setVisiblePlaylistModal(true);
            }}
            sx={{ color: color || "" }}
          />
        </Tooltip>
      </div>
      <div className="control-item">
        <Tooltip title="Báo cáo bài nhạc" placement="top">
          <ReportIcon
            onClick={() => {
              if (!userData?._id) {
                return toast.error(
                  "Cần đăng nhập để thực hiện chức năng này ???"
                );
              }
              setVisibleReportModal(true);
            }}
            sx={{ color: color || "" }}
          />
        </Tooltip>
      </div>
      <div className="control-item">
        <Tooltip title="Chia sẻ" placement="top">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=192.168.20.100:3000/song/${songId}`}
            target="_blank"
          >
            <ShareIcon size={"20px"} sx={{ color: color || "" }} />
          </a>
        </Tooltip>
      </div>
    </div>
  );
}
