import React from "react";

const SalesList = () => {
  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">매출 관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <select className="list_select">
                  <option>메뉴</option>
                  <option>제목</option>
                  <option>내용</option>
                  <option>작성자</option>
                </select>
              </div>
              <div className="search_input">
                <input
                  className="list_input"
                  placeholder="검색어를 입력하세요"
                ></input>
                <div className="list_search" style={{ marginRight: 10 }}>
                  검색
                </div>
                <div className="list_search reset_btn">초기화</div>
              </div>
            </div>
            <div className="table_box">
              <table className="list_table">
                <tbody>
                  <tr className="table_header">
                    <th className="table_header_col ">No.</th>
                    <th className="table_header_col ">이름</th>
                    <th className="table_header_col">연락처</th>
                    <th className="table_header_col ">가입일</th>
                    <th className="table_header_col ">영업자</th>
                    <th className="table_header_col ">상품명</th>
                    <th className="table_header_col ">병원</th>
                    <th className="table_header_col ">희망일1</th>
                    <th className="table_header_col ">희망일2</th>
                    <th className="table_header_col ">검진유무</th>
                    <th className="table_header_col ">상담희망</th>

                    <th className="table_header_col ">커미션승인</th>

                    <th className="table_header_col ">문자전송</th>
                  </tr>
                  <tr className="table_body">
                    <td className="table_col ">1</td>
                    <td className="table_col  pointer">유기홍</td>
                    <td className="table_col ">01012341234</td>
                    <td className="table_col ">24.02.28</td>
                    <td className="table_col ">고상우</td>
                    <td className="table_col ">vip패키지</td>
                    <td className="table_col ">델미병원</td>
                    <td className="table_col ">24.03.25</td>
                    <td className="table_col ">24.03.30</td>
                    <td className="table_col ">Y</td>
                    <td className="table_col ">N</td>
                    <td className="table_col ">
                      <div className="table_option_box">
                        <div className="option_btn">승인</div>
                      </div>
                    </td>
                    <td className="table_col ">
                      <div className="table_option_box">
                        <div className="option_btn">전송</div>
                      </div>
                    </td>
                  </tr>
                  {/* <tr
              className="table_header"
              style={{ backgroundColor: "#fff" }}
            >
              <td colSpan="7" style={{ textAlign: "center" }}>
                <p style={{ fontSize: 18, padding: 50 }}>
                  [ 공지사항 ]
                  <br /> 검색 결과가 없습니다.
                </p>
              </td>
            </tr> */}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pagination_box">
            <button>{`<<`}</button>
            <button>{`<`}</button>
            <button>1</button>
            <button>{`>`}</button>
            <button>{`>>`}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesList;
