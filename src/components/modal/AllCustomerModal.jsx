import React, { useEffect, useState } from "react";
import Axios from "axios";
const AllCustomerModal = (props) => {
  const [subData, setSubData] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  useEffect(() => {
    if (props.subData) {
      setSubData(props.subData);
    }
  }, []);

  const handleSubmit = async () => {
    const confirmUpdate = window.confirm("변경된 정보를 저장하시겠습니까?");
    if (!confirmUpdate) {
      return;
    }
    try {
      const response = await Axios.post(
        "https://www.wlcare.co.kr:8443/api/post/customer_all_edit",
        {
          updateData: subData,
          deleteData: deleteData,
          customerNum: subData.length,
        }
      );
      console.log(response.data);
      props.setCustomerNumber(subData.length);
      props.closeModal("update");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const clearModal = () => {
    props.closeModal();
  };
  const deleteInputArray = (index, idx) => {
    setSubData((prev) => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
    setDeleteData((prev) => [...prev, idx]);
  };
  const handleInputChange = (value, idx, index) => {
    setSubData((prev) => {
      const newArray = [...prev];
      newArray[index] = { idx: idx, name: value };
      return newArray;
    });
  };
  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">고객 상세</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            {subData.map((data, index) => {
              return (
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">검진자</div>
                    <div className="table_contents ">
                      <input
                        className="table_input"
                        type="text"
                        value={data.name}
                        onChange={(e) =>
                          handleInputChange(e.target.value, data.idx, index)
                        }
                      ></input>
                      {subData.length !== 1 && (
                        <div
                          className="delete_input"
                          onClick={() => deleteInputArray(index, data.idx)}
                        >
                          X
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={() => handleSubmit()}>
              수정
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

export default AllCustomerModal;
