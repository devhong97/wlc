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
import Hospital from "../components/Hospital/HospitalList";
import Reservation from "../components/Reservation/Reservation";
import SearchProduct from "../components/Reservation/SearchProduct";
import SearchHospital from "../components/Reservation/SearchHospital";
import SelectDate from "../components/Reservation/SelectDate";
import ReservCustomer from "../components/Reservation/ReservCustomer";
import ProductList from "../components/Product/ProductList";
import ReservCheck from "../components/Reservation/ReservCheck";
import Delme from "./../components/Delmetenz/Delme";
import Mypage from "./../components/Mypage/Mypage";
import SalesCustomer from "./../components/Sales/SalesCustomer";
import SalesManager from "./../components/Sales/salesManager";
import SalesHospital from "./../components/Sales/SalesHospital";
import Link from "../components/Self/Link";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/branch" element={<BranchList />} />
      <Route path="/member" element={<MemberList />} />
      <Route path="/customer" element={<CustomerList />} />
      <Route path="/sales" element={<SalesList />} />
      <Route path="/salescustomer" element={<SalesCustomer />} />
      <Route path="/salesmanager" element={<SalesManager />} />
      <Route path="/saleshospital" element={<SalesHospital />} />

      <Route path="/hospital" element={<Hospital />} />
      <Route path="/product" element={<ProductList />} />
      <Route path="/commission" element={<CommissionList />} />
      <Route path="/commission/:idx" element={<CommissionDetail />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/mypage" element={<Mypage />} />

      <Route path="/reserv" element={<Reservation />} />
      <Route path="/reserv/product" element={<SearchProduct />} />
      <Route path="/reserv/hospital" element={<SearchHospital />} />
      <Route path="/reserv/date" element={<SelectDate />} />
      <Route path="/reserv/customer" element={<ReservCustomer />} />
      <Route path="/reserv/check" element={<ReservCheck />} />
      <Route path="/delme" element={<Delme />} />
      <Route path="/link" element={<Link />} />
    </Routes>
  );
};

export default Router;
