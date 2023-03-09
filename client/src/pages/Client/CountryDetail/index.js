import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllAlbum } from "../../../services/album";
import { getCountryById } from "../../../services/country";
import { getAllSinger } from "../../../services/singer";
import { getAllSong } from "../../../services/song";
import AlbumList from "./components/AlbumList";
import SingerList from "./components/SingerList";
import SongList from "./components/SongList";
import "./style.scss";

const PAGE_LIMIT = 20;

export default function CountryDetail() {
  const [countryDetail, setCountryDetail] = useState({});
  const [singerList, setSingerList] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [songList, setSongList] = useState([]);
  const { id } = useParams();

  const getCountryDetail = async () => {
    try {
      const result = await getCountryById(id);
      if (result?.data?.success) {
        setCountryDetail(result?.data?.payload);
      }
    } catch (error) {
      console.log("country detail error >>> ", error);
    }
  };

  const getCountrySinger = async () => {
    try {
      const result = await getAllSinger(PAGE_LIMIT, 0, id);
      if (result?.data?.success) {
        setSingerList(result?.data?.payload?.singer);
      }
    } catch (error) {
      console.log("country singer error >>> ", error);
    }
  };

  const getCountryAlbum = async () => {
    try {
      const result = await getAllAlbum(PAGE_LIMIT, 0, undefined, id);
      if (result?.data?.success) {
        setAlbumList(result?.data?.payload?.album);
      }
    } catch (error) {
      console.log("country album error >>> ", error);
    }
  };

  const getCountrySong = async () => {
    try {
      const result = await getAllSong(PAGE_LIMIT, 0, undefined, undefined, id);
      if (result?.data?.success) {
        setSongList(result?.data?.payload?.song);
      }
    } catch (error) {
      console.log("country song error >>> ", error);
    }
  };

  useEffect(() => {
    getCountryDetail();
    getCountrySinger();
    getCountryAlbum();
    getCountrySong();
  }, []);

  return (
    <div style={{ marginBottom: "100px" }}>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(/img/bg-img/breadcumb3.jpg)" }}
      ></section>
      <div className="country-name">{countryDetail?.name}</div>
      <div style={{padding: '20px 40px'}}>
        <SongList songList={songList} countryId={id}/>
        <AlbumList albumList={albumList} />
        <SingerList singerList={singerList} />
      </div>
    </div>
  );
}
