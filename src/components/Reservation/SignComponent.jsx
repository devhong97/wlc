import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useReservContext } from '../Context/ReservContext';
import html2canvas from 'html2canvas';
import saveAs from "file-saver";
import Axios from 'axios';
const SignComponent = () => {
    const { setSignData1, setSignData2, uploadFiles } = useReservContext();
    const canvasRef = useRef(null);
    const canvasRef2 = useRef(null);
    const canvasBoxRef1 = useRef(null);
    const canvasBoxRef2 = useRef(null);
    const [saveData1, setSaveData1] = useState("");
    const [saveData2, setSaveData2] = useState("");
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
            // setSignData1(saveData);
            saveAsImageHandler(1);
        } else {
            const saveData = getImg(canvasRef2);
            setSaveData2(saveData);
            // setSignData2(saveData);
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
            } else {
                setSignData2(file);
            }
        });
    };
    const sendToServer = async () => {
        try {
            const div = canvasBoxRef1.current;
            if (!div) {
                throw new Error('결과 전송에 실패했습니다.');
            }
            const canvas = await html2canvas(div, { scale: 2 });
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve);
            });
            console.log(blob);
            saveAs(blob, 'result.png'); // 파일 저장
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    return (
        <div className='sign_container'>
            <div className='sign_box'>
                <div className='sign_title'>성명자필</div>
                <div className='sign_contents' id="canvasSign" ref={canvasBoxRef1}>
                    <CanvasDraw
                        ref={canvasRef}
                        brushColor="#000000"
                        className='sign_canvas'
                        brushRadius={3}
                        hideGrid={true}
                        passive={false}

                    />
                </div>
                <div className='sign_btn_box'>
                    <div className='sign_btn' onClick={() => handleClear(1)}>다시하기</div>
                    <div className='sign_btn blue' onClick={() => handleCavasChange(1)}>완료</div>
                </div>
            </div>
            <div className='sign_box'>
                <div className='sign_title'>서명</div>
                <div className='sign_contents'>
                    <CanvasDraw
                        ref={canvasRef2}
                        brushColor="#000000"
                        className='sign_canvas'
                        brushRadius={3}
                        hideGrid="true"
                    />
                </div>
                <div className='sign_btn_box'>
                    <div className='sign_btn' onClick={() => handleClear(2)}>다시하기</div>
                    <div className='sign_btn blue' onClick={() => handleCavasChange(2)}>완료</div>
                </div>
            </div>
            {/* {saveData1 && (
                <>
                    <img src={saveData1} alt="" />
                    <textarea rows={10} value={saveData1} readOnly />
                </>
            )}
            {saveData2 && (
                <>
                    <img src={saveData2} alt="" />
                    <textarea rows={10} value={saveData2} readOnly />
                </>
            )} */}
        </div>
    );
};

export default SignComponent;