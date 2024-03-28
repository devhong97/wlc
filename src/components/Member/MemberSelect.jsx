import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import { useBranchContext } from '../Context/BranchContext';

const MemberSelect = (props, ref) => {
    const { typeGroup, companyGroup, branchGroup, setContextType, setContextCompany, } = useBranchContext();
    const [type, setType] = useState("");
    const [company, setCompany] = useState("");
    const [branchName, setBranchName] = useState("");
    const [branchIdx, setBranchIdx] = useState("");
    useImperativeHandle(ref, () => ({
        clearSearch
    }))
    useEffect(() => {
        setContextType(type);
    }, [type]);

    useEffect(() => {
        setContextCompany(company);
    }, [company]);

    const selectBranch = (num) => {
        setBranchIdx(num);
        const selectedBranch = branchGroup.find((data) => data.branch_idx === num);
        if (selectedBranch) {
            setBranchName(selectedBranch.branch_name);
        }
    };

    const selectType = (data) => {
        setType(data);
        setCompany("");
        setBranchIdx("");
        setBranchName("");
    };

    const handleSearch = () => {
        if (props.setSearchData) {
            props.setSearchData({
                "branch_type": type,
                "company_name": company,
                "branch_name": branchName
            });
        }
    }
    const clearSearch = () => {
        if (props.setSearchData) {
            props.setSearchData([]);
            selectType("")
        }
    }
    return (
        <div className='list_select_area'>
            <div className="search_select">
                <select className="list_select"
                    value={type}
                    onChange={(e) => selectType(e.target.value)}>
                    <option value="">지점종류</option>
                    {typeGroup.map((type, index) => {
                        return (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        );
                    })}
                </select>
                <select
                    className="list_select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}>
                    <option value="">회사명</option>
                    {companyGroup.map((data, index) => {
                        return (
                            <option key={index} value={data}>
                                {data}
                            </option>
                        );
                    })}
                </select>
                <select className="list_select"
                    value={branchIdx}
                    onChange={(e) => selectBranch(e.target.value)}>
                    <option value="">지점명</option>
                    {branchGroup.map((data, index) => {
                        return (
                            <option key={index} value={data.branch_idx}>
                                {data.branch_name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="search_input">
                {/* <input
                  className="list_input"
                  placeholder="검색어를 입력하세요"
                ></input> */}
                <div className="list_search" onClick={() => handleSearch()}>검색</div>
                <div className="list_search reset_btn" onClick={() => clearSearch()}>초기화</div>
            </div>
        </div>
    );
};

export default React.forwardRef(MemberSelect);