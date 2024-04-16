import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import TableDefault from "../Table/TableDefault";
import Axios, { all } from "axios";
import moment from "moment";
import ProductDetailModal from "../modal/ProductDetailModal";

const Home = () => {
  const { decodeS0, decodeS1, decodeS2, decodeS3, decodeS4, decodeS5 } =
    useAuth();
  const [homeData, setHomeData] = useState([]); // 병원 리스트
  const [totalData, setTotalData] = useState([]); // 총지점수
  const [managerData, setManagerData] = useState([]); // 총영업자수
  const [contractData, setContractData] = useState([]); // 총예약자수
  const [hopeData, setHopeData] = useState([]); // 상담고객수
  const [customerData, setCustomerData] = useState([]); // 총고객수

  const [grade2Data, setGrade2Data] = useState([]); //지점장 페이지데이터
  const [grade2Data2, setGrade2Data2] = useState([]);
  const [grade2Data3, setGrade2Data3] = useState([]);
  const [grade2Data4, setGrade2Data4] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const [selectProduct, setSelectProduct] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    getTotalData();
    grade2TotalData();
    fetchData();
    getProductData();
  }, [decodeS1()]);

  // 슈퍼관리자 페이지
  const getTotalData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/home_total"
      );
      const allData = response.data.branchCount;
      const managerData = response.data.userCount;
      const contractData = response.data.contractCount;
      const hopeData = response.data.hopeCount;
      const customerData = response.data.customerCount;
      const resultData = response.data.result_date;
      setTotalData(allData);
      setManagerData(managerData);
      setContractData(contractData);
      setHopeData(hopeData);
      setCustomerData(customerData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getProductData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/product_list"
      );
      const allData = response.data.data;
      setProductData(allData)
    } catch (error) {
      console.log(error);
    }
  }

  //지점장 페이지
  const grade2TotalData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/home_manager",
        {
          params: {
            branchIdx: decodeS0(),
          },
        }
      );
      const gradeData = response.data.data;

      const branchAccount = gradeData.branchAccount;
      const userAccount = gradeData.userAccount;
      const hTotal = gradeData.hTotal;
      const hope = gradeData.hope;

      setGrade2Data(branchAccount);
      setGrade2Data2(userAccount);
      setGrade2Data3(hTotal);
      setGrade2Data4(hope);

      // console.log(gradeData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 영업사원 페이지
  const fetchData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/home_list",
        {
          params: {
            uid: decodeS1(),
          },
        }
      );
      const allData = response.data;
      setHomeData(allData.data);
      console.log(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "예약자" },
    { field: "customerName", headerName: "검진자" },
    { field: "phone", headerName: "연락처" },
    { field: "product", headerName: "상품" },
    { field: "hospital", headerName: "검진병원" },
    { field: "result_date", headerName: "검진일" },
  ];

  const rows = homeData.map((data, index) => ({
    id: index + 1,
    idx: data.idx,
    name: data.contractor_name,
    customerName: data.name,
    phone: data.phone,
    product: data.productName,
    hospital: data.hospitalName,
    result_date: data.result_date,
  }));

  const viewModalOpen = () => { };

  const productDetailOpen = (data) => {
    setProductModal(!productModal);
    setSelectProduct(data)
  }

  let decodeResult;

  switch (decodeS4()) {
    case "슈퍼관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="super_wrap">
              <div>총매출액: </div>
              <div>총커미션합계: </div>
              <div>지급예정커미션: </div>
              <div>고객수: {customerData}</div>
              <div>상담희망고객수: {hopeData}</div>
              <div>총지점수: {totalData}</div>
              <div>총영업자수: {managerData}</div>
              <div>계약고객수(청약고객수): {contractData} </div>
            </div>
          </div>
        </div>
      );
      break;
    case "지점관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="super_wrap">
              {grade2Data.length > 0 && grade2Data2.length > 0 ? (
                <Fragment>
                  <div>지점종류: {grade2Data[0].branch_type}</div>
                  <div>소속영업사원: {grade2Data2[0].customerCount}명</div>
                  <div>회사명: {grade2Data[0].company_name}</div>
                  <div>상담희망고객: {grade2Data4[0].hopeCount}명</div>
                  <div>지점명: {grade2Data[0].branch_name}</div>
                  <div>지급완료커미션:</div>
                  <div>지점장: {grade2Data[0].owner_name}</div>
                  <div>계약고객현황: 작업중</div>
                  <div>가입고객현황: {grade2Data3[0].totalCount}명</div>
                </Fragment>
              ) : (
                <div>데이터가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      );
      break;
    case "영업사원":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back home">
            <div className="main_title_box blank">예약하기</div>
            <div className="main_sub_title">건강검진 예약을 신청합니다.</div>
            <div className="customer_btn_box">
              <div
                className="customer_btn"
                onClick={() => navigation("/reserv", { state: { status: "" } })}
              >
                <div className="reserv_logo"></div>
                <div className="reserv_text">예약 시작하기</div>
              </div>
            </div>
            <div className="main_title_box blank">상품 알아보기</div>
            <div className="main_product_area">
              <div className="main_product_box">
                {productData.map((data, index) => {
                  return (
                    <div className="main_product_row">
                      <div className="product_icon_box">
                        <div className={`product_icon icon${data.p_key}`}></div>
                      </div>
                      <div className="product_text title">{data.product_1}</div>
                      <div className="product_text info">{data.product_1} 등급의 검진 패키지 상품입니다.</div>
                      <div className="product_text og_price">{Number(data.og_price).toLocaleString()}원</div>
                      {data.p_key === "2" ? (
                        <div className="product_text price">
                          {Number(data.price_txt * 2).toLocaleString()}원 (2인)
                        </div>
                      ) : (
                        <div className="product_text price">
                          {Number(data.price_txt).toLocaleString()}원 (1인)
                        </div>
                      )}
                      <div className="product_more_btn" onClick={() => productDetailOpen(data)}>상세보기</div>
                    </div>
                  );
                })}

              </div>
            </div>
            <div className="main_title_box blank">
              7일이내 검진예약 고객명단
            </div>
            <div className="table_box home">
              <TableDefault
                rows={rows}
                columns={columns}
                viewModalOpen={viewModalOpen}
              />
            </div>
          </div>
          {productModal && (
            <ProductDetailModal
              closeModal={productDetailOpen}
              modalData={selectProduct}></ProductDetailModal>
          )}
        </div>
      );
      break;
    default:
      decodeResult = null;
  }
  return <Fragment>{decodeResult}</Fragment>;
};

export default Home;
