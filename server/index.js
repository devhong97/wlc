const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT;

// 미들웨어
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const secretKey = process.env.JWT_SECRET_KEY;

// DB연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});
// DB 연결 성공 시 페이지에 메세지 출력
db.connect((err) => {
  if (err) {
    console.error("DB 연결 실패: 에러가 발생했습니다." + err.stack);
    return;
  }
  console.log("DB 연결 성공");

  // 페이지에 메시지 출력
  app.get("/", (req, res) => {
    res.send(`DB 연결 성공 ${PORT} PORT [웰라이프케어]`);
  });
});

// [전역변수] - 날짜
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const hours = String(today.getHours()).padStart(2, "0");
const minutes = String(today.getMinutes()).padStart(2, "0");
const seconds = String(today.getSeconds()).padStart(2, "0");
const ymdDate = `${year}-${month}-${day}`;
const HisDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

// [전역함수] - 데이터 및 페이징관련 쿼리문
// 1. yCateData - category 존재하는 테이블
// 2. nCateData - category 없는 테이블
const yCateData = (tableName, category, page, pageSize, db, res) => {
  const offset = (page - 1) * pageSize;
  const reviewSql = `SELECT * FROM ${tableName} WHERE category = ? ORDER BY idx DESC LIMIT ?, ?`;
  const countSql = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE category = ?`;

  db.query(countSql, [category], (err, countResult) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving contact list");
      return;
    }

    const totalCount = countResult[0].totalCount;
    //console.log(`[${category} 데이터 총 개수]:`, totalCount, "개");

    db.query(reviewSql, [category, offset, pageSize], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving contact list");
      } else {
        // 조회된 데이터 전송
        const data = result.map((row) => {
          return { ...row };
        });
        const listTotal = Math.ceil(totalCount / pageSize);
        res.status(200).json({ listTotal, currentPage: page, allData: data });
      }
    });
  });
};
const nCateData = (tableName, page, pageSize, db, res) => {
  const offset = (page - 1) * pageSize;
  const reviewSql = `SELECT * FROM ${tableName} WHERE 1=1 ORDER BY idx DESC LIMIT ?, ?`;
  const countSql = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE 1=1`;

  db.query(countSql, (err, countResult) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving contact list");
      return;
    }

    const totalCount = countResult[0].totalCount;

    db.query(reviewSql, [offset, pageSize], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving contact list");
      } else {
        // 조회된 데이터 전송
        const data = result.map((row) => {
          return { ...row };
        });
        const listTotal = Math.ceil(totalCount / pageSize);
        res.status(200).json({ listTotal, currentPage: page, allData: data });
      }
    });
  });
};
// [전역함수] - 게시판 상세페이지
const detailData = (tableName, category, idx, res) => {
  const articleSql = `SELECT * FROM ${tableName} WHERE category = ? AND idx = ?`;
  const previousSql = `SELECT idx, title FROM ${tableName} WHERE category = ? AND idx < ? ORDER BY idx DESC LIMIT 1`;
  const nextSql = `SELECT idx, title FROM ${tableName} WHERE category = ? AND idx > ? ORDER BY idx ASC LIMIT 1`;

  // 현재 글 불러오기
  db.query(articleSql, [category, idx], (errCurrent, resultCurrent) => {
    if (errCurrent) {
      console.log(errCurrent);
      return res.status(500).send("현재글 불러오기 실패");
    }

    // 이전 글 불러오기
    db.query(previousSql, [category, idx], (errPrev, resultPrev) => {
      if (errPrev) {
        console.log(errPrev);
        return res.status(500).send("이전글 불러오기 실패");
      }

      // 다음 글 불러오기
      db.query(nextSql, [category, idx], (errNext, resultNext) => {
        if (errNext) {
          console.log(errNext);
          return res.status(500).send("다음글 불러오기 실패");
        }

        const responseData = {
          data: resultCurrent[0] || null,
          previous: resultPrev[0] || null,
          next: resultNext[0] || null,
        };

        res.json(responseData);
      });
    });
  });
};

