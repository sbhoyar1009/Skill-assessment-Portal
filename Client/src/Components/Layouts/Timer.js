import React, { useState, useEffect, useRef } from "react";
import { FaStopwatch } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";

const Timer = (props) => {
  const [timerDays, settimerDays] = useState(null);
  const [timerHours, settimerHours] = useState(null);
  const [timerMinutes, settimerMinutes] = useState(null);
  const [timerSeconds, settimerSeconds] = useState(null);

  let interval = useRef();

  const startTimer = () => {
    let endTime = new Date(props.endTime).getTime();

    interval = setInterval(() => {
      let now = new Date().getTime();
      let distance = endTime - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current);
      } else {
        settimerDays(days);
        settimerHours(hours);
        settimerMinutes(mins);
        settimerSeconds(secs);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  });

  return (
    <div className="timer">
      {props.isActive ? (
        timerDays === null ? (
          Date.now() > new Date(props.endTime) ? (
            <strong>Test is Over.</strong>
          ) : (
            <strong>Loading...</strong>
          )
        ) : (
          <>
            <strong>
              <FaStopwatch style={{ marginRight: 10 }} size={20} />
              {timerDays >= 0 && timerDays < 10 ? "0" + timerDays : timerDays} D
              :{" "}
              {timerHours >= 0 && timerHours < 10
                ? "0" + timerHours
                : timerHours}{" "}
              :{" "}
              {timerMinutes >= 0 && timerMinutes < 10
                ? "0" + timerMinutes
                : timerMinutes}{" "}
              :{" "}
              {timerSeconds >= 0 && timerSeconds < 10
                ? "0" + timerSeconds
                : timerSeconds}
            </strong>
          </>
        )
      ) : (
        <strong>
          {" "}
          <CgDanger style={{ marginRight: 10, color: "red" }} size={20} />
          Test not started yet
        </strong>
      )}
    </div>
  );
};

export default Timer;
