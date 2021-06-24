import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";

import { getSession } from "@auth0/nextjs-auth0";
import { motion } from "framer-motion";
import { ArrowRight, Video } from "react-feather";

import "react-modal-video/css/modal-video.min.css";

import { fadeInUp, slideIn, stagger } from "./../animation/motion";

const ModalVideo = dynamic(() => import("react-modal-video"), {
  ssr: false,
});

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Flow | The minimalist productivity app</title>
      </Head>

      <motion.header
        className="header"
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
      >
        <motion.div variants={stagger} className="header__text-box">
          <h1 className="heading-primary">
            <motion.span variants={fadeInUp} className="heading-primary--main">
              Get. Set. Flow.
            </motion.span>
            <motion.span variants={fadeInUp} className="heading-primary--sub">
              The minimalist productivity app.
            </motion.span>
          </h1>

          <motion.div className="header__btns" variants={slideIn}>
            <motion.a href="/api/auth/login" className="btn-main">
              <span className="btn-main__text">Get Into Flow</span>
              <ArrowRight size={28} className="icon-arrow" />
            </motion.a>

            <button className="btn-video" onClick={() => setIsOpen(true)}>
              <span className="btn-video__text">Long story short</span>
              <Video size={28} />
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} className="maker">
            Made with ❤️ by{" "}
            <a
              href="https://twitter.com/geekychakri"
              rel="noopener norefereer"
              target="__blank"
              className="maker__name"
            >
              Chakri
            </a>
          </motion.div>
        </motion.div>
      </motion.header>

      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="ay9y3CTkT40"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Home;

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = getSession(req, res);

  if (session?.user) {
    return {
      redirect: {
        destination: "/sounds",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
