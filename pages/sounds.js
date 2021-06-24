import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { motion } from "framer-motion";
import { Howl } from "howler";
import toast, { Toaster } from "react-hot-toast";

import { fadeIn } from "./../animation/motion";
import sounds from "../data/sounds";

const Sounds = () => {
  const [flow] = useState({});

  console.log("Rendered");

  const playSound = (e) => {
    const sound = e.target.parentElement.parentElement.dataset.sound;
    const soundID = sound;

    if (sound) {
      if (!flow[soundID]) {
        toast.loading("Loading ...", {
          style: {
            fontSize: "2rem",
            fontWeight: "600",
            backgroundColor: "#212529",
            color: "#fff",
          },
        });
        flow[soundID] = new Howl({
          src: [`sounds/${sound}.mp3`],
          loop: true,
          onload: function () {
            e.target.classList.add("active");
            toast.remove();
          },
        });
        flow[soundID].play();
      } else if (flow[soundID].playing()) {
        e.target.classList.remove("active");
        flow[soundID].fade(1, 0, 1000);
        setTimeout(function () {
          flow[soundID].pause();
        }, 1000);
      } else {
        e.target.classList.add("active");
        flow[soundID].play();
        flow[soundID].fade(0, 0.8, 1000);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    return () => {
      for (let sound in flow) {
        flow[sound].stop();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Flow | Sounds</title>
      </Head>
      <motion.div
        className="sounds"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={fadeIn}
      >
        <h1 className="sounds__heading">Ambient Sounds</h1>
        <div className="sounds__grid" onClick={playSound}>
          {sounds.map((sound) => {
            return (
              <div
                className={`sounds__icon`}
                data-sound={sound.name}
                key={sound.id}
              >
                <Image
                  src={`/img/${sound.name}.png`}
                  width="80"
                  height="80"
                  className="img__icon"
                  alt={sound.name}
                  title={sound.name}
                />
              </div>
            );
          })}
        </div>
        <Toaster position="bottom-right" />
      </motion.div>
    </>
  );
};

export default Sounds;

export const getServerSideProps = withPageAuthRequired();
