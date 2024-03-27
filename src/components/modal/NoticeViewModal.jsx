import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
/* eslint-disable-next-line */
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";

function stripHtml(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

const NoticeViewModal = (props) => {
  const [title, setTitle] = useState("");
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [updateContentHTML, setUpdateContentHTML] = useState("");
  const editorRef = useRef(null);

  // LIST에서 가져온 상세보기 idx 호출
  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
      getDetail();
    }
  }, [props.detailIdx]);

  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/notice_detail",
        {
          params: {
            idx: props.detailIdx,
          },
        }
      );
      const allData = response.data;
      setTitle(allData[0].title);
      setUpdateContentHTML(stripHtml(allData[0].content));
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 수정완료버튼
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/notice_modify",
        {
          idx: props.detailIdx,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 공지삭제버튼
  const deleteBranch = async () => {
    const confirmDelete = window.confirm(`공지글을 삭제하시겠습니까?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/notice_delete",
        {
          idx: props.detailIdx,
        }
      );
      alert("지점이 삭제되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const onUploadImage = async (blob, callback) => {
    try {
      const formData = new FormData();
      formData.append("image", blob);

      const response = await Axios.post(
        "http://101.101.210.243:3001/api/post/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const imageUrl = response.data.imageUrl;
      callback(imageUrl, "alt text");
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생", error);
    }
  };

  // 모달창닫기
  const clearModal = () => {
    props.closeModal();
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">지점 상세</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  제목<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="제목을 입력해주세요."
                    value={title}
                    onChange={() => setTitle()}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  내용<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <Editor
                    initialValue={updateContentHTML}
                    height="300px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={true}
                    previewStyle="vertical"
                    ref={editorRef}
                    onChange={() =>
                      setUpdateContentHTML(
                        editorRef.current.getInstance().getHTML()
                      )
                    }
                    plugins={[colorSyntax]}
                    hooks={{
                      addImageBlobHook: (blob, callback) => {
                        onUploadImage(blob, callback);
                      },
                    }}
                    id="content"
                  />
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  회사명<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">asd</div>
              </div>
            </div>

            <div className="table_row">
              <div className="table_section">
                <div className="table_title">생성일</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">asd</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              수정
            </div>
            <div className="modal_btn close" onClick={() => deleteBranch()}>
              삭제
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoticeViewModal;
