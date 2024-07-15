import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import TableDefault from "../Table/TableDefault";
import Axios, { all } from "axios";
import moment from "moment";
import ProductDetailModal from "../modal/ProductDetailModal";
import HomeViewModal from "../modal/HomeViewModal";
import LinkPhoneModal from "../modal/LinkPhoneModal";

const Home = () => {
  const { decodeS0, decodeS1, decodeS2, decodeS3, decodeS4, decodeS5 } =
    useAuth();
  const [homeData, setHomeData] = useState([]); // 병원 리스트
  const [totalData, setTotalData] = useState([]); // 총지점수
  const [managerData, setManagerData] = useState([]); // 총영업자수
  const [contractData, setContractData] = useState([]); // 총예약자수
  const [hopeData, setHopeData] = useState([]); // 상담고객수
  const [customerData, setCustomerData] = useState([]); // 총고객수
  const [totalCost, setTotalCost] = useState(""); //총매출
  const [totalPrice, setTotalPrice] = useState(""); //순이익
  const [viewModal, setViewModal] = useState(false);
  const [detailData, setDetailData] = useState([]);

  const [grade2Data, setGrade2Data] = useState([]); //지점장 페이지데이터
  const [grade2Data2, setGrade2Data2] = useState([]);
  const [grade2Data3, setGrade2Data3] = useState([]);
  const [grade2Data4, setGrade2Data4] = useState([]);
  const [grade2Data5, setGrade2Data5] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const [selectProduct, setSelectProduct] = useState([]);
  const link = `https://www.wlcmanager.com/self/${decodeS1()}`;
  const [modal, setModal] = useState(false);

  const navigation = useNavigate();

  useEffect(() => {
    // Kakao SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("fe9383073f8c19983e8f9ab187b0ba07");
    }
  }, []);

  useEffect(() => {
    getTotalData();
    grade2TotalData();
    fetchData();
    getProductData();
  }, [decodeS1()]);

  //카카오톡 메세지 전송 API (링크전송목적)
  const sendKakaoMessage = () => {
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: `웰라이프케어 ${decodeS1()}님의 링크공유입니다.`,
        description: `웰라이프케어에서 건강검진 예약을 신청해보세요!`,
        imageUrl: "", // 이미지 URL 설정 가능
        link: {
          webUrl: link, // 웹에서의 링크 URL 설정
          mobileWebUrl: link, // 모바일에서의 링크 URL 설정
        },
      },
      buttons: [
        {
          title: "함께 해보기",
          link: {
            webUrl: link, // 웹에서의 버튼 클릭 시 이동할 URL 설정
            mobileWebUrl: link, // 모바일에서의 버튼 클릭 시 이동할 URL 설정
          },
        },
      ],
    });
  };

  const handleCopyLink = () => {
    const textToCopy = `http://localhost:3001/self/${decodeS1()}`;
    if (!navigator.clipboard) {
      // 클립보드 API가 지원되지 않는 경우
      alert("현재 브라우저에서는 이 기능을 지원하지 않습니다.");
      return;
    }
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("링크가 복사되었습니다.");
      })
      .catch((err) => {
        console.error("텍스트 복사 실패:", err);
      });
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

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
      const totalCost = response.data.totalCost;
      const totalPrice = response.data.totalPrice;
      setTotalData(allData);
      setManagerData(managerData);
      setContractData(contractData);
      setHopeData(hopeData);
      setCustomerData(customerData);
      setTotalCost(totalCost);
      setTotalPrice(totalPrice);
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
      setProductData(allData);
    } catch (error) {
      console.log(error);
    }
  };

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
      const contract = gradeData.contract;

      setGrade2Data(branchAccount);
      setGrade2Data2(userAccount);
      setGrade2Data3(hTotal);
      setGrade2Data4(hope);
      setGrade2Data5(contract);

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

  const columnsForMobile = [
    { field: "customerName", headerName: "검진자" },
    { field: "phone", headerName: "연락처" },
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

  const returnTotalCost = (num) => {
    const number = Number(num); // 숫자 이외의 문자 제거 후 숫자로 변환
    if (number > 0) {
      return number.toLocaleString(); // 숫자를 다시 문자열로 변환하여 반환
    } else {
      return 0;
    }
  };

  const viewModalOpen = (data) => {
    setViewModal(!viewModal);
    setDetailData(data);
  };

  const viewModalClose = (status) => {
    setViewModal(false);
    if (status === "reload") {
      window.location.reload();
    } else {
      getTotalData();
      grade2TotalData();
      fetchData();
      getProductData();
    }
  };

  const productDetailOpen = (data) => {
    setProductModal(!productModal);
    setSelectProduct(data);
  };

  let decodeResult;

  switch (decodeS4()) {
    case "슈퍼관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="super_wrap">
              <div>총매출액: {returnTotalCost(totalCost)} 원</div>
              <div>순이익: {returnTotalCost(totalPrice)}원</div>
              <div>총커미션합계: -</div>
              <div>지급예정커미션: -</div>
              <div>고객수: {customerData}명</div>
              <div>상담희망고객수: {hopeData}명</div>
              <div>총지점수: {totalData}개</div>
              <div>총영업자수: {managerData}명</div>
              <div>계약고객수(청약고객수): {contractData}명</div>
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
              {grade2Data.length > 0 &&
              grade2Data2.length > 0 &&
              grade2Data3.length > 0 &&
              grade2Data4.length > 0 &&
              grade2Data5.length > 0 ? (
                <Fragment>
                  <div>지점종류: {grade2Data[0].branch_type}</div>
                  <div>소속영업사원: {grade2Data2[0].customerCount}명</div>
                  <div>회사명: {grade2Data[0].company_name}</div>
                  <div>가입고객현황: {grade2Data3[0].totalCount}명</div>
                  <div>지점명: {grade2Data[0].branch_name}</div>
                  <div>상담희망고객: {grade2Data4[0].hopeCount}명</div>
                  <div>지점장: {grade2Data[0].owner_name}</div>
                  <div>계약고객현황: {grade2Data5[0].contractCount}명</div>
                  <div>지급완료커미션: -</div>
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
                <div className="arrow_logo"></div>
              </div>
            </div>

            <div className="main_title_box2 blank">링크 전송하기</div>
            <div className="main_sub_title msg">
              메신저로 링크를 전달합니다.
            </div>
            <div className="customer_btn_box2">
              <div className="customer_btn1" onClick={() => sendKakaoMessage()}>
                <div className="reserv_logo1"></div>
                <div className="reserv_text1">카카오톡으로 보내기</div>
                <div className="arrow_logo"></div>
              </div>
            </div>
            <div className="customer_btn_box2">
              <div className="customer_btn2" onClick={() => openModal()}>
                <div className="reserv_logo2"></div>
                <div className="reserv_text2">문자로 보내기</div>
                <div className="arrow_logo"></div>
              </div>
            </div>
            <div className="customer_btn_box2">
              <div className="customer_btn3">
                <div className="reserv_logo3"></div>
                <div className="reserv_text3">링크복사</div>
                {/* <div className="link_text">
                  https://www.wlcmanager.com/self/{decodeS1()}
                </div> */}
                <div className="send-btn-wrap" onClick={handleCopyLink}>
                  <div className="send-btn">복사하기</div>
                </div>
              </div>
            </div>
            <Fragment>
              <div className="third-wraps">
                <div className="main_title_box blank">
                  7일 이내 검진예약 고객명단
                </div>
                <div className="main_sub_title">총 {rows.length}건의 예약</div>
              </div>
              <div className="table_box home">
                {rows.length > 0 ? ( // rows 배열에 데이터가 있을 때
                  window.innerWidth < 600 ? (
                    <TableDefault
                      rows={rows}
                      columns={columnsForMobile}
                      viewModalOpen={viewModalOpen}
                    />
                  ) : (
                    <TableDefault
                      rows={rows}
                      columns={columns}
                      viewModalOpen={viewModalOpen}
                    />
                  )
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      border: "1px solid #ccc",
                      padding: "100px",
                      fontSize: "18px",
                      background: "white",
                    }}
                  >
                    데이터가 존재하지 않습니다.
                  </div>
                )}
              </div>
            </Fragment>
          </div>
          {productModal && (
            <ProductDetailModal
              closeModal={productDetailOpen}
              modalData={selectProduct}
            ></ProductDetailModal>
          )}
          {viewModal && (
            <HomeViewModal
              closeModal={viewModalClose}
              detailData={detailData}
            ></HomeViewModal>
          )}
          {modal && (
            <LinkPhoneModal
              closeModal={closeModal}
              link={link}
            ></LinkPhoneModal>
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
