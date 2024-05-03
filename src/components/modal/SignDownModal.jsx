import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const SignDownModal = (props) => {
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [name, setName] = useState("");
  const downRef = useRef();

  useEffect(() => {
    if (props.sign_img_1 && props.sign_img_2 && props.contractorName) {
      setImg1(props.sign_img_1);
      setImg2(props.sign_img_2);
      setName(props.contractorName);
    }
  }, [props]);

  const clearModal = () => {
    props.closeModal();
  };

  const handleDownload = () => {
    const target = document.getElementById("down_back");
    if (!target) {
      return;
    }
    html2canvas(target, {
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${name}_계약서류.pdf`);
      props.closeModal();
    });
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">서명 확인</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="down_back" id="down_back" ref={downRef}>
            <div className="sign_img_container">
              <div className="sign_img_box">
                <img
                  className="sign_img"
                  src={`https://www.wlcare.co.kr:8443/uploads/${img1}`}
                  alt={img1}
                ></img>
              </div>
              <div className="sign_img_box">
                <img
                  className="sign_img"
                  src={`https://www.wlcare.co.kr:8443/uploads/${img2}`}
                  alt={img2}
                ></img>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={() => handleDownload()}>
              다운로드
            </div>
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignDownModal;
