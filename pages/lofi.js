import Head from "next/head";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import ReactPlayer from "react-player";
import { Play, Pause, SkipForward, SkipBack, WifiOff } from "react-feather";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import stations from "./../data/stations";
import { fadeIn } from "../animation/motion";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

const Lofi = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stationIndex, setStationIndex] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [offline, setOffline] = useState(false);

  console.log(stations[stationIndex]);

  const handleOffline = () => {
    setOffline(true);
    console.log("OFFLINE");
  };

  const handleOnline = () => {
    // window.location.reload();
    setOffline(false);
    console.log("ONLINE");
  };

  const handlePlay = () => {
    if (!navigator.onLine) {
      toast.error("Check your internet connection.", {
        id: "error",
        style: toastStyles,
      });
      return;
    }
    setIsPlaying((prevState) => !prevState);
  };

  const prevStation = () => {
    if (offline) {
      return;
    }
    if (stationIndex - 1 < 0) {
      setStationIndex(stations.length - 1);
    } else {
      setStationIndex((prevState) => prevState - 1);
    }
  };

  const nextStation = () => {
    if (offline) {
      return;
    }
    if (stationIndex < stations.length - 1) {
      setStationIndex((prevState) => prevState + 1);
    } else {
      setStationIndex(0);
    }
  };

  const handleBuffer = () => {
    setBuffering(true);
  };

  const handleBufferEnd = () => {
    setBuffering(false);
  };

  const handleError = () => {
    if (!navigator.onLine) {
      toast.error("Check your internet connection.", {
        style: toastStyles,
      });
      return;
    }
    toast("Station not working. Skipping it !", {
      style: toastStyles,
    });
    nextStation();
  };

  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const Controls = () => {
    if (buffering) {
      return <div className="buffer"></div>;
    } else {
      return (
        <>
          {isPlaying ? (
            <Pause size={48} color="#f75858" fill="#f75858" />
          ) : (
            <Play size={48} color="#f75858" fill="#f75858" />
          )}
        </>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Flow | LoFi 🎧</title>
      </Head>
      <motion.div
        className="lofi"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={fadeIn}
      >
        <div className="lofi__youtube">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${stations[stationIndex].id}`}
            width="200px"
            height="200px"
            playsinline={true}
            playing={isPlaying}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            onError={handleError}
          />
        </div>
        <div className="lofi__player">
          <a
            href={`https://www.youtube.com/watch?v=${stations[stationIndex].id}`}
            target="__blank"
            rel="noopener noreferrer"
          >
            <Image
              src={`/img/${stations[stationIndex].img}`}
              alt="lofi"
              className="lofi__image"
              width="180"
              height="180"
            />
          </a>

          <div className="lofi__player-info">
            <h1 className="lofi__player-title">
              {offline ? (
                <pre>
                  You're offline <WifiOff size={32} />
                </pre>
              ) : (
                stations[stationIndex].name
              )}
            </h1>
          </div>

          <div className="lofi__player-btns">
            <div className="lofi__player-btn" onClick={prevStation}>
              <SkipBack size={40} fill="#212529" />
            </div>
            <div
              className={`lofi__player-btn ${buffering ? "disable" : ""}`}
              onClick={handlePlay}
            >
              <Controls />
            </div>
            <div className="lofi__player-btn" onClick={nextStation}>
              <SkipForward size={40} fill="#212529" />
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" reverseOrder={true} />
      </motion.div>
    </>
  );
};

export default Lofi;

export const getServerSideProps = withPageAuthRequired();
