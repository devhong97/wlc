import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from 'axios';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const [typeGroup, setTypeGroup] = useState([]);
    const [companyGroup, setCompanyGroup] = useState([]);
    const [branchGroup, setBranchGroup] = useState([]);

    useEffect(() => {
        getType();
    }, []);

    const getType = async () => {
        try {
            const response = await Axios.get("http://localhost:3001/api/get/type");
            setTypeGroup(response.data);
        } catch (error) {
            console.error("Error fetching type list:", error);
        }
    }

    const getCompany = async (type) => {
        try {
            const response = await Axios.get(`http://localhost:3001/api/get/company/${type}`);
            setCompanyGroup(response.data);
        } catch (error) {
            console.error("Error fetching company list:", error);
        }
    }

    const getBranch = async (company) => {
        try {
            const response = await Axios.get(`http://localhost:3001/api/get/branchcate/${company}`);
            setBranchGroup(response.data);
        } catch (error) {
            console.error("Error fetching branch list:", error);
        }
    }

    return (
        <BranchContext.Provider value={{ typeGroup, companyGroup, branchGroup, getType, getCompany, getBranch }}>
            {children}
        </BranchContext.Provider>
    );
}

export const useBranchFetch = () => {
    return useContext(BranchContext);
}
