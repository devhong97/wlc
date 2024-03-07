import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home/Home";
import BranchList from "../components/Branch/BranchList";
import MemberList from "../components/Member/MemberList";
import CustomerList from "../components/Customer/CustomerList";
import SalesList from "../components/Sales/SalesList";
import CommissionList from "../components/Commission/CommissionList";
import CommissionDetail from "../components/Commission/CommissionDetail";
import Notice from "../components/Board/Notice";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/branch" element={<BranchList />} />
      <Route path="/member" element={<MemberList />} />
      <Route path="/customer" element={<CustomerList />} />
      <Route path="/sales" element={<SalesList />} />
      <Route path="/commission" element={<CommissionList />} />
      <Route path="/commission/:idx" element={<CommissionDetail />} />
      <Route path="/notice" element={<Notice />} />
    </Routes>
  );
};

export default Router;
