import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import moment from "moment";
import Axios from "axios";

const Mypage = () => {
  const { decodeS1 } = useAuth();
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    getMyData();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  const getMyData = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/api/get/mydata", {
        params: {
          uid: decodeS1(),
        },
      });
      const allData = response.data.data;
      console.log(allData);
      setMyData(allData[0]);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };



  return (
    <div className="main_wrap">
      <div className="main_back home">
        <div className="main_title_box blank">마이페이지</div>
        <div className="main_sub_title">연락처 및 개인 정보를 수정할 수 있습니다.</div>
        <div className="mypage_area">
          {/* <div className="mypage_container top">
            <div className="mypage_title_box">
              <div className="mypage_title">프로필 사진</div>
              <div className="mypage_title sub">프로필 사진을 등록하여 계정을 맞춤설정합니다.</div>
            </div>
            <div className="profile_box">
              <div className="profile_img_box">
                <div className="profile_img"></div>
              </div>
              <div className="profile_btn_box">
                <div className="profile_btn edit">수정</div>
                <div className="profile_btn">삭제</div>
              </div>
            </div>
          </div> */}
          <div className="mypage_container">
            <div className="mypage_title_box">
              <div className="mypage_title">내 정보</div>
              <div className="mypage_title sub">유저의 개인 정보를 수정할 수 있습니다.</div>
            </div>
            <div className="mypage_contents_box">
              <div className="my_row">
                <div className="my_text title">가입일</div>
                <div className="my_text">{myData.date}</div>
              </div>
              <div className="my_row">
                <div className="my_text title">아이디</div>
                <div className="my_text">{myData.id}</div>
              </div>
              <div className="my_row">
                <div className="my_text title">비밀번호</div>
                <div className="my_text">****</div>
                <div className="my_btn">수정하기</div>
              </div>
              <div className="my_row">
                <div className="my_text title">이메일</div>
                <div className="my_text">{myData.email}</div>
                <div className="my_btn">수정하기</div>
              </div>
              <div className="my_row">
                <div className="my_text title">연락처</div>
                <div className="my_text">{myData.phone}</div>
                <div className="my_btn">수정하기</div>
              </div>
              <div className="my_row">
                <div className="my_text title">소속지점</div>
                <div className="my_text">{myData.branch_type} {myData.company_name} {myData.branch}</div>
                <div className="my_btn">수정하기</div>
              </div>
              <div className="my_row">
                <div className="my_text title">은행</div>
                <div className="my_text">{myData.bank}</div>
                <div className="my_btn">수정하기</div>
              </div>
              <div className="my_row">
                <div className="my_text title">계좌번호</div>
                <div className="my_text">{myData.deposit_account}</div>
                <div className="my_btn">수정하기</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
