import React, { createContext, useContext, useState, useEffect } from "react";
import Axios from "axios";

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  const [typeGroup, setTypeGroup] = useState([]);
  const [companyGroup, setCompanyGroup] = useState([]);
  const [branchGroup, setBranchGroup] = useState([]);
  const [type, setContextType] = useState("");
  const [company, setContextCompany] = useState("");

  useEffect(() => {
    getType();
  }, []);

  useEffect(() => {
    if (type !== "") {
      getCompany();
    }
  }, [type]);

  useEffect(() => {
    if (company !== "") {
      getBranch();
    }
  }, [company]);

  const getType = async () => {
    try {
      const response = await Axios.get(
        "http://118.67.134.86:3001/api/get/type"
      );
      setTypeGroup(response.data);
    } catch (error) {
      console.error("Error fetching type list:", error);
    }
  };

  const getCompany = async () => {
    try {
      const response = await Axios.get(
        `http://118.67.134.86:3001/api/get/company/${type}`
      );
      setCompanyGroup(response.data);
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };

  const getBranch = async () => {
    try {
      const response = await Axios.get(
        `http://118.67.134.86:3001/api/get/branchcate/${company}`
      );
      setBranchGroup(response.data);
    } catch (error) {
      console.error("Error fetching branch list:", error);
    }
  };

  return (
    <BranchContext.Provider
      value={{
        typeGroup,
        companyGroup,
        branchGroup,
        getType,
        getCompany,
        getBranch,
        setContextType,
        setContextCompany,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranchContext = () => {
  return useContext(BranchContext);
};
