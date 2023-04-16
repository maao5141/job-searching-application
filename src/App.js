import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home/index";
import Search from "./routes/Search/index";
import "./styles/index.scss";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;
