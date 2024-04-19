import React, { useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useReservContext } from '../Context/ReservContext';
import html2canvas from 'html2canvas';
import saveAs from "file-saver";
import Axios from 'axios';
const SignComponent = (props) => {
    const { setSignData1, setSignData2, signData1, signData2, uploadFiles } = useReservContext();
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
    const canvasBoxRef1 = useRef(null);
    const canvasBoxRef2 = useRef(null);
    const [saveData1, setSaveData1] = useState("");
    const [saveData2, setSaveData2] = useState("");
    const [step, setStep] = useState(1);
    const getImg = (ref) => {
        if (ref.current) {
            const canvasContainer = ref.current.canvasContainer;
            if (canvasContainer && canvasContainer.children.length >= 2) {
                return canvasContainer.children[1].toDataURL();
            }
        }
        return null; // 캔버스가 없거나 이미지를 찾을 수 없을 경우 null 반환
    };

    const handleCavasChange = (num) => {
        if (num === 1) {
            const saveData = getImg(canvasRef);
            setSaveData1(saveData);
            saveAsImageHandler(1);
        } else {
            const saveData = getImg(canvasRef2);
            setSaveData2(saveData);
            saveAsImageHandler(2);
        }
    }
    const handleClear = (num) => {
        if (num === 1) {
            canvasRef.current.clear();
            setSaveData1("");
            setSignData1("");
        } else {
            canvasRef2.current.clear();
            setSaveData2("");
            setSignData2("");
        }
    }
    const saveAsImageHandler = (status) => {
        const target = document.getElementById('canvasSign');
        if (!target) {
            return alert('결과 저장에 실패했습니다.');
        }
        html2canvas(target).then((canvas) => {
            const link = canvas.toDataURL('image/png');
            const blobBin = atob(link.split(',')[1]);
            const array = [];
            for (let i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
            console.log(file);
            if (status === 1) {
                setSignData1(file);
                setStep(2);
                canvasRef.current.clear();
            } else {
                setSignData2(file);
            }
        });
    };
    useEffect(() => {
        console.log(signData2);
        if (signData2 !== "") {
            moveNext();
        }
    }, [signData2]);
    const moveNext = () => {
        console.log(signData1, signData2);
        if (!signData1 || !signData2) {
            alert("서명란의 완료버튼을 눌러주세요");
        } else {
            props.checkSign()
        }
    }

    return (
        <div>
            <div className="reserv_top_box">
                <div className="reserv_title">
                    개인정보제공동의
                </div>
                <div className="reserv_title sub">개인정보제공동의를 위한 서명을 해주세요. ({step}/2)</div>
            </div>
            <div className="reserv_bottom_box">
                <div className="reserv_contents_box sign">
                    <div className='sign_container'>

                        <div className='sign_box'>
                            <div className='sign_title'>{step === 1 ? "성명자필" : "서명"}</div>
                            <div className='sign_contents' id="canvasSign">
                                {step === 1 ? (
                                    <div className='sign'>
                                        <CanvasDraw
                                            ref={canvasRef}
                                            brushColor="#000000"
                                            className='sign_canvas'
                                            brushRadius={3}
                                            hideGrid={true}
                                            passive={false}

                                        />
                                    </div>
                                ) : (
                                    <div className='sign'>
                                        <CanvasDraw
                                            ref={canvasRef2}
                                            brushColor="#000000"
                                            className='sign_canvas'
                                            brushRadius={3}
                                            hideGrid={true}
                                            passive={false}
                                        />
                                    </div>
                                )}
                            </div>


                        </div>
                        {step === 1 ? (
                            <div className='sign_btn_box'>
                                <div className='sign_btn' onClick={() => handleClear(1)}></div>
                                <div className='sign_btn blue' onClick={() => handleCavasChange(1)}></div>
                            </div>
                        ) : (
                            <div className='sign_btn_box'>
                                <div className='sign_btn' onClick={() => handleClear(2)}></div>
                                <div className='sign_btn blue' onClick={() => handleCavasChange(2)}></div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignComponent;