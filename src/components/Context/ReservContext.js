import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";

const ReservContext = createContext();

export const ReservProvider = ({ children }) => {
    const [hospitalName, setHospitalName] = useState("");
    const [hospitalIdx, setHospitalIdx] = useState("");
    const [hospitalKey, setHospitalKey] = useState([]);
    const [product, setProduct] = useState("");
    const [hopeDate1, setHopeDate1] = useState("");
    const [hopeDate2, setHopeDate2] = useState("");
    const [customerData, setCustomerData] = useState([]);

    useEffect(() => {
        if (hospitalName !== "") {
            callHospitalKey();
        }
    }, [hospitalName]);

    const callHospitalKey = async () => {
        try {
            const response = await Axios.get(
                "http://localhost:3001/api/get/reserv/select_hospital",
                {
                    params: {
                        name: hospitalName
                    }
                }
            );
            const allData = response.data.data;
            const keys = allData.map(item => parseInt(item.p_key));
            setHospitalKey(keys);
        } catch (error) {
            console.error("Error fetching list:", error);
        }

    }

    useEffect(() => {
        if (hospitalKey.length !== 0) {
            console.log(hospitalKey);
        }
    }, [hospitalKey]);



    useEffect(() => {
        if (product !== "" && hospitalIdx === "") {
            console.log("상품먼저");
        }
    }, [product]);



    const clearReservData = () => {
        setHospitalName("");
        setHospitalIdx("");
        setHospitalKey([]);
        setProduct("");
        setHopeDate1("");
        setHopeDate2("");
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
                setCustomerData,
                clearReservData,
            }}
        >
            {children}
        </ReservContext.Provider>
    );
};

export const useReservContext = () => {
    return useContext(ReservContext);
};
