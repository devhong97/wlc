import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReservContext } from '../Context/ReservContext';

const Reservation = () => {
    const { clearReservData } = useReservContext();
    const navigation = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const movePage = (path) => {
        navigation(`${pathname}${path}`)
    }

    useEffect(() => {
        clearReservData();
    }, [])
    return (
        <div className='reserv_wrap'>
            <div className='reserv_back'>
                <div className='reserv_top_box'>
                    <div className='reserv_title'>
                        회원님, 원하시는 <p className='point_text'>메뉴</p>를 선택하세요.
                    </div>
                </div>
                <div className='reserv_bottom_box'>
                    <div className='reserv_menu_box' onClick={() => movePage("/product")}>
                        <div className='menu_inner_box'>
                            <div className='menu_icon'></div>
                            <div className='menu_text'>상품찾기</div>
                        </div>
                    </div>
                    <div className='reserv_menu_box right' onClick={() => movePage("/hospital")}>
                        <div className='menu_inner_box'>
                            <div className='menu_icon second'></div>
                            <div className='menu_text'>병원보기</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;