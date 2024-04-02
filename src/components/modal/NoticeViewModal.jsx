import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
/* eslint-disable-next-line */
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import { useAuth } from "../Context/AuthContext";

const NoticeViewModal = (props) => {
  const [title, setTitle] = useState(props.detailData.title || "");
  const [detailNum, setDetailNum] = useState(props.detailData.idx || "");
  const [updateContentHTML, setUpdateContentHTML] = useState(
    props.detailData.content || ""
  );
  const [updateAttachment, setUpdateAttachment] = useState(
    props.detailData.attachment
  );
  const [writer, setWriter] = useState(props.detailData.writer || "");
  const [hit, setHit] = useState(props.detailData.hit || "");
  const [date, setDate] = useState(props.detailData.date || "");
  const [file, setFile] = useState(null);
  const editorRef = useRef(null);
  const { decodeS4 } = useAuth();

  // LIST에서 가져온 상세보기 데이터
  useEffect(() => {
    if (props.detailData) {
      console.log(props.detailData);
    }
  }, [props.detailData]);

  // 수정 완료버튼
  const handleSubmit = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();

      const formData = new FormData();
      formData.append("idx", detailNum);
      formData.append("title", title);
      formData.append("content", editorInstance.getHTML());
      formData.append("file", file);

      if (!file && updateAttachment) {
        // 이미지가 없는 경우는 기존 이미지를 재사용
        formData.append("existingImage", updateAttachment);
      }

      const response = await Axios.post(
        "http://localhost:3001/api/post/notice_modify",
        formData
      );

      // 서버 응답에서 이미지 URL을 가져와서 상태 업데이트
      if (response.data) {
        // 이미지 URL이 제대로 반환된 경우
        if (response.data.success) {
          if (response.data.imageUrl) {
            setUpdateAttachment(response.data.imageUrl);
          }
          alert("글 수정이 완료되었습니다.");
          clearModal();
        } else {
          // 이미지가 없어도 수정이 가능하게 하기 위해 success가 false인 경우도 처리
          alert("글 수정이 완료되었습니다.");
          clearModal();
        }
      } else {
        // 서버 응답이 없는 경우
        alert(
          "서버 응답에서 이미지 URL을 가져오지 못했습니다. 콘솔을 확인하세요."
        );
        console.error(response); // 콘솔에 서버 응답 출력
      }

      console.log(formData);
    } catch (error) {
      alert("글 수정 중 오류가 발생했습니다. 콘솔을 확인하세요.");
      console.error(error); // 콘솔에 에러 출력
    }
  };

  // 공지삭제버튼
  const deleteBbs = async () => {
    const confirmDelete = window.confirm(`공지글을 삭제하시겠습니까?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/notice_delete",
        {
          idx: detailNum,
        }
      );
      alert("게시글이 삭제되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const onUploadImage = async (blob, callback) => {
    try {
      const formData = new FormData();
      formData.append("image", blob);

      const response = await Axios.post(
        "http://localhost:3001/api/post/upload",
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

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    window.open(`http://localhost:3001/api/download/${fileName}`, "_blank");
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
                    onChange={(e) => setTitle(e.target.value)}
                    readOnly={decodeS4() !== "슈퍼관리자"}
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
                    readOnly={decodeS4() !== "슈퍼관리자"}
                  />
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  첨부파일<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  {decodeS4() === "슈퍼관리자" && (
                    <input type="file" onChange={handleFileChange} />
                  )}
                  {updateAttachment ? (
                    <div>
                      <div
                        onClick={() => handleDownload(updateAttachment)}
                        style={{ border: "1px solid #c6c6c6", padding: "15px" }}
                      >
                        <img
                          style={{
                            border: "1px solid #c6c6c6",
                            width: 200,
                            cursor: "pointer",
                          }}
                          src={`http://localhost:3001/uploads/${updateAttachment}`}
                          alt={updateAttachment}
                        />
                      </div>
                    </div>
                  ) : updateAttachment === null ? (
                    <div>첨부된 파일이 없습니다.</div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  작성자<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">{writer}</div>
              </div>
            </div>

            <div className="table_row">
              <div className="table_section">
                <div className="table_title">조회수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{hit}</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">등록일</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{date}</div>
                </div>
              </div>
            </div>
          </div>
          {decodeS4() === "슈퍼관리자" ? (
            <div className="modal_footer_box">
              <div className="modal_btn" onClick={handleSubmit}>
                수정
              </div>
              <div className="modal_btn close" onClick={() => deleteBbs()}>
                삭제
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default NoticeViewModal;
