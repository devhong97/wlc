import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import LinkPhoneModal from "../modal/LinkPhoneModal";
// import { CopyToClipboard } from "react-copy-to-clipboard";
const Link = () => {
  const { decodeS1 } = useAuth();
  const uid = decodeS1();
  const navigation = useNavigate();
  const [modal, setModal] = useState(false);
  const link = `https://www.wlcmanager.com/self/${uid}`;

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const movePage = () => {
    navigation(`/self/${uid}`);
  };

  // const copyText = () => {
  //   const textToCopy = `http://www.wlcmanager.com/self/${uid}`;
  //   navigator.clipboard
  //     .writeText(textToCopy)
  //     .then(() => {
  //       alert("링크가 복사되었습니다.");
  //     })
  //     .catch((err) => {
  //       console.error("텍스트 복사 실패:", err);
  //     });
  // };
  // const handleCopy = () => {
  //   alert("링크가 복사되었습니다.");
  // };
  return (
    <div className="main_wrap">
      <div className="main_back home">
        <div className="main_title_box blank">링크</div>
        <div className="main_sub_title">
          고객에서 예약링크를 전송할 수 있습니다.
        </div>
        <div className="mypage_area">
          <div className="mypage_container link">
            <div className="mypage_contents_box">
              <div className="my_row">
                <div className="my_text title">링크</div>
                <div className="my_text">
                  https://www.wlcmanager.com/self/{uid}
                </div>
                {/* <CopyToClipboard
                  text={`http://www.wlcmanager.com/self/${uid}`}
                  onCopy={handleCopy}
                >
                  <div className="my_btn">복사하기</div>
                </CopyToClipboard> */}
                <div className="my_btn" onClick={() => openModal()}>
                  문자전송
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <LinkPhoneModal closeModal={closeModal} link={link}></LinkPhoneModal>
      )}
    </div>
  );
};

export default Link;