if (process.env.DB_PASS === "") {
  /*
#=========================================#
|              이솔미 작업항목             |
#=========================================#
*/
  /* ============================================================ */
  // [회원가입 INPUT]
  app.post("/api/post/register", (req, res) => {
    console.log("[회원가입 완료]", JSON.stringify(req.body));
    const uidAddString = (length) => {
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return result;
    };

    //uid
    const addString = uidAddString(3);
    const timestamp = Date.now();
    const uniqueValue = timestamp.toString(32);

    const uid = uniqueValue + addString; //UID
    const { name, id, grade, password, nickname, phoneNumber, email } =
      req.body;

    // INSERT 쿼리 실행
    const registerSql = `INSERT INTO user_account (uid, name, id, grade, password, nickname, tel_no, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      registerSql,
      [uid, name, id, grade, password, nickname, phoneNumber, email],
      (err, result) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          res
            .status(500)
            .json({ error: "An error occurred while registering the user" });
          return;
        }
        console.log("User registered successfully:", result);
        res.status(200).json({ message: "User registered successfully" });
      }
    );
  });
  // [아이디 중복 확인]
  app.post("/api/post/id_check", (req, res) => {
    const { id } = req.body;

    const checkIdSql = "SELECT * FROM user_account WHERE id = ?";
    db.query(checkIdSql, [id], (err, result) => {
      if (err) {
        console.error("SELECT 실패:", err);
        res.status(500).send({ success: false, message: "SELECT 실패" });
      } else {
        if (result.length > 0) {
          res.status(200).send({ available: false });
        } else {
          res.status(200).send({ available: true });
        }
      }
    });
  });
  // [닉네임 중복 확인]
  app.post("/api/post/nickname_check", (req, res) => {
    const { nickname } = req.body;

    const checkNicknameSql = "SELECT * FROM user_account WHERE nickname = ?";
    db.query(checkNicknameSql, [nickname], (err, result) => {
      if (err) {
        console.error("SELECT 실패:", err);
        res.status(500).send({ success: false, message: "SELECT 실패" });
      } else {
        if (result.length > 0) {
          res.status(200).send({ available: false });
        } else {
          res.status(200).send({ available: true });
        }
      }
    });
  });
  // [로그인]
  app.post("/api/post/login", (req, res) => {
    const { id, password } = req.body;
    //const loginPw = crypto.createHash("sha256").update(password).digest("hex");
    const loginSql = "SELECT * FROM user_account WHERE id = ? AND password = ?"; // 컬럼명을 정확히 확인합니다.
    const loginData = [id, password];

    db.query(loginSql, loginData, (err, result) => {
      if (err) {
        console.error("SELECT 실패:", err);
        res.send({ success: false, message: "SELECT 실패" });
      } else {
        if (result.length > 0) {
          const { name } = result[0];
          const S1 = jwt.sign({ id }, "0eax5v776sz991xnk3", {
            expiresIn: "1h", //토큰 유효기간
          });
          const S2 = jwt.sign({ name }, "0eax5v776sz991xnk4", {
            expiresIn: "1h", //토큰 유효기간
          });

          // 로그인 성공시 접속 로그를 데이터베이스에 저장
          //const ipAddress = req.ip;
          const ipAddress =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;
          const userAgent = req.get("User-Agent");
          const location = req.headers.referer || "Direct";
          const insertSql =
            "INSERT INTO access_log (id, name, ip_address, user_agent, location, access_time, token_id, token_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
          db.query(
            insertSql,
            [id, name, ipAddress, userAgent, location, HisDate, S1, S2],
            (err, result) => {
              if (err) {
                console.error("접속 로그 삽입 실패:", err);
              } else {
                console.log("접속 로그가 데이터베이스에 저장되었습니다.");
              }
            }
          );

          res.send({ success: true, message: "로그인 성공", id, S1, S2 });
        } else {
          res.send({ success: false, message: "로그인 실패" });
        }
      }
    });
  });
  // [회원관리]
  app.get("/api/get/user_info_list", (req, res) => {
    //프론트에서 클릭한 num값을 flag번호로 사용함
    const flag = req.query.flag;

    let userInfoSql = "";
    switch (flag) {
      case "1": // 전체
        userInfoSql = "SELECT * FROM user_account";
        break;
      case "2": // 시스템관리자
        userInfoSql = "SELECT * FROM user_account WHERE grade = '1'";
        break;
      case "3": // 사이트관리자
        userInfoSql = "SELECT * FROM user_account WHERE grade = '2'";
        break;
      case "4": //기타관리자
        userInfoSql = "SELECT * FROM user_account WHERE grade = '3'";
        break;
      default: // 추가탭 필요 시 사용
        break;
    }

    db.query(userInfoSql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("데이터베이스 에러 발생");
      } else {
        if (result.length > 0) {
          const formattedResults = result.map((row) => {
            return { ...row };
          });
          return res.status(200).json(formattedResults);
        } else {
          return res.send("사용자를 찾을 수 없습니다."); // 결과가 없을 때 처리
        }
      }
    });
  });
  // [게시판 예시]
  app.get("/api/get/notice_list", (req, res) => {
    const tableName = "board"; // 테이블 이름
    const category = "notice"; // 카테고리
    const page = parseInt(req.query.page) || 1; //페이지 수
    const pageSize = parseInt(req.query.pageSize) || 5; //1페이지당 페이지 수

    listData(tableName, category, page, pageSize, db, res);
  });
  app.get("/api/get/notice_search", (req, res) => {
    const { searchTerm, searchOption, page, pageSize } = req.query;

    const startIndex = (page - 1) * pageSize;

    let searchSql = "SELECT * FROM board WHERE category = 'notice' ";

    if (searchTerm && searchOption) {
      let searchOp = "";
      switch (searchOption) {
        case "메뉴":
          searchOp = "menu";
          break;
        case "제목":
          searchOp = "title";
          break;
        case "내용":
          searchOp = "content";
          break;
        case "작성자":
          searchOp = "writer";
          break;
        default:
          break;
      }

      if (searchOp) {
        searchSql += ` AND (${searchOp} LIKE '%${searchTerm}%')`;
      }
    }
    console.log(searchSql);
    const countSql = `SELECT COUNT(*) as total FROM (${searchSql}) as searchResult`;

    db.query(countSql, (err, countResult) => {
      if (err) {
        console.error(err);
        res.status(500).send("검색 결과를 가져오는 중 오류 발생");
      } else {
        const totalItems = countResult[0].total;
        const pageSql = `${searchSql} ORDER BY idx DESC LIMIT ${startIndex}, ${pageSize}`;

        db.query(pageSql, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("검색 결과를 가져오는 중 오류 발생");
          } else {
            const formattedResults = result.map((row) => ({ ...row }));
            res.status(200).json({
              totalItems,
              results: formattedResults,
            });
            console.log(totalItems, formattedResults.length);
          }
        });
      }
    });
  });
  app.post("/api/post/notice_write", (req, res) => {
    //Random String 생성
    const generateRandomString = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomChar = alphabet[randomIndex];
        if (result.includes(randomChar)) {
          i--;
        } else {
          result += randomChar;
        }
      }
      return result;
    };
    const uidAddString = (length) => {
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return result;
    };

    //uid
    const randomString = generateRandomString();
    const addString = uidAddString(3);
    const timestamp = Date.now();
    const uniqueValue = timestamp.toString(32);

    const uid = uniqueValue + addString; //UID
    const ipAddress = req.ip; //작성자IP

    const { menu, title, content, writer } = req.body;

    //첨부파일 업로드 내용 경로추출
    const file = req.file;
    const filePath = file ? path.basename(file.path) : null;
    const uniqueSuffix = randomString + Math.round(Math.random() * 1e9);
    const UnqImgName = file ? uniqueSuffix + ":" + file.originalname : null; // 유니크한 이미지 이름

    const reviewSql =
      "INSERT INTO board (uid, category, menu, writer, title, content, img, unq_img, hit, date, ip ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const reviewData = [
      uid,
      "notice",
      menu,
      writer,
      title,
      content,
      filePath,
      UnqImgName,
      "0",
      ymdDate,
      ipAddress,
    ];

    db.query(reviewSql, reviewData, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
  app.post("/api/post/notice_edit", (req, res) => {
    console.log(req.body);
    //Random String 생성
    const generateRandomString = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomChar = alphabet[randomIndex];
        if (result.includes(randomChar)) {
          i--;
        } else {
          result += randomChar;
        }
      }
      return result;
    };
    //private_key
    const randomString = generateRandomString();

    const { menu, title, content, writer, idx, hit, date } = req.body;

    const file = req.file;
    const uniqueSuffix = randomString + Math.round(Math.random() * 1e9);
    const UnqImgName = file ? uniqueSuffix + ":" + file.originalname : null; // 유니크한 이미지 이름

    // 이미지 파일이 업로드된 경우와 아닌 경우를 나누어 처리
    if (file) {
      const img = file.filename;
      const noticeEditSql = `UPDATE board SET menu = ?, title = ?, content = ?, writer = ?, img = ?, unq_img = ?, hit = ?, date = ? WHERE idx = ? AND category = 'notice'`;

      db.query(
        noticeEditSql,
        [menu, title, content, writer, img, UnqImgName, hit, date, idx],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            res.json({ imageUrl: img }); // 이미지 URL을 응답에 추가
          }
        }
      );
    } else {
      // 이미지 파일이 업로드되지 않은 경우
      const getExistingImageSql = `SELECT img FROM board WHERE idx = ? AND category = 'notice'`;

      db.query(getExistingImageSql, [idx], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          const existingImage = result[0].image;

          // 기존 이미지를 유지하고 나머지 정보 업데이트
          const newsEditSql = `UPDATE board SET menu = ?, title = ?, content = ?, writer = ?, hit = ?, date = ? WHERE idx = ? AND category = 'notice'`;

          db.query(
            newsEditSql,
            [menu, title, content, writer, hit, date, idx],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
              } else {
                res.json({ imageUrl: existingImage }); // 이미지 URL을 응답에 추가
              }
            }
          );
        }
      });
    }
  });
  app.post("/api/post/notice_delete", (req, res) => {
    const { idx } = req.body;

    const noticeDelSql = `DELETE FROM board WHERE category = 'notice' AND idx = '${idx}'`;

    db.query(noticeDelSql, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    });
  });
  app.post("/api/post/notice_hit", (req, res) => {
    const { idx } = req.body;

    // 조회수 업데이트 SQL 쿼리
    const updateQuery = `UPDATE board SET hit = hit + 1 WHERE idx = ? AND category = 'notice'`;
    console.log(updateQuery);

    // 실행
    db.query(updateQuery, [idx], (error, results) => {
      if (error) {
        console.error("Error updating hit count: " + error.stack);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      } else {
        console.log(`Updated hit count for news with idx ${idx}`);
        res.json({ success: true });
      }
    });
  });
  app.get("/api/get/notice_detail", (req, res) => {
    const tableName = "board"; // 테이블 이름
    const category = "notice"; // 카테고리
    const idx = req.query.idx;

    detailData(tableName, category, idx, res);
  });
  /* ============================================================ */
} else if (process.env.DB_PASS === "root") {
  /*
#=========================================#
|              유기홍 작업항목             |
#=========================================#
*/
  /* ============================================================ */
  // [회원가입 INPUT]
  app.post("/api/post/register", (req, res) => {
    console.log("[회원가입 완료]", JSON.stringify(req.body));
    const uidAddString = (length) => {
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return result;
    };

    //uid
    const addString = uidAddString(3);
    const timestamp = Date.now();
    const uniqueValue = timestamp.toString(32);

    const uid = uniqueValue + addString; //UID
    const { name, id, grade, password, nickname, phoneNumber, email } =
      req.body;

    // INSERT 쿼리 실행
    const registerSql = `INSERT INTO user_account (uid, name, id, grade, password, nickname, tel_no, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      registerSql,
      [uid, name, id, grade, password, nickname, phoneNumber, email],
      (err, result) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          res
            .status(500)
            .json({ error: "An error occurred while registering the user" });
          return;
        }
        console.log("User registered successfully:", result);
        res.status(200).json({ message: "User registered successfully" });
      }
    );
  });
  // [아이디 중복 확인]
  app.post("/api/post/id_check", (req, res) => {
    const { id } = req.body;

    const checkIdSql = "SELECT * FROM user_account WHERE id = ?";
    db.query(checkIdSql, [id], (err, result) => {
      if (err) {
        console.error("SELECT 실패:", err);
        res.status(500).send({ success: false, message: "SELECT 실패" });
      } else {
        if (result.length > 0) {
          res.status(200).send({ available: false });
        } else {
          res.status(200).send({ available: true });
        }
      }
    });
  });
  // [닉네임 중복 확인]
  app.post("/api/post/nickname_check", (req, res) => {
    const { nickname } = req.body;

    const checkNicknameSql = "SELECT * FROM user_account WHERE nickname = ?";
    db.query(checkNicknameSql, [nickname], (err, result) => {
      if (err) {
        console.error("SELECT 실패:", err);
        res.status(500).send({ success: false, message: "SELECT 실패" });
      } else {
        if (result.length > 0) {
          res.status(200).send({ available: false });
        } else {
          res.status(200).send({ available: true });
        }
      }
    });
  });
  // [로그인]
  app.post("/api/post/login", (req, res) => {
    const { id, password } = req.body;
    const loginSql = "SELECT * FROM user_account WHERE id = ? AND password = ?";
    const loginData = [id, password];

    db.query(loginSql, loginData, (err, result) => {
      if (err) {
        console.error("SELECT 실패:", err);
        res.status(500).json({ success: false, message: "SELECT 실패" });
      } else {
        if (result.length > 0) {
          const { name } = result[0];
          const token = jwt.sign({ id, name }, secretKey, {
            expiresIn: "1h", // 토큰 유효기간
          });

          // 쿠키에 토큰 설정
          res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1시간 (3600000ms)

          // console.log("Generated Token:", token);

          // 로그인 성공 응답
          res.json({ success: true, message: "로그인 성공", name });
        } else {
          // 로그인 실패 응답
          res.status(401).json({ success: false, message: "로그인 실패" });
        }
      }
    });
  });

  // [회원관리]
  app.get("/api/get/user_info_list", (req, res) => {
    //프론트에서 클릭한 num값을 flag번호로 사용함
    const flag = req.query.flag;

    let userInfoSql = "";
    switch (flag) {
      case "1": // 전체
        userInfoSql = "SELECT * FROM user_account";
        break;
      case "2": // 시스템관리자
        userInfoSql = "SELECT * FROM user_account WHERE grade = '1'";
        break;
      case "3": // 사이트관리자
        userInfoSql = "SELECT * FROM user_account WHERE grade = '2'";
        break;
      case "4": //기타관리자
        userInfoSql = "SELECT * FROM user_account WHERE grade = '3'";
        break;
      default: // 추가탭 필요 시 사용
        break;
    }

    db.query(userInfoSql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("데이터베이스 에러 발생");
      } else {
        if (result.length > 0) {
          const formattedResults = result.map((row) => {
            return { ...row };
          });
          return res.status(200).json(formattedResults);
        } else {
          return res.send("사용자를 찾을 수 없습니다."); // 결과가 없을 때 처리
        }
      }
    });
  });
  // [게시판 예시]
  app.get("/api/get/notice_list", (req, res) => {
    const tableName = "board"; // 테이블 이름
    const category = "notice"; // 카테고리
    const page = parseInt(req.query.page) || 1; //페이지 수
    const pageSize = parseInt(req.query.pageSize) || 5; //1페이지당 페이지 수

    listData(tableName, category, page, pageSize, db, res);
  });
  app.get("/api/get/notice_search", (req, res) => {
    const { searchTerm, searchOption, page, pageSize } = req.query;

    const startIndex = (page - 1) * pageSize;

    let searchSql = "SELECT * FROM board WHERE category = 'notice' ";

    if (searchTerm && searchOption) {
      let searchOp = "";
      switch (searchOption) {
        case "메뉴":
          searchOp = "menu";
          break;
        case "제목":
          searchOp = "title";
          break;
        case "내용":
          searchOp = "content";
          break;
        case "작성자":
          searchOp = "writer";
          break;
        default:
          break;
      }

      if (searchOp) {
        searchSql += ` AND (${searchOp} LIKE '%${searchTerm}%')`;
      }
    }
    console.log(searchSql);
    const countSql = `SELECT COUNT(*) as total FROM (${searchSql}) as searchResult`;

    db.query(countSql, (err, countResult) => {
      if (err) {
        console.error(err);
        res.status(500).send("검색 결과를 가져오는 중 오류 발생");
      } else {
        const totalItems = countResult[0].total;
        const pageSql = `${searchSql} ORDER BY idx DESC LIMIT ${startIndex}, ${pageSize}`;

        db.query(pageSql, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("검색 결과를 가져오는 중 오류 발생");
          } else {
            const formattedResults = result.map((row) => ({ ...row }));
            res.status(200).json({
              totalItems,
              results: formattedResults,
            });
            console.log(totalItems, formattedResults.length);
          }
        });
      }
    });
  });
  app.post("/api/post/notice_write", (req, res) => {
    //Random String 생성
    const generateRandomString = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomChar = alphabet[randomIndex];
        if (result.includes(randomChar)) {
          i--;
        } else {
          result += randomChar;
        }
      }
      return result;
    };
    const uidAddString = (length) => {
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return result;
    };

    //uid
    const randomString = generateRandomString();
    const addString = uidAddString(3);
    const timestamp = Date.now();
    const uniqueValue = timestamp.toString(32);

    const uid = uniqueValue + addString; //UID
    const ipAddress = req.ip; //작성자IP

    const { menu, title, content, writer } = req.body;

    //첨부파일 업로드 내용 경로추출
    const file = req.file;
    const filePath = file ? path.basename(file.path) : null;
    const uniqueSuffix = randomString + Math.round(Math.random() * 1e9);
    const UnqImgName = file ? uniqueSuffix + ":" + file.originalname : null; // 유니크한 이미지 이름

    const reviewSql =
      "INSERT INTO board (uid, category, menu, writer, title, content, img, unq_img, hit, date, ip ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const reviewData = [
      uid,
      "notice",
      menu,
      writer,
      title,
      content,
      filePath,
      UnqImgName,
      "0",
      ymdDate,
      ipAddress,
    ];

    db.query(reviewSql, reviewData, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
  app.post("/api/post/notice_edit", (req, res) => {
    console.log(req.body);
    //Random String 생성
    const generateRandomString = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomChar = alphabet[randomIndex];
        if (result.includes(randomChar)) {
          i--;
        } else {
          result += randomChar;
        }
      }
      return result;
    };
    //private_key
    const randomString = generateRandomString();

    const { menu, title, content, writer, idx, hit, date } = req.body;

    const file = req.file;
    const uniqueSuffix = randomString + Math.round(Math.random() * 1e9);
    const UnqImgName = file ? uniqueSuffix + ":" + file.originalname : null; // 유니크한 이미지 이름

    // 이미지 파일이 업로드된 경우와 아닌 경우를 나누어 처리
    if (file) {
      const img = file.filename;
      const noticeEditSql = `UPDATE board SET menu = ?, title = ?, content = ?, writer = ?, img = ?, unq_img = ?, hit = ?, date = ? WHERE idx = ? AND category = 'notice'`;

      db.query(
        noticeEditSql,
        [menu, title, content, writer, img, UnqImgName, hit, date, idx],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            res.json({ imageUrl: img }); // 이미지 URL을 응답에 추가
          }
        }
      );
    } else {
      // 이미지 파일이 업로드되지 않은 경우
      const getExistingImageSql = `SELECT img FROM board WHERE idx = ? AND category = 'notice'`;

      db.query(getExistingImageSql, [idx], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          const existingImage = result[0].image;

          // 기존 이미지를 유지하고 나머지 정보 업데이트
          const newsEditSql = `UPDATE board SET menu = ?, title = ?, content = ?, writer = ?, hit = ?, date = ? WHERE idx = ? AND category = 'notice'`;

          db.query(
            newsEditSql,
            [menu, title, content, writer, hit, date, idx],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
              } else {
                res.json({ imageUrl: existingImage }); // 이미지 URL을 응답에 추가
              }
            }
          );
        }
      });
    }
  });
  app.post("/api/post/notice_delete", (req, res) => {
    const { idx } = req.body;

    const noticeDelSql = `DELETE FROM board WHERE category = 'notice' AND idx = '${idx}'`;

    db.query(noticeDelSql, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(result);
      }
    });
  });
  app.post("/api/post/notice_hit", (req, res) => {
    const { idx } = req.body;

    // 조회수 업데이트 SQL 쿼리
    const updateQuery = `UPDATE board SET hit = hit + 1 WHERE idx = ? AND category = 'notice'`;
    console.log(updateQuery);

    // 실행
    db.query(updateQuery, [idx], (error, results) => {
      if (error) {
        console.error("Error updating hit count: " + error.stack);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      } else {
        console.log(`Updated hit count for news with idx ${idx}`);
        res.json({ success: true });
      }
    });
  });
  app.get("/api/get/notice_detail", (req, res) => {
    const tableName = "board"; // 테이블 이름
    const category = "notice"; // 카테고리
    const idx = req.query.idx;

    detailData(tableName, category, idx, res);
  });
  /* ============================================================ */
}

// [연결성공 시 포트번호 반환]
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
