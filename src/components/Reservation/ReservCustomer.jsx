import React, { useState } from 'react';
import Axios from "axios";
import { useReservContext } from '../Context/ReservContext';
import { useNavigate } from 'react-router-dom';
import SignComponent from './SignComponent';
import { useAuth } from '../Context/AuthContext';

const ReservCustomer = () => {
    const { hospitalName, product, hopeDate1, hopeDate2, hospitalIdx } = useReservContext();
    const { decodeS3, decodeS1 } = useAuth();
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false); // 약관동의
    const navigation = useNavigate();
    const moveSecondStep = () => {
        if (name === "" || customerName === "" || phone === "") {
            alert("정보를 모두 입력해주세요.");
            return;
        }
        setStep(2);
    }
    const handleAgreeTerms = (e) => {
        setAgreeTerms(e.target.checked);
    };
    const moveThirdStep = () => {
        if (!agreeTerms) {
            alert("약관에 동의해주세요.")
            return;
        }
        setStep(3);

    }

    const submitHandle = async () => {
        let uid = decodeS1();
        let sendParams = {
            contractor_name: name,
            name: customerName,
            phone: phone,
            p_key: product,
            h_key: hospitalIdx,
            hope_date_1: hopeDate1,
            hope_date_2: hopeDate2,
            manager_uid: uid
        }
        try {
            const response = await Axios.post(
                "http://localhost:3001/api/post/customer",
                sendParams
            );
            console.log(response.data);
            alert("등록이 완료되었습니다.")
            navigation("/")
        } catch (error) {
            console.error("Error fetching list:", error);
        }
    }
    return (
        <div className='reserv_wrap'>
            {step === 1 && (
                <div className='reserv_back'>
                    <div className='reserv_top_box'>
                        <div className='reserv_title'>
                            고객님의 <p className='point_text'>정보</p>를 입력하세요.
                        </div>
                    </div>
                    <div className='reserv_bottom_box'>
                        <div className='reserv_input_box'>
                            <input className='reserv_input' placeholder='계약자 성명' value={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                        <div className='reserv_input_box'>
                            <input className='reserv_input' placeholder='검진자 성명' value={customerName} onChange={(e) => setCustomerName(e.target.value)}></input>
                        </div>
                        <div className='reserv_input_box'>
                            <input className='reserv_input' placeholder='연락처' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                        </div>
                    </div>
                    <div className='reserv_btn_box'>
                        <div className='reserv_btn' onClick={() => moveSecondStep()}>다음</div>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className='reserv_back'>
                    <div className='reserv_top_box'>
                        <div className='reserv_title'>
                            약관에 <p className='point_text'>동의</p>해주세요.
                        </div>
                    </div>
                    <div className='reserv_bottom_box'>
                        <div className='terms_box'>
                            <div className='terms_title'>개인정보 동의 약관</div>
                            <div className='terms_text'>약관 내용~~</div>
                        </div>
                        <div className='terms_checkbox'>
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={handleAgreeTerms}
                                id="user_agreeTerms"
                                className="terms_checkbox"
                            />
                            <label className="terms_label" htmlFor="user_agreeTerms">
                                약관에 동의합니다.
                            </label>
                        </div>
                    </div>
                    <div className='reserv_btn_box'>
                        <div className='reserv_btn' onClick={() => moveThirdStep()}>다음</div>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div className='reserv_back sign'>
                    <div className='reserv_top_box'>
                        <div className='reserv_title'>
                            <p className='point_text'>서명</p>해주세요.
                        </div>
                    </div>
                    <div className='reserv_bottom_box sign'>
                        <SignComponent></SignComponent>
                    </div>
                    <div className='reserv_btn_box'>
                        <div className='reserv_btn' onClick={() => submitHandle()}>완료</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservCustomer;