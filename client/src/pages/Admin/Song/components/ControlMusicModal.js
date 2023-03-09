import LoadingButton from "@mui/lab/LoadingButton";
import {
  Checkbox,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomModal from "../../../../components/CustomModal";
import RTextField from "../../../../components/RedditTextField";
import { getAllAlbum } from "../../../../services/album";
import { getAllCategory } from "../../../../services/category";
import { getAllCountry } from "../../../../services/country";
import { getAllSinger } from "../../../../services/singer";
import { parseJSON } from "../../../../utils/utils";
import { MenuProps, useStyles } from "../utils";

export default function ControlMusicModal({
  visible,
  onClose,
  type,
  handleCreateUpdateSong,
  editSong,
}) {
  const classes = useStyles();
  const [songData, setSongData] = useState({
    name: "",
    link: "",
    description: "",
    category_id: -1,
    album_id: -1,
    country_id: -1,
    avatar: "",
    singer: [],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [singerList, setSingerList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const getListCategoty = async () => {
    try {
      const res = await getAllCategory();
      if (res?.data?.success) {
        setCategoryList(res?.data?.payload?.category);
      }
    } catch (error) {
      console.log("get category error >>> ", error);
    }
  };

  const getListAlbum = async () => {
    try {
      const res = await getAllAlbum();
      if (res?.data?.success) {
        setAlbumList(res?.data?.payload?.album);
      }
    } catch (error) {
      console.log("get album error >>> ", error);
    }
  };

  const getListSinger = async () => {
    try {
      const res = await getAllSinger();
      if (res?.data?.success) {
        setSingerList(res?.data?.payload?.singer);
      }
    } catch (error) {
      console.log("get singer error >>> ", error);
    }
  };

  const getListCountry = async () => {
    try {
      const res = await getAllCountry();
      if (res?.data?.success) {
        setCountryList(res?.data?.payload);
      }
    } catch (error) {
      console.log("get country error >>> ", error);
    }
  };

  useEffect(() => {
    getListCategoty();
    getListAlbum();
    getListSinger();
    getListCountry();
  }, []);

  useEffect(() => {
    if (type === "update") {
      setSongData({
        name: editSong?.name,
        link: editSong?.link,
        description: editSong?.description,
        category_id: editSong?.category_id,
        album_id: editSong?.album_id || -1,
        country_id: editSong?.country_id,
        avatar: editSong?.avatar,
        singer: editSong?.singer,
      });
    }
  }, [editSong]);

  return (
    <CustomModal
      visible={visible}
      onClose={() => onClose()}
      title={type === "add" ? "Thêm mới bài hát" : "Cập nhật bài hát"}
      content={
        <>
          <RTextField
            label="Name"
            value={songData.name || ""}
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setSongData({
                ...songData,
                name: event.target.value,
              })
            }
          />

          <Typography
            variant="p"
            component="p"
            sx={{
              fontSize: "17px",
              color: "black",
              marginTop: "10px",
            }}
          >
            Country:
          </Typography>

          <Select
            placeholder="Enter Country"
            value={songData?.country_id || -1}
            sx={{ width: "100%" }}
            label="Country"
            onChange={(event) => {
              setSongData({
                ...songData,
                country_id: event.target.value,
              });
            }}
          >
            {countryList?.map((item, index) => {
              return (
                <MenuItem value={item?._id} key={`country-item-${index}`}>
                  {item?.name}
                </MenuItem>
              );
            })}
          </Select>

          <Typography
            variant="p"
            component="p"
            sx={{
              fontSize: "17px",
              color: "black",
              marginTop: "10px",
            }}
          >
            Category:
          </Typography>

          <Select
            placeholder="Enter Category"
            value={songData?.category_id || -1}
            sx={{ width: "100%" }}
            label="Category"
            onChange={(event) => {
              setSongData({
                ...songData,
                category_id: event.target.value,
              });
            }}
          >
            {categoryList?.map((item, index) => {
              return (
                <MenuItem value={item?._id} key={`category-item-${index}`}>
                  {item?.name}
                </MenuItem>
              );
            })}
          </Select>

          <Typography
            variant="p"
            component="p"
            sx={{
              fontSize: "17px",
              color: "black",
              marginTop: "10px",
            }}
          >
            Album:
          </Typography>
          <Select
            placeholder="Enter Category"
            sx={{ width: "100%" }}
            label="Category"
            value={songData?.album_id || -1}
            onChange={(event) => {
              setSongData({
                ...songData,
                album_id: event.target.value,
              });
            }}
          >
            {albumList?.map((item, index) => {
              return (
                <MenuItem value={item?._id} key={`album-item-${index}`}>
                  {item?.name}
                </MenuItem>
              );
            })}
          </Select>

          <Typography
            variant="p"
            component="p"
            sx={{
              fontSize: "17px",
              color: "black",
              marginTop: "10px",
            }}
          >
            Singer:
          </Typography>
          <Select
            labelId="mutiple-select-label"
            multiple
            sx={{ width: "100%" }}
            value={songData?.singer}
            onChange={(event) => {
              const value = event.target.value;
              if (value[value.length - 1] === "all") {
                setSongData({
                  ...songData,
                  singer:
                    songData?.singer.length === singerList.length
                      ? []
                      : singerList?.map((item) => {
                          return {
                            _id: item?._id,
                            name: item?.name,
                          };
                        }),
                });
                return;
              }
              const songSinger = [...songData?.singer];
              const valueParse = parseJSON(
                value[value.length - 1],
                value[value.length - 1]
              );
              const findSinger = songSinger?.find(
                (item) => item?._id === valueParse?._id
              );

              if (!findSinger) {
                setSongData({
                  ...songData,
                  singer: value?.map((item) => parseJSON(item, item)),
                });
              } else {
                setSongData({
                  ...songData,
                  singer: songSinger?.filter(
                    (item) => item?._id !== valueParse?._id
                  ),
                });
              }
            }}
            renderValue={(selected) =>
              selected?.map((item) => item?.name).join(", ")
            }
            MenuProps={MenuProps}
          >
            <MenuItem
              value="all"
              classes={{
                root:
                  songData?.singer?.length > 0 &&
                  songData?.singer?.length === singerList?.length
                    ? classes.selectedAll
                    : "",
              }}
            >
              <ListItemIcon>
                <Checkbox
                  classes={{ indeterminate: classes.indeterminateColor }}
                  checked={
                    songData?.singer?.length > 0 &&
                    songData?.singer?.length === singerList?.length
                  }
                  indeterminate={
                    songData?.singer.length > 0 &&
                    songData?.singer.length < singerList.length
                  }
                />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.selectAllText }}
                primary="Select All"
              />
            </MenuItem>
            {singerList.map((option, index) => (
              <MenuItem
                key={`singer-item-${index}`}
                value={JSON.stringify({ _id: option?._id, name: option?.name })}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={
                      songData?.singer?.findIndex(
                        (item) => item?._id === option?._id
                      ) >= 0
                        ? true
                        : false
                    }
                  />
                </ListItemIcon>
                <ListItemText primary={option?.name} />
              </MenuItem>
            ))}
          </Select>

          <Typography
            variant="p"
            component="p"
            sx={{
              fontSize: "17px",
              color: "black",
              marginBottom: "-10px",
              marginTop: "10px",
            }}
          >
            Avatar:
          </Typography>
          <RTextField
            defaultValue=""
            id="post-title"
            variant="filled"
            style={{ marginTop: 11 }}
            type="file"
            accept="image/*"
            onChange={(event) => {
              setSongData({
                ...songData,
                avatar: event.target.files[0],
              });
            }}
          />

          <Typography
            variant="p"
            component="p"
            sx={{
              fontSize: "17px",
              color: "black",
              marginBottom: "-10px",
              marginTop: "10px",
            }}
          >
            Link:
          </Typography>
          <RTextField
            defaultValue=""
            id="post-title"
            variant="filled"
            style={{ marginTop: 11 }}
            type="file"
            accept=".mp3"
            onChange={(event) => {
              setSongData({
                ...songData,
                link: event.target.files[0],
              });
            }}
          />

          <TextareaAutosize
            defaultValue={songData.description || ""}
            aria-label="minimum height"
            minRows={10}
            placeholder="Description"
            style={{ width: "100%", marginTop: "20px", padding: "10px" }}
            onChange={(event) =>
              setSongData({
                ...songData,
                description: event.target.value,
              })
            }
          />
        </>
      }
      action={
        <LoadingButton
          autoFocus
          onClick={async () => {
            setSubmitLoading(true);
            await handleCreateUpdateSong(songData);
            setSubmitLoading(false);
          }}
          loading={submitLoading}
        >
          {type === "add" ? "Thêm mới" : "Cập nhật"}
        </LoadingButton>
      }
    />
  );
}
