import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.scss";

export default function SearchContentHint(props) {
  const { value, func, width, search } = props;
  const [hintResults, setHintResults] = useState([]);
  const getHintArray = (text) => {
    const hash = {};
    text = text.toUpperCase();
    axios.get("/jobs-detail.json").then((res) => {
      let arr = [];
      res.data.forEach((item) => {
        if (item.company_name.toUpperCase().indexOf(text) > -1) {
          arr.push(item.company_name);
        }
        if (item.job_title.toUpperCase().indexOf(text) > -1) {
          arr.push(item.job_title);
        }
      });
      arr.forEach((item) => {
        if (hash[item]) {
          hash[item]++;
        } else {
          hash[item] = 1;
        }
      });
      let result = Object.keys(hash)
        .sort((a, b) => hash[b] - hash[a])
        .slice(0, 5);
      setHintResults(result);
    });
  };
  useEffect(() => {
    if (search) return;
    if (value) {
      getHintArray(value);
    } else {
      setHintResults([]);
    }
  }, [value]);
  return (
    <div>
      {hintResults.length ? (
        <div
          className="search-content-hint"
          style={{ width: width || 1150 + "px" }}
        >
          {hintResults.map((item, index) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                key={item}
                onClick={() => {
                  func?.(item, index);
                  setTimeout(() => {
                    setHintResults([]);
                  }, 200);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
