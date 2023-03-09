import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import AdminAccount from "../pages/Admin/AdminAccount";
import AdminAlbum from "../pages/Admin/Album";
import AdminCategory from "../pages/Admin/Category";
import Dashboard from "../pages/Admin/Dashboard";
import AdminLogin from "../pages/Admin/Login";
import AdminSinger from "../pages/Admin/Singer";
import UserAccount from "../pages/Admin/UserAccount";
import HomePage from "../pages/Client/HomePage";
import Login from "../pages/Client/Login";
import Register from "../pages/Client/Register";
import AdminSong from "../pages/Admin/Song";
import AdminCountry from "../pages/Admin/Country";
import AlbumPage from "../pages/Client/Album";
import CategoryPage from "../pages/Client/Category";
import NewSong from "../pages/Client/NewSong";
import AlbumDetail from "../pages/Client/AlbumDetail";
import CategoryDetail from "../pages/Client/CategoryDetail";
import CountryDetail from "../pages/Client/CountryDetail";
import SingerDetail from "../pages/Client/SingerDetail";
import SongDetail from "../pages/Client/SongDetail";
import AdminPrivateRouter from "./PrivateRouter/AdminPrivateRouter";
import SearchPage from "../pages/Client/SearchPage";
import PersonalInfo from "../pages/Client/PersonaInfo";
import SongReport from "../pages/Admin/SongReport";
import Member from "../pages/Client/Member";
import MemberDetail from "../pages/Client/MemberDetail";
import UserReport from "../pages/Admin/UserReport";
import HotSong from "../pages/Client/HotSong";
import ForgotPassword from "../pages/Client/ForgotPassword";
import Chucnang from "../pages/Client/Chucnang";


const ClientLayoutPage = [
  {
    path: "/",
    page: <HomePage />,
  },
  {
    path:"/chucnang",
    page: <Chucnang />,
  },
  {
    path: "/album",
    page: <AlbumPage />,
  },
  {
    path: "/album/:id",
    page: <AlbumDetail />,
  },
  {
    path: "/category",
    page: <CategoryPage />,
  },
  {
    path: "/category/:id",
    page: <CategoryDetail />,
  },
  {
    path: "/singer/:id",
    page: <SingerDetail />,
  },
  {
    path: "/country/:id",
    page: <CountryDetail />,
  },
  {
    path: "/song/:id",
    page: <SongDetail />,
  },
  {
    path: "/personal-info",
    page: <PersonalInfo />,
  },
  {
    path: "/search",
    page: <SearchPage />,
  },
  {
    path: "/login",
    page: <Login />,
  },
  {
    path: "/sign-up",
    page: <Register />,
  },
  {
    path: "/new-song",
    page: <NewSong />,
  },
  {
    path: "/top-100",
    page: <HotSong />,
  },
  {
    path: "/member",
    page: <Member />,
  },
  {
    path: "/member/:id",
    page: <MemberDetail />,
  },
  {
    path: "/forgot-password",
    page: <ForgotPassword />,
  },
];

const AdminLayoutPage = [
  {
    path: "/admin",
    page: <Dashboard />,
  },
  {
    path: "/admin/admin-account",
    page: <AdminAccount />,
  },
  {
    path: "/admin/user-account",
    page: <UserAccount />,
  },
  {
    path: "/admin/category",
    page: <AdminCategory />,
  },
  {
    path: "/admin/country",
    page: <AdminCountry />,
  },
  {
    path: "/admin/album",
    page: <AdminAlbum />,
  },
  {
    path: "/admin/singer",
    page: <AdminSinger />,
  },
  {
    path: "/admin/music",
    page: <AdminSong />,
  },
  {
    path: "/admin/song-report",
    page: <SongReport />,
  },
  {
    path: "/admin/user-report",
    page: <UserReport />,
  },
];

export default function MainRouter() {
  return (
    <Router>
      {ClientLayoutPage?.map((item, index) => {
        return (
          <Routes key={`client-router-${index}`}>
            <Route
              exact
              path={item.path}
              element={<ClientLayout>{item?.page}</ClientLayout>}
            />
          </Routes>
        );
      })}

      {AdminLayoutPage?.map((item, index) => {
        return (
          <Routes key={`admin-router-${index}`}>
            <Route
              exact
              path={item.path}
              element={<AdminPrivateRouter>{item?.page}</AdminPrivateRouter>}
            />
          </Routes>
        );
      })}
      <Routes>
        <Route exact path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}
