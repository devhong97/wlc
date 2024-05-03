import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth } from "../Context/AuthContext";
/* eslint-disable-next-line */
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

const NoticeWriteModal = (props) => {
  const { decodeS2 } = useAuth();

  const [title, setTitle] = useState(""); // 제목
  const [content, setContent] = useState(""); // 게시글
  const [writer, setWriter] = useState(""); // 작성자
  const [selectedFile, setSelectedFile] = useState(null); //파일첨부
  const [fileUrl, setFileUrl] = useState(""); //파일 URL
  const editorRef = useRef(null);

  // 파일 첨부 삭제
  const handleFileDelete = () => {
    setSelectedFile(null); // 파일 선택 상태 초기화
    setFileUrl(""); // 파일 URL 비우기
  };

  //Editor 파일 업로드 관련 함수
  const onUploadImage = async (blob, callback) => {
    try {
      const formData = new FormData();
      formData.append("image", blob);

      // 서버의 엔드포인트 URL을 올바르게 수정해야 합니다.
      const response = await Axios.post(
        "http://localhost:3001/api/post/upload", // 서버 엔드포인트 경로를 확인하세요
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // 업로드된 이미지의 URL을 받아와서 callback 함수에 전달합니다.
      const imageUrl = response.data.imageUrl;
      console.log("Uploaded image URL:", imageUrl); // 이미지 URL 콘솔에 출력
      callback(imageUrl, "alt text");
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생", error);
    }
  };

  //내용 체크
  const handleContent = () => {
    const editorInstance = editorRef.current.getInstance();
    const htmlContent = editorInstance.getHTML();
    setContent(htmlContent);
  };

  //파일 선택 핸들러
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    const fileURL = URL.createObjectURL(e.target.files[0]);
    setFileUrl(fileURL);
  };

  //모달 초기화
  const clearModal = () => {
    props.closeModal();
  };

  //지점 등록버튼
  const handleSubmit = async () => {
    if (title === "") {
      alert("제목을 입력해주세요.");
      const titleInput = document.getElementById("user_title");
      if (titleInput) {
        titleInput.focus();
      }
      return;
    } else if (content === "") {
      alert("내용을 입력해주세요.");
      const contentInput = document.getElementById("user_content");
      if (contentInput) {
        contentInput.focus();
      }
      return;
    }

    //첨부파일
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("writer", decodeS2());

    if (selectedFile) {
      formData.append("file", selectedFile, selectedFile.name);
    } else {
      formData.append("file", ""); // 파일이 없는 경우 빈 값을 추가합니다.
    }

    // Axios를 사용하여 서버로 데이터 전송
    Axios.post("http://localhost:3001/api/post/notice_write", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);
        alert(`글등록이 완료되었습니다.`);
        clearModal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">공지사항 등록</div>
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
                    onChange={(e) => setTitle(e.target.value)}
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
                    initialValue=" " // content를 Editor의 초기값으로 사용;
                    height="300px"
                    initialEditType="wysiwyg"
                    plugins={[colorSyntax]}
                    placeholder="내용을 입력하세요"
                    ref={editorRef}
                    hooks={{
                      addImageBlobHook: onUploadImage,
                    }}
                    onChange={handleContent} // value가 아니라 함수 자체를 전달
                    id="content"
                  ></Editor>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  첨부파일<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  {selectedFile ? (
                    <div className="table_contents w100">
                      {selectedFile ? (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            style={{ width: "150px", height: "150px" }}
                            className="table_img"
                            src={fileUrl}
                            alt="첨부이미지"
                          />
                          <button
                            onClick={handleFileDelete}
                            style={{
                              position: "relative",
                              bottom: "16px",
                              right: "1px",
                              background: "none",
                              padding: "4px 10px",
                              cursor: "pointer",
                              borderRadius: "10px",
                              color: "#fff",
                              fontSize: "16px",
                              border: "none",
                              boxShadow: "4px 4px 4px -4px",
                              backgroundColor: "#669B2E",
                              zIndex: 1, // 다른 요소 위에 표시되도록 설정
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="file" className="image_label">
                        <div className="btn_upload"></div>
                      </label>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        id="file"
                        className="file_input"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  작성자<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">{decodeS2()}</div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              등록
            </div>
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeWriteModal;
