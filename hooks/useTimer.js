import { useState, useRef, useEffect } from "react";

import toast from "react-hot-toast";
import { Howl } from "howler";

const ding = new Howl({
  src: ["sounds/ding.mp3"],
});

const notify = (msg, icon) =>
  toast(msg, {
    icon,
    style: {
      fontSize: "2rem",
      fontWeight: "600",
      borderRadius: "5px",
      backgroundColor: "#212529",
      color: "#fff",
    },
  });

function useTimer() {
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [mode, setMode] = useState("work");
  const [timerOn, setTimerOn] = useState(false);

  console.log(mode);

  const minRef = useRef(mins);
  const secRef = useRef(secs);
  minRef.current = mins;
  secRef.current = secs;

  const toggleTimer = () => {
    setTimerOn((prevState) => !prevState);
  };

  let interval;
  useEffect(() => {
    if (timerOn) {
      interval = setInterval(() => {
        let currMins = minRef.current;
        let currSecs = secRef.current;
        console.log(currSecs);
        if (currSecs != 0) {
          setSecs((prevSecs) => prevSecs - 1);
        } else if (currMins != 0 && currSecs == 0) {
          setSecs(59);
          setMins((prevMins) => prevMins - 1);
        } else if (currMins == 0 && currSecs == 0) {
          if (mode === "shortBreak" || mode === "longBreak") {
            notify("Break's over. Back to work", "🚀");
            ding.play();
          } else if (mode === "work") {
            notify("Well Done! Take a break", "🍫");
            ding.play();
          }
          clearInterval(interval);
          setMins(25);
          setSecs(0);
          setTimerOn(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  return [mins, setMins, secs, setSecs, mode, setMode, timerOn, toggleTimer];
}

export default useTimer;
