import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const ReservContext = createContext();

export const ReservProvider = ({ children }) => {
  const [productList, setProductList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [productKey, setProductKey] = useState("");
  const [hospitalUpdateKey, setHospitalUpdateKey] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalIdx, setHospitalIdx] = useState("");
  const [hospitalKey, setHospitalKey] = useState([]);
  const [product, setProduct] = useState("");
  const [productName, setProductName] = useState("");
  const [hopeDate1, setHopeDate1] = useState("");
  const [hopeDate2, setHopeDate2] = useState("");
  const [hopeLocation, setHopeLocation] = useState("");
  const [hopeHour, setHopeHour] = useState("");
  const [hopeMinute, setHopeMinute] = useState("");
  const [signData1, setSignData1] = useState("");
  const [signData2, setSignData2] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [hospitalOriginKey, setHospitalOriginKey] = useState("");
  const [selfUrl, setSelfUrl] = useState("");
  const [cDate, setCDate] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    if (hospitalUpdateKey === "") {
      getProductList();
    } else {
      callHospitalKey(getProductList);
    }
  }, [hospitalUpdateKey]);

  useEffect(() => {
    if (productKey !== "") {
      getHospitalList();
    } else {
      getHospitalAllList();
      getProductList("reset");
    }
  }, [productKey]);

  useEffect(() => {
    if (hospitalName !== "") {
      callHospitalKey();
    }
  }, [hospitalName]);

  const getProductList = async (status, keys) => {
    let setParams = {
      key: hospitalKey,
    };
    if (status !== "") {
      setParams.key = "";
    }
    if (keys !== "") {
      setParams.key = keys;
    }
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/product_list",
        {
          params: setParams,
        }
      );
      const allData = response.data.data;
      setProductList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  const getHospitalAllList = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/hospital_list"
      );
      const allData = response.data.data;
      setHospitalList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  const getHospitalList = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/correct_hospital",
        {
          params: {
            p_key: productKey,
          },
        }
      );
      const allData = response.data.data;
      setHospitalList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  const callHospitalKey = async (callback) => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/select_hospital",
        {
          params: {
            name: hospitalName,
          },
        }
      );
      const allData = response.data.data;
      const keys = allData.map((item) => item.p_key);
      setHospitalKey(keys);
      // hospitalKey가 설정된 후에 콜백 함수 호출
      if (typeof callback === "function") {
        callback("", keys);
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const clearReservData = () => {
    setHospitalName("");
    setHospitalIdx("");
    setHospitalKey([]);
    setProduct("");
    setHopeDate1("");
    setHopeDate2("");
    setCDate("");
    setCustomerData([]);
    setProductName("");
    setSignData1("");
    setSignData2("");
    setHospitalOriginKey("");
    setHopeLocation("");
    setHopeHour("");
    setHopeMinute("");
  };

  const keepReservData = () => {
    setHospitalName("");
    setHospitalIdx("");
    setHospitalKey([]);
    setProduct("");
    setProductName("");
    setSignData1("");
    setSignData2("");
    setHospitalOriginKey("");
  };

  useEffect(() => {
    console.log(customerData);
  }, [customerData]);

  const uploadFiles = async (uid) => {
    //console.log(signData1);
    if (signData1 && signData2) {
      [...Array(parseInt(2))].map((_, index) => {
        const file = index === 0 ? signData1 : signData2;
        const resultFile = new File([file], `${uid}_${index}.png`);
        const columnName = index === 0 ? "sign_img_1" : "sign_img_2";
        if (file) {
          const formData = new FormData();
          formData.append("file", resultFile);
          formData.append("uid", uid);
          formData.append("columnName", columnName);
          //console.log(formData);

          Axios.post(
            "http://localhost:3001/api/post/customer_upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
            .then((res) => {
              //console.log(res.data);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
      if (selfUrl !== "") {
        navigation("/self/success");
      } else {
        alert(`등록이 완료되었습니다.`);
        navigation("/");
      }
    }
  };

  return (
    <ReservContext.Provider
      value={{
        setHospitalName,
        hospitalName,
        setHospitalIdx,
        hospitalIdx,
        setHospitalKey,
        hospitalKey,
        setProduct,
        product,
        setHopeDate1,
        hopeDate1,
        setCDate,
        cDate,
        setHopeDate2,
        hopeDate2,
        clearReservData,
        setSignData1,
        signData1,
        signData2,
        setSignData2,
        setHopeLocation,
        hopeLocation,
        setHopeHour,
        hopeHour,
        setHopeMinute,
        hopeMinute,
        setProductKey,
        hospitalList,
        productList,
        setHospitalUpdateKey,
        setCustomerData,
        customerData,
        setProductName,
        productName,
        keepReservData,
        uploadFiles,
        setHospitalOriginKey,
        hospitalOriginKey,
        setSelfUrl,
        selfUrl,
      }}
    >
      {children}
    </ReservContext.Provider>
  );
};

export const useReservContext = () => {
  return useContext(ReservContext);
};
