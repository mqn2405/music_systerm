import React from "react";
import Category from "./components/Category";
import CategorySong from "./components/CategorySong";
import Country from "./components/Country";
import Prominent from "./components/Prominent";
import "./style.scss";

export default function CategoryPage() {
  return (
    <div>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      ></section>
      <div style={{ padding: "30px" }}>
        <div>
          <Prominent />
        </div>
        <div style={{marginTop: '30px'}}>
          <Country />
        </div>
        <div style={{marginTop: '30px'}}>
          <Category />
        </div>
        <div style={{marginTop: '30px'}}>
          <CategorySong />
        </div>
      </div>
    </div>
  );
}
