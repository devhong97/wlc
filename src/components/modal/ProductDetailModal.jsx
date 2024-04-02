import React, { useEffect, useState } from 'react';

const ProductDetailModal = (props) => {
    const [data, setData] = useState([])
    useEffect(() => {
        if (props.modalData) {
            setData(props.modalData)
        }
    }, [props])
    return (
        <div className="modal_wrap product">
            <div className="modal_back product">
                <div className="modal_box">
                    <div className="modal_title_box">
                        <div className='modal_text title'>
                            {data.product_1}
                        </div>
                        {data.product_1 === "PREMIUM 1+1" ? (
                            <div className="modal_text">{data.price_txt * 2} 원 (2인)</div>
                        ) : (
                            <div className="modal_text">{data.price_txt} 원 (1인)</div>
                        )}
                        <div className='modal_text sub'>
                            {data.product_1} 등급의 검진 패키지 상품입니다.
                        </div>
                        {/* <div className='modal_close_btn' onClick={props.closeModal}>X</div> */}
                    </div>
                    <div className='modal_content_box'>
                        <div className={`content_img img_${data.idx}`}></div>
                    </div>
                    <div className="modal_footer_box">
                        <div className="modal_btn" onClick={props.closeModal}>
                            상품목록으로 돌아가기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;