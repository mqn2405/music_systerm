import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountry } from "../../../../services/country";

const COLOR_LIST = ["#D8562B", "#239F97", "#20A26B", "#D19416"];

export default function Country() {
  const [countryList, setCountryList] = useState([]);
  const navigate = useNavigate();

  const getListCountry = async () => {
    try {
      const result = await getAllCountry();
      if (result?.data?.success) {
        setCountryList(result?.data?.payload);
      }
    } catch (error) {
      console.log("get list country error >>> ", error);
    }
  };

  useEffect(() => {
    getListCountry();
  }, []);

  return (
    <div className="country">
      <div className="title category-title">Quốc gia</div>
      <div className="list category-list">
        {countryList?.map((item, index) => {
          return (
            <div
              className="category-list-item list-item item1"
              key={`country-item-${index}`}
              style={{ background: COLOR_LIST[index % 4] }}
              onClick={() => {
                navigate(`/country/${item?._id}`);
              }}
            >
              {item?.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
