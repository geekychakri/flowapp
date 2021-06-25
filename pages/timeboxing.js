import Head from "next/head";
import { useState, useEffect, useRef } from "react";

import { Howl } from "howler";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { v1 as uuid } from "uuid";
import { Trash } from "react-feather";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const notify = (msg, icon) =>
  toast(msg, {
    icon,
    style: {
      fontSize: "2rem",
      fontWeight: "600",
      backgroundColor: "#212529",
      color: "#fff",
    },
  });

const ding = new Howl({
  src: ["sounds/ding.mp3"],
});

const TimeBoxing = () => {
  const [mins, setMins] = useState(25);
  const [taskMins, setTaskMins] = useState(25); //TODO:
  const [secs, setSecs] = useState(0);
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState([]);
  const [timerOn, setTimerOn] = useState(false);

  const minRef = useRef(mins);
  const secRef = useRef(secs);
  const formRef = useRef(null);
  const startBtnRef = useRef(null);
  const resetBtnRef = useRef(null);

  minRef.current = mins;
  secRef.current = secs;

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("focus"));
    localData ? setFocus(localData) : setFocus([]);

    startBtnRef.current.disabled = true;
    startBtnRef.current.style.opacity = 0.5;
    resetBtnRef.current.disabled = true;
    resetBtnRef.current.style.opacity = 0.5;

    if (localData && localData.length) {
      setMins(localData[0].mins); //TODO:
      formRef.current.style.display = "none";
      startBtnRef.current.disabled = false;
      startBtnRef.current.style.opacity = 1;
      resetBtnRef.current.disabled = false;
      resetBtnRef.current.style.opacity = 1;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus", JSON.stringify(focus));
  }, [focus]);

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
          clearInterval(interval);
          setMins(0);
          setSecs(0);
          setTimerOn(false);
          notify("Well Done!", "🎉");
          ding.play();
          startBtnRef.current.disabled = true;
          startBtnRef.current.style.opacity = 0.5;
          resetBtnRef.current.disabled = true;
          resetBtnRef.current.style.opacity = 0.5;
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  const handleChange = (e) => {
    if (e.target.value.length > 2) {
      return;
    }
    setMins(e.target.value.replace(/^0+/, ""));
    setTaskMins(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFocus([...focus, { task: value, mins: mins * 1, id: uuid() }]);
    setValue("");
    startBtnRef.current.disabled = false;
    startBtnRef.current.style.opacity = 1;
    resetBtnRef.current.disabled = false;
    resetBtnRef.current.style.opacity = 1;
    formRef.current.style.display = "none";
  };

  const removeItem = (id) => {
    setFocus(focus.filter((task) => task.id !== id));

    formRef.current.style.display = "block";
    startBtnRef.current.disabled = true;
    startBtnRef.current.style.opacity = 0.5;
    resetBtnRef.current.disabled = true;
    resetBtnRef.current.style.opacity = 0.5;
    setTimerOn(false);
    setMins(taskMins);
    setSecs(0);
  };

  return (
    <>
      <Head>
        <title>
          Flow | {mins < 10 ? `0${mins}` : mins} :{" "}
          {secs < 10 ? `0${secs}` : secs}
        </title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="timebox"
      >
        <div className="timebox__header">
          <h1 className="timebox__heading">Timeboxing</h1>
          <div className="timebox__timer">
            <span className="timebox__timer-mins">
              {mins < 10 ? `0${Math.abs(mins)}` : mins}
            </span>
            <span className="timebox__timer-secs">
              {secs < 10 ? `0${secs}` : secs}
            </span>
            <div className="timebox__timer-btns">
              <button
                className="timebox__timer-start"
                onClick={() => setTimerOn(!timerOn)}
                ref={startBtnRef}
              >
                {timerOn ? "Pause" : "Start"}
              </button>
              <button
                className="timebox__timer-reset"
                onClick={() => {
                  setMins(taskMins);
                  setSecs(0);
                }}
                ref={resetBtnRef}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <form className="timebox__form" onSubmit={handleSubmit} ref={formRef}>
          <div className="timebox__input-box">
            <input
              type="text"
              className="timebox__input"
              placeholder="Add task"
              value={value}
              required
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <input
              type="number"
              className="timebox__input"
              min="1"
              max="60"
              maxLength="2"
              placeholder="Time"
              value={mins}
              required
              onKeyDown={(e) => {
                if (e.key === "e") {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          </div>
          <button className="timebox__btn">Add</button>
        </form>

        {focus.map((item) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit="exit"
              className="timebox__task"
              key={item.id}
            >
              <div className="timebox__task-content">
                <div className="timebox__item-indicator"></div>
                <p className="timebox__task-text">{item.task}</p>
              </div>

              <div className="timebox__task-icons">
                <span onClick={() => removeItem(item.id)}>
                  <Trash />
                </span>
              </div>
            </motion.div>
          );
        })}
        <Toaster position="bottom-right" />
      </motion.div>
    </>
  );
};

export default TimeBoxing;

export const getServerSideProps = withPageAuthRequired();
