import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../components/Home/Home";
import Register from "./../components/Register/Register";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default Router;
