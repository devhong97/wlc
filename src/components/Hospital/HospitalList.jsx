import React, { useEffect, useRef, useState } from "react";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";
import HospitalWriteModal from "../modal/HospitalWriteModal";
import HospitalViewModal from "../modal/HospitalViewModal";
import HospitalSelect from "./HospitalSelect";

const HospitalList = () => {
  const selectRef = useRef(null);
  const [writeModal, setWriteModal] = useState(false); // 병원등록 모달
  const [viewModal, setViewModal] = useState(false); // 병원상세 수정모달
  const [detailIdx, setDetailIdx] = useState(""); //상세페이지 Idx
  const [hospitalList, setHospitalList] = useState([]); // 병원 리스트
  const [searchData, setSearchData] = useState([]);
  const [numberData, setNumberData] = useState("");
  const [detailData, setDetailData] = useState([]);
  const [hospitalUserCounts, setHospitalUserCounts] = useState([]);

  useEffect(() => {
    fetchHospitalUserCount();
    fetchHospitalList();
  }, [searchData]);

  useEffect(() => {
    updateHospitalUserCounts();
  }, [hospitalUserCounts]);

  const fetchHospitalList = () => {
    const resultParams = {};
    if (searchData) {
      resultParams.searchData = searchData;
    }
    Axios.get("http://49.50.174.248:3001/api/get/hospital_list", {
      params: resultParams,
    })
      .then((res) => {
        if (res.data.success) {
          const updatedHospitalList = res.data.data.map((data, index) => ({
            id: index + 1,
            name: data.name,
            number: data.number,
            province: data.province,
            city: data.city,
            product: data.product,
            date: moment(data.date).format("YYYY.MM.DD"),
            idx: data.idx,
            p_key: data.p_key,
            c_key: data.c_key,
            productArray: data.productArray,
            user_count: getUserCount(data.name), // 해당 병원의 검진회원수 가져오기
          }));
          setNumberData(res.data.total);
          setHospitalList(updatedHospitalList);
        } else {
          console.error("지점 관리 데이터호출 실패");
          if (searchData) {
            selectRef.current.clearSearch();
          }
        }
      })
      .catch((err) => {
        console.error("지점 관리 데이터호출 실패:", err);
      });
  };

  const getUserCount = (hospitalName) => {
    const matchingHospital = hospitalUserCounts.find(
      (hospitalUser) => hospitalUser.hospital_name === hospitalName
    );
    return matchingHospital ? matchingHospital.user_count : 0;
  };

  const updateHospitalUserCounts = () => {
    const updatedUserCounts = hospitalList.map((hospital) => ({
      ...hospital,
      user_count: getUserCount(hospital.name),
    }));
    setHospitalList(updatedUserCounts);
  };

  const fetchHospitalUserCount = () => {
    Axios.get("http://49.50.174.248:3001/api/get/hospital_user_count")
      .then((res) => {
        if (res.data.success) {
          const updatedHospitalUserCounts = res.data.data.map(
            (data, index) => ({
              hospital_name: data.hospital_name,
              user_count: data.user_count,
            })
          );
          console.log("updatedHospitalUserCounts", updatedHospitalUserCounts);
          setHospitalUserCounts(updatedHospitalUserCounts);
        } else {
          console.error("병원 사용자 수 조회 실패");
        }
      })
      .catch((err) => {
        console.error("병원 사용자 수 조회 실패:", err);
      });
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "병원명" },
    { field: "number", headerName: "연락처" },
    { field: "province", headerName: "지역(도)" },
    { field: "city", headerName: "지역(시)" },
    { field: "product", headerName: "검진가능상품" },
    { field: "user_count", headerName: "검진회원수" },
    { field: "date", headerName: "병원등록일" },
  ];

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
  };
  const viewModalOpen = (data) => {
    const idx = data.idx;
    setViewModal(!viewModal);
    setDetailIdx(idx);
    setDetailData(data);
  };
  const viewModalClose = (status) => {
    setViewModal(false);
    if (status === "reload") {
      window.location.reload();
    } else {
      fetchHospitalList();
    }
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">
          병원 관리
          <div className="total_data_box">
            <div className="total_box">총 병원수 : {numberData}</div>
          </div>
        </div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <HospitalSelect
                ref={selectRef}
                setSearchData={setSearchData}
              ></HospitalSelect>
              <div className="title_btn" onClick={() => writeModalOpen()}>
                병원등록
              </div>
            </div>
            <div className="table_box list">
              {hospitalList.length === 0 ? (
                <div>정보가 없습니다.</div>
              ) : (
                <TableDefault
                  rows={hospitalList}
                  columns={columns}
                  viewModalOpen={viewModalOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {writeModal && (
        <HospitalWriteModal closeModal={writeModalOpen}></HospitalWriteModal>
      )}
      {viewModal && (
        <HospitalViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
          detailData={detailData}
          hospitalList={hospitalList}
        ></HospitalViewModal>
      )}
    </div>
  );
};

export default HospitalList;
