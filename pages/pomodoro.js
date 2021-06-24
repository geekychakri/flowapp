import Head from "next/head";

import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { fadeIn } from "../animation/motion";

//Custom Hook
import useTimer from "./../hooks/useTimer";

const Pomodoro = () => {
  const [mins, setMins, secs, setSecs, mode, setMode, timerOn, toggleTimer] =
    useTimer();

  const focus = () => {
    setMins(25);
    setSecs(0);
    setMode("work");
  };

  const short = () => {
    setMins(5);
    setSecs(0);
    setMode("shortBreak");
  };

  const long = () => {
    setMins(15);
    setSecs(0);
    setMode("longBreak");
  };

  const reset = () => {
    switch (mode) {
      case "shortBreak":
        setMins(5);
        setSecs(0);
        break;
      case "longBreak":
        setMins(15);
        setSecs(0);
        break;
      default:
        setMins(25);
        setSecs(0);
    }
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
        className="pomodoro"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={fadeIn}
      >
        <div className="pomodoro__app">
          <h1 className="pomodoro__heading">Pomodoro Timer</h1>
          <div className="pomodoro__timer">
            <span className="pomodoro__timer--mins">
              {mins < 10 ? `0${mins}` : mins}
            </span>
            <span className="pomodoro__timer--secs">
              {secs < 10 ? `0${secs}` : secs}
            </span>
          </div>

          <div className="pomodoro__btns">
            <button className="pomodoro__focus" onClick={focus}>
              Focus
            </button>
            <button className="pomodoro__relax-short" onClick={short}>
              Short Break
            </button>
            <button className="pomodoro__relax-long" onClick={long}>
              Long Break
            </button>
          </div>
          <div className="pomodoro__btns">
            <button className="pomodoro__start" onClick={toggleTimer}>
              {timerOn ? "Pause" : "Start"}
            </button>
            <button className="pomodoro__reset" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </motion.div>
    </>
  );
};

export default Pomodoro;

export const getServerSideProps = withPageAuthRequired();
