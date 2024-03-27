import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";

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
    const [productName, setProductName] = useState("")
    const [hopeDate1, setHopeDate1] = useState("");
    const [hopeDate2, setHopeDate2] = useState("");
    const [signData1, setSignData1] = useState("");
    const [signData2, setSignData2] = useState("");
    const [customerData, setCustomerData] = useState([]);

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
            console.log("여기");
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
        console.log(keys);
        let setParams = {
            key: hospitalKey
        }
        if (status !== "") {
            setParams.key = ""
        }
        if (keys !== "") {
            setParams.key = keys
        }
        try {
            const response = await Axios.get(
                "http://localhost:3001/api/get/reserv/product_list",
                {
                    params: setParams
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
            const keys = allData.map((item) => parseInt(item.p_key));
            console.log(keys);
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
        setCustomerData([]);
        setProductName("");
    };

    const keepReservData = () => {
        setHospitalName("");
        setHospitalIdx("");
        setHospitalKey([]);
        setProduct("");
        setProductName("");
    }

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
                setHopeDate2,
                hopeDate2,
                clearReservData,
                setSignData1,
                signData1,
                signData2,
                setSignData2,
                setProductKey,
                hospitalList,
                productList,
                setHospitalUpdateKey,
                setCustomerData,
                customerData,
                setProductName,
                productName,
                keepReservData
            }}
        >
            {children}
        </ReservContext.Provider>
    );
};

export const useReservContext = () => {
    return useContext(ReservContext);
};
