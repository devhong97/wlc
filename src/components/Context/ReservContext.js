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
    const [signData1, setSignData1] = useState("");
    const [signData2, setSignData2] = useState("");

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
        if (signData1 !== "") {
            console.log(signData1);
        }
    }, [signData1]);

    useEffect(() => {
        if (signData2 !== "") {
            console.log(signData2);
        }
    }, [signData2]);

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
                clearReservData,
                setSignData1,
                setSignData2,
            }}
        >
            {children}
        </ReservContext.Provider>
    );
};

export const useReservContext = () => {
    return useContext(ReservContext);
};
