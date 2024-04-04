import React, { useState } from 'react';
import { useReservContext } from '../Context/ReservContext';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";

const SelectDate = () => {
    const { hospitalName, product, setHopeDate1, setHopeDate2, hopeDate1, hopeDate2 } = useReservContext();
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [dateText1, setDateText1] = useState(hopeDate1 || "");
    const [dateText2, setDateText2] = useState(hopeDate2 || "");
    const [openStatus, setOpenStatus] = useState(0)
    const navigation = useNavigate();

    const moveNext = () => {
        if (dateText1 === "" || dateText2 === "") {
            alert("희망검진일을 입력하세요")
            return;
        }

        setHopeDate1(dateText1);
        setHopeDate2(dateText2);

        navigation("/reserv/customer");


    }

    const openCalendar = (num) => {
        if (openStatus === 0 || num !== openStatus) {
            setOpenStatus(num)
        } else {
            setOpenStatus(0)
        }
    }

    const setFormatDate = (date, num) => {
        const momentDate = moment(date).format("YYYY.MM.DD");
        if (num === 1) {
            setDateText1(momentDate)
            setDate1(date)
        } else {
            setDateText2(momentDate)
            setDate2(date)
        }
        setOpenStatus(0)
    }
    return (
        <div className='reserv_wrap'>
            <div className='reserv_back'>
                <div className='reserv_top_box'>
                    <div className='reserv_title'>
                        희망하시는 <br /><p className='point_text'>검진일</p>을 선택하세요.
                    </div>
                </div>
                <div className='reserv_bottom_box'>
                    <div className='reserv_input_box calendar'>
                        <input className='reserv_input calendar' placeholder='희망검진일1' value={dateText1} readOnly onClick={() => openCalendar(1)}></input>
                        {openStatus === 1 && (
                            <Calendar className="reserv_calendar"
                                onChange={(e) => setFormatDate(e, 1)}
                                value={date1}
                                formatDay={(locale, date) => moment(date).format("DD")}
                                minDate={moment().toDate()}
                                calendarType="gregory"
                            />
                        )}

                    </div>
                    <div className='reserv_input_box calendar'>
                        <input className='reserv_input calendar' placeholder='희망검진일2' value={dateText2} readOnly onClick={() => openCalendar(2)}></input>
                        {openStatus === 2 && (
                            <Calendar className="reserv_calendar"
                                minDate={moment().toDate()}
                                onChange={(e) => setFormatDate(e, 2)}
                                value={date2}
                                formatDay={(locale, date) => moment(date).format("DD")}
                                calendarType="gregory" />
                        )}
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