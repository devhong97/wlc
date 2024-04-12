import { useState, useEffect } from "react";

const Clock = () => {
  // const { decodeS2 } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");
  const hour = String(time.getHours()).padStart(2, "0");
  const minute = String(time.getMinutes()).padStart(2, "0");
  const second = String(time.getSeconds()).padStart(2, "0");

  const dateString = `${year}년 ${month}월 ${day}일`;

  return (
    <div className="info_text">
      {dateString}
      {/* <span>접속자: {decodeS2()}</span> */}
    </div>
  );
};

export default Clock;
