import React from "react";

const filterLetter = [
  { label: "All", key: "al" },
  { label: "A", key: "a" },
  { label: "B", key: "b" },
  { label: "C", key: "c" },
  { label: "D", key: "d" },
  { label: "E", key: "e" },
  { label: "F", key: "f" },
  { label: "G", key: "g" },
  { label: "H", key: "h" },

  { label: "I", key: "i" },
  { label: "J", key: "j" },
  { label: "K", key: "k" },
  { label: "L", key: "l" },
  { label: "M", key: "m" },
  { label: "N", key: "n" },
  { label: "O", key: "o" },
  { label: "P", key: "p" },

  { label: "Q", key: "q" },
  { label: "R", key: "r" },
  { label: "S", key: "s" },
  { label: "T", key: "t" },
  { label: "U", key: "u" },
  { label: "V", key: "v" },
  { label: "W", key: "w" },
  { label: "X", key: "x" },

  { label: "Y", key: "y" },
  { label: "Z", key: "z" },
  { label: "0-9", key: "number" },
];

export default function FilterList({filterKey, setFilterKey}) {
  return (
    <div className="col-12">
      <div className="browse-by-catagories catagory-menu d-flex flex-wrap align-items-center mb-70">
        <a href="#" data-filter="*" style={{ marginTop: "-20px" }}>
          Browse All
        </a>
        {filterLetter?.map((item, index) => {
          return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              href="#"
              className={filterKey === item?.key ? "active" : ""}
              key={`filter-key-${index}`}
              style={{ marginBottom: "20px", cursor: "pointer" }}
              onClick={() => {
                if (filterKey !== item?.key) {
                  setFilterKey(item?.key);
                }
              }}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
