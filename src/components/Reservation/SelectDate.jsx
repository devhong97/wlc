import React, { useState } from 'react';
import { useReservContext } from '../Context/ReservContext';
import { useNavigate } from 'react-router-dom';

const SelectDate = () => {
    const { hospitalName, product, setHopeDate1, setHopeDate2, hopeDate1, hopeDate2 } = useReservContext();
    const [date1, setDate1] = useState(hopeDate1 || "");
    const [date2, setDate2] = useState(hopeDate2 || "");
    const navigation = useNavigate();

    const moveNext = () => {
        if (date1 === "" || date2 === "") {
            alert("희망검진일을 입력하세요")
            return;
        }

        setHopeDate1(date1);
        setHopeDate2(date2);

        navigation("/reserv/customer");


    }
    return (
        <div className='reserv_wrap'>
            <div className='reserv_back'>
                <div className='reserv_top_box'>
                    <div className='reserv_title'>
                        희망하시는 <p className='point_text'>검진일</p>을 선택하세요.
                    </div>
                </div>
                <div className='reserv_bottom_box'>
                    <div className='reserv_input_box'>
                        <input className='reserv_input' placeholder='희망검진일1' value={date1} onChange={(e) => setDate1(e.target.value)}></input>
                    </div>
                    <div className='reserv_input_box'>
                        <input className='reserv_input' placeholder='희망검진일2' value={date2} onChange={(e) => setDate2(e.target.value)}></input>
                    </div>
                </div>
                <div className='reserv_btn_box'>
                    <div className='reserv_btn' onClick={() => moveNext()}>다음</div>
                </div>
            </div>
        </div>
    );
};

export default SelectDate;