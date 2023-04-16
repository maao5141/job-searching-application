import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckPicker, InputPicker } from "rsuite";
import { uniqBy } from "lodash";
import axios from "axios";
import SearchContentHint from "../../components/search-content-hint";
import "./index.scss";
import "rsuite/dist/rsuite.min.css";
import { Button } from "rsuite";
let flags = [];
let firstSearchResult = [];
export default function Search(props) {
  const [searchText, setSearchText] = useState("");
  const [jobListed, setJobListed] = useState([]);
  const [language, setLanguage] = useState([]);
  const [us, setUS] = useState([]);
  const [company, setCompanyName] = useState([]);
  const [companyLocation, setCompanyLocation] = useState([]);
  const [lang] = useState([
    "Java",
    "C++",
    "JavaScript",
    "Python",
    "PHP",
    "TypeScript",
  ]);
  const [citizen] = useState(["Yes", "No"]);
  const [list, setList] = useState([]);
  const [frozenList, setFrozenList] = useState([]);
  const [searchFlag, setSearchFlag] = useState(true);
  const [info, setInfo] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");
  const inputRef = React.createRef();
  const toDetail = (url) => {
    window.location.href = url;
  };
  const CustomDropdown = ({ ...props }) => (
    <CheckPicker
      data={uniqBy(frozenList || [], "company_name")?.map((item) => ({
        label: item.company_name,
        value: item.company_name,
      }))}
      value={company}
      appearance="default"
      placeholder="Company name"
      style={{ width: 150 }}
      onChange={(value) => search(value, 1)}
    />
  );
  const LocationDropdown = ({ ...props }) => (
    <CheckPicker
      data={uniqBy(frozenList || [], "company_location")?.map((item) => ({
        label: item.company_location,
        value: item.company_location,
      }))}
      value={companyLocation}
      appearance="default"
      placeholder="Company location"
      style={{ width: 150 }}
      onChange={(value) => search(value, 2)}
    />
  );

  const DateDropdown = ({ ...props }) => (
    <InputPicker
      data={uniqBy(frozenList || [], "job_listed")?.map((item) => ({
        label: item.job_listed,
        value: item.job_listed,
      }))}
      value={jobListed}
      appearance="default"
      placeholder="Job listed"
      style={{ width: 120 }}
      onChange={(value) => search(value, 3)}
    />
  );
  const LanguageDropdown = ({ ...props }) => (
    <CheckPicker
      data={lang.map((item) => ({
        label: item,
        value: item,
      }))}
      value={language}
      appearance="default"
      placeholder="Language"
      style={{ width: 120 }}
      onChange={(value) => search(value, 4)}
    />
  );
  const USDropdown = ({ ...props }) => (
    <InputPicker
      data={citizen.map((item) => ({
        label: item,
        value: item,
      }))}
      value={us}
      appearance="default"
      placeholder="US Citizen or Permanent Resident Only"
      style={{ width: 300 }}
      onChange={(value) => search(value, 5)}
    />
  );
  useEffect(() => {
    setSearchText(q);
    const text = q.toUpperCase();
    axios.get("/jobs-detail.json").then((res) => {
      res.data[0].img = "/images/f.jpg";
      res.data[1].img = "/images/f.jpg";
      res.data[2].img = "/images/g.jpg";
      res.data[3].img = "/images/d.jpg";
      res.data[4].img = "/images/e.jpg";
      res.data[5].img = "/images/f.jpg";
      res.data[6].img = "/images/c.jpg";
      res.data[7].img = "/images/f.jpg";
      res.data[8].img = "/images/b.jpg";
      for (let i = 9; i < res.data.length; i++) {
        res.data[i].img = "/images/a.png";
      }
      setFrozenList(res.data);
      let searchResult = res.data.filter(
        (item) =>
          item.company_name.toUpperCase().indexOf(text) > -1 ||
          item.job_title.toUpperCase().indexOf(text) > -1 ||
          item.job_detail.toUpperCase().indexOf(text) > -1 ||
          item.company_location.toUpperCase().indexOf(text) > -1 ||
          item.job_listed.toUpperCase().indexOf(text) > -1
      );
      firstSearchResult = searchResult;
      setList(searchResult);
      setInfo(searchResult?.[0] || {});
      setTimeout(() => {
        setSearchFlag(false);
      }, 0);
    });
  }, []);

  const search = (text, flag) => {
    if (flag === 1) {
      setCompanyName(text);
    }
    if (flag === 2) {
      setCompanyLocation(text);
    }
    if (flag === 3) {
      setJobListed(text);
    }
    if (flag === 4) {
      setLanguage(text);
    }
    if (flag === 5) {
      setUS(text);
    }
    if (flag === 5 || flag === undefined || flag === 3) {
      if (text) {
        text = text.toUpperCase();
      }
    } else {
      text = text.map((item) => item.toUpperCase());
    }
    if (text?.length && [1, 2, 4].includes(flag)) {
      if (flags.findIndex((item) => item.flag === flag) > -1) {
        flags[flags.findIndex((item) => item.flag === flag)] = { flag, text };
      } else {
        flags.push({ flag, text });
      }
    } else {
      flags = flags.filter((item) => item.flag !== flag);
    }

    if ([3, 5].includes(flag)) {
      if (text === null) {
        flags = flags.filter((item) => item.flag !== flag);
      } else {
        flags.push({ flag, text });
      }
    }

    if (![1, 2, 3, 4, 5].includes(flag)) {
      if (text === "") {
        flags = flags.filter((item) => item.flag !== flag);
      } else {
        flags.push({ flag, text });
      }
    }

    if (text === "") {
      setJobListed(null);
      setCompanyName([]);
      setCompanyLocation([]);
      setUS(null);
      setLanguage([]);
      axios.get("/jobs-detail.json").then((res) => {
        res.data[0].img = "/images/f.jpg";
        res.data[1].img = "/images/f.jpg";
        res.data[2].img = "/images/g.jpg";
        res.data[3].img = "/images/d.jpg";
        res.data[4].img = "/images/e.jpg";
        res.data[5].img = "/images/f.jpg";
        res.data[6].img = "/images/c.jpg";
        res.data[7].img = "/images/f.jpg";
        res.data[8].img = "/images/b.jpg";
        for (let i = 9; i < res.data.length; i++) {
          res.data[i].img = "/images/a.png";
        }
        setList(res.data);
        setInfo(res.data[0]);
      });
    } else {
      axios.get("/jobs-detail.json").then((res) => {
        res.data[0].img = "/images/f.jpg";
        res.data[1].img = "/images/f.jpg";
        res.data[2].img = "/images/g.jpg";
        res.data[3].img = "/images/d.jpg";
        res.data[4].img = "/images/e.jpg";
        res.data[5].img = "/images/f.jpg";
        res.data[6].img = "/images/c.jpg";
        res.data[7].img = "/images/f.jpg";
        res.data[8].img = "/images/b.jpg";
        for (let i = 9; i < res.data.length; i++) {
          res.data[i].img = "/images/a.png";
        }
        let searchResult = firstSearchResult;
        flags.forEach((item3) => {
          if (item3.flag === 1) {
            searchResult = searchResult.filter((item) => {
              return item3.text.some((item2) => {
                return item.company_name.toUpperCase().indexOf(item2) > -1;
              });
            });
          } else if (item3.flag === 2) {
            searchResult = searchResult.filter((item) => {
              return item3.text.some((item2) => {
                return item.company_location.toUpperCase().indexOf(item2) > -1;
              });
            });
          } else if (item3.flag === 3) {
            if (item3.text) {
              searchResult = searchResult.filter((item) => {
                return item.job_listed.toUpperCase().indexOf(item3.text) > -1;
              });
            }
          } else if (item3.flag === 4) {
            searchResult = searchResult.filter((item) => {
              return item3.text.some((item2) => {
                return item.job_detail.toUpperCase().indexOf(item2) > -1;
              });
            });
          } else if (item3.flag === 5) {
            if (item3.text) {
              searchResult = searchResult.filter((item) => {
                if (item3.text == "YES") {
                  return item.job_detail.toUpperCase().indexOf("CITIZEN") > -1;
                } else {
                  return item.job_detail.toUpperCase().indexOf("CITIZEN") == -1;
                }
              });
            }
          } else {
            searchResult = searchResult.filter(
              (item) =>
                item.company_name.toUpperCase().indexOf(item3.text) > -1 ||
                item.job_title.toUpperCase().indexOf(item3.text) > -1 ||
                item.job_detail.toUpperCase().indexOf(item3.text) > -1 ||
                item.company_location.toUpperCase().indexOf(item3.text) > -1 ||
                item.job_listed.toUpperCase().indexOf(item3.text) > -1
            );
          }
        });
        setList(searchResult);
        setInfo(searchResult?.[0] || {});
      });
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    search(value);
  };

  const handleClearClick = () => {
    setSearchText("");
    search("");
    inputRef.current.focus();
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      search(searchText);
    }
  };

  return (
    <div>
      <div className="navbar navbar-default navbar-fixed-top">
        <div className="search-container">
          <div className="search-detail">
            <input
              className="search-detail-input"
              type="text"
              value={searchText}
              onChange={handleInputChange}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              placeholder="Please enter content"
            />
            <SearchContentHint
              search={searchFlag}
              value={searchText}
              func={(item) => {
                setSearchText(item);
                search(item);
              }}
            />
            {searchText?.length > 0 && (
              <button
                className="clear-button"
                onClick={handleClearClick}
                aria-label="clear content"
              >
                x
              </button>
            )}
            <img src="/images/searchLogo.png" className="searchLogo" />
          </div>
        </div>
      </div>
      <div className="selectInfo">
        <div className="selectinfo-dropdown" style={{ display: "flex" }}>
          <div style={{ marginRight: "15px" }}>
            <CustomDropdown />
          </div>
          <div style={{ marginRight: "15px" }}>
            <LocationDropdown />
          </div>
          <div style={{ marginRight: "15px" }}>
            <DateDropdown />
          </div>
          <div style={{ marginRight: "15px" }}>
            <LanguageDropdown />
          </div>
          <div style={{ marginRight: "15px" }}>
            <USDropdown />
          </div>
        </div>
      </div>
      <div className="scaffold-layout">
        <div className="scaffold-layout-left">
          {list.map((item, index) => (
            <div
              className="scaffold-layout-left-content"
              onClick={() => setInfo(item)}
              key={index}
            >
              <div className="scaffold-layout-info">
                <img className="job_detail_url" src={item.img} alt="" />
                <div style={{ width: "100%" }}>
                  <div className="scaffold-layout-left-content-list">
                    {item.job_title}
                  </div>
                  <div className="scaffold-layout-left-content-post">
                    {item.company_name}
                  </div>
                  <div className="address">
                    {item.job_listed} {item.company_location}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!list?.length && (
            <div style={{ marginTop: "225px", textAlign: "center" }}>
              There is no job!
            </div>
          )}
        </div>
        <div className="scaffold-layout-right">
          <div className="scaffold-layout-right-content">
            <div>
              <img
                className="scaffold-layout-img"
                src={info?.img || "/images/default.png"}
                alt=""
              />
            </div>
            <div
              style={{ marginBottom: "25px" }}
              className="scaffold-layout-right-content-title"
            >
              {info?.job_title || ""}
            </div>
            <div style={{ marginBottom: "10px", fontSize: "16px" }}>
              {info?.company_name} - {info?.company_location}
            </div>
            <div style={{ marginBottom: "25px" }}>{info?.job_listed}</div>
            <div>
              <Button
                appearance="primary"
                onClick={() => toDetail(info?.job_detail_url)}
              >
                Apply
              </Button>
            </div>
            <div
              className="scaffold-layout-right-content-detail"
              dangerouslySetInnerHTML={{ __html: info?.job_detail || "" }}
            />
          </div>
          {!list?.length && (
            <div style={{ marginTop: "200px", textAlign: "center" }}>
              There is no detail!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
