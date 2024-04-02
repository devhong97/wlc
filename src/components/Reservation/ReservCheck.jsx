import React, { useState } from 'react';
import { useReservContext } from "../Context/ReservContext";
import ReservInfoModal from '../modal/ReservInfoModal';
import { useNavigate } from 'react-router-dom';

const ReservCheck = () => {
    const { customerData, hospitalName, productName, hopeDate1, hopeDate2 } = useReservContext();
    const [infoModal, setInfoModal] = useState(false);
    const navigation = useNavigate();

    const openModal = () => {
        setInfoModal(true);
    }
    const closeModal = () => {
        setInfoModal(false);
        navigation("/reserv", { state: { status: "keep" } })
    }
    return (
        <div className="reserv_wrap">
            <div className="reserv_back">
                <div className="reserv_top_box">
                    <div className="reserv_title">
                        고객님의 <p className="point_text">정보</p>를 확인해주세요.
                    </div>
                </div>
                <div className="reserv_bottom_box">
                    <div className="reserv_text_box">
                        <div className='reserv_title'>계약자명</div>
                        <div className='reserv_text'>{customerData.name}</div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>검진대상자명</div>
                            <div className='reserv_text'>{customerData.customerName}</div>
                        </div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>인원수</div>
                            <div className='reserv_text'>{customerData.customerNumber}</div>
                        </div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>연락처</div>
                            <div className='reserv_text'>{customerData.phone}</div>
                        </div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>선택상품</div>
                            <div className='reserv_text'>{productName}</div>
                        </div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>선택병원</div>
                            <div className='reserv_text'>{hospitalName}</div>
                        </div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>희망검진일1</div>
                            <div className='reserv_text'>{hopeDate1}</div>
                        </div>
                    </div>
                    <div className="reserv_text_box">
                        <div className="reserv_text_box">
                            <div className='reserv_title'>희망검진일2</div>
                            <div className='reserv_text'>{hopeDate2}</div>
                        </div>
                    </div>
                </div>
                <div className="reserv_btn_box">
                    <div className="reserv_btn" onClick={() => openModal()}>
                        확인
                    </div>
                </div>
            </div>
            {infoModal && (
                <ReservInfoModal closeModal={closeModal}></ReservInfoModal>
            )}
        </div>
    );
};

export default ReservCheck;