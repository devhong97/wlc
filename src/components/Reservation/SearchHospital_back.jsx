import React, { useEffect, useRef, useState } from "react";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { useReservContext } from "../Context/ReservContext";
import HospitalSelect from "../Hospital/HospitalSelect";

const SearchHospital = () => {
  const selectRef = useRef(null);
  const {
    setHospitalName,
    setHospitalIdx,
    product,
    hopeLocation,
    setHospitalOriginKey,
  } = useReservContext();
  const [hospitalList, setHospitalList] = useState([]); // 병원 리스트
  const [selectHospital, setSelectHospital] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const navigation = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // location.state에서 inspection 값 가져오기
    const inspection = location.state?.inspection;
    console.log("Inspection value:", inspection);
  }, [location]);

  console.log("hopeLocation", hopeLocation);

  useEffect(() => {
    fetchHospitalList();
  }, [searchData]);

  const fetchHospitalList = () => {
    let setParams = {};
    let resultApi = "";
    if (product !== "") {
      setParams.p_key = product;
      resultApi = "correct_hospital";
    } else {
      resultApi = "hospital_list";
    }

    if (searchData) {
      setParams.searchData = searchData;
    }

    Axios.get(`http://localhost:3001/api/get/reserv/${resultApi}`, {
      params: setParams,
    })
      .then((res) => {
        if (res.data.success) {
          // 서버로부터 받아온 데이터를 rows로 설정합니다.
          setHospitalList(res.data.data);
          console.log("hospital", res.data.data);
        } else {
          console.error("지점 관리 데이터호출 실패");
          if (
            Object.keys(searchData).length !== 0 &&
            res.data.data.length === 0
          ) {
            alert("검색조건에 맞는 데이터가 없습니다.");
            selectRef.current.clearSearch();
          }
        }
      })
      .catch((err) => {
        console.error("지점 관리 데이터호출 실패:", err);
      });
  };

  const columns = [
    {
      field: "check_btn",
      headerName: "선택",
      type: "actions",
      renderCell: (params) => (
        <div
          className="table_inner_btn reserv"
          onClick={() => selectRowData(params.row)}
        >
          선택하기
        </div>
      ),
    },
    // { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "병원명" },
    { field: "province", headerName: "지역(시/도)" },
    { field: "city", headerName: "지역(구/군)" },
  ];

  const columns2 = [
    {
      field: "check_btn",
      headerName: "선택",
      type: "actions",
      renderCell: (params) => (
        <div
          className="table_inner_btn reserv"
          onClick={() => selectRowData(params.row)}
        >
          선택
        </div>
      ),
    },
    // { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "병원명" },
    { field: "province", headerName: "지역(시/도)" },
  ];

  const rows = hospitalList
    .filter((data) => [4, 5, 6, 7, 8, 9].includes(data.h_key))
    .map((data, index) => ({
      id: index + 1,
      idx: data.idx,
      p_key: data.p_key,
      name: data.name,
      province: data.province,
      city: data.city,
      h_key: data.h_key,
    }));

  const differentRowsMobile1 = hospitalList
    .filter((data) => [4, 5, 6, 7, 8, 9].includes(data.h_key))
    .map((data, index) => ({
      id: index + 1,
      idx: data.idx,
      p_key: data.p_key,
      name: data.name,
      province: data.province,
      h_key: data.h_key,
    }));

  const differentRows = hospitalList
    .filter((data) => [1, 2, 3, 4, 5, 7, 8].includes(data.h_key))
    .map((data, index) => ({
      id: index + 1,
      idx: data.idx,
      p_key: data.p_key,
      name: data.name,
      province: data.province,
      city: data.city,
      h_key: data.h_key,
    }));

  const differentRowsMobile2 = hospitalList
    .filter((data) => [1, 2, 3, 4, 5, 7, 8].includes(data.h_key))
    .map((data, index) => ({
      id: index + 1,
      idx: data.idx,
      p_key: data.p_key,
      name: data.name,
      province: data.province,
      h_key: data.h_key,
    }));

  const emptyFunc = () => {};
  const selectRowData = (data) => {
    console.log(data.name);
    setHospitalName(data.name);
    setHospitalIdx(data.idx);
    console.log(data.h_key);
    setHospitalOriginKey(data.h_key);
    if (product !== "") {
      navigation("/reserv/date");
    } else {
      navigation("/reserv/product");
    }
  };

  const isMobile = window.innerWidth < 600;

  return (
    <div className="reserv_wrap">
      <div className="back_btn_box">
        <div className="back_btn" onClick={() => navigation(-1)}>
          뒤로 이동
        </div>
      </div>
      <div className="reserv_back main">
        <div className="reserv_top_box">
          <div className="reserv_title">병원목록</div>
          <div className="reserv_title sub">
            검진 가능한 병원들을 확인합니다.
          </div>
        </div>
        <div className="main_wrap">
          <div className="main_back">
            <div className="board_list_wrap">
              <div className="list_area reserv">
                <div className="search_box">
                  <HospitalSelect
                    ref={selectRef}
                    setSearchData={setSearchData}
                  ></HospitalSelect>
                </div>
                <div className="table_box">
                  {hopeLocation ? (
                    isMobile ? (
                      // hopeLocation이 true이고 화면 너비가 600보다 작을 때
                      <TableDefault
                        rows={differentRowsMobile1}
                        columns={columns2}
                        viewModalOpen={emptyFunc}
                      />
                    ) : (
                      // hopeLocation이 true이고 화면 너비가 600 이상일 때
                      <TableDefault
                        rows={rows}
                        columns={columns}
                        viewModalOpen={emptyFunc}
                      />
                    )
                  ) : isMobile ? (
                    // hopeLocation이 false이고 화면 너비가 600보다 작을 때
                    <TableDefault
                      rows={differentRowsMobile2}
                      columns={columns2}
                      viewModalOpen={emptyFunc}
                    />
                  ) : (
                    // hopeLocation이 false이고 화면 너비가 600 이상일 때
                    <TableDefault
                      rows={differentRows}
                      columns={columns}
                      viewModalOpen={emptyFunc}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHospital;
