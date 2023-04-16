import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchContentHint from "../../components/search-content-hint";
import "./index.scss";

export default function Home(props) {
  const navigate = useNavigate();

  const toSearch = () => {
    if (searchText) {
      navigate("/search?q=" + searchText);
    }
  };

  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleClearClick = () => {
    setSearchText("");
    inputRef.current.focus();
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && searchText) {
      toSearch();
    }
  };

  const inputRef = React.createRef();

  return (
    <div className="main">
      <img src="/images/search.png" className="logo" />
      <div className="home-container">
        <div className="home-box">
          <input
            type="text"
            placeholder="Please enter content"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <SearchContentHint
            width={585}
            value={searchText}
            func={(item) => navigate("/search?q=" + item)}
          />
          {searchText.length > 0 && (
            <button
              className="clear-button"
              onClick={handleClearClick}
              aria-label="clear content"
            >
              x
            </button>
          )}
          <img
            src="/images/searchLogo.png"
            className="searchLogo"
            onClick={toSearch}
          />
        </div>
      </div>
    </div>
  );
}
