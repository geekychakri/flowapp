import Head from "next/head";
import Link from "next/link";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { motion } from "framer-motion";
import { Music, Clock, Edit3, Box, Edit, Radio } from "react-feather";

import { fadeInUp } from "./../animation/motion";

function Tools() {
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.09,
      },
    },
  };
  return (
    <>
      <Head>
        <title>Flow | Tools</title>
      </Head>
      <motion.div
        className="tools"
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        variants={stagger}
      >
        <motion.h1 variants={fadeInUp} className="tools__heading">
          Productivity Tools
        </motion.h1>
        <motion.div className="tools__select">
          <Link href="/sounds">
            <motion.a
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="tools__item"
            >
              <Music size={32} />
              <span className="tools__item-title">Ambient Sounds</span>
            </motion.a>
          </Link>
          <Link href="/pomodoro">
            <motion.a
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="tools__item"
            >
              <Clock size={32} />
              <span className="tools__item-title">Pomodoro</span>
            </motion.a>
          </Link>
          <Link href="/todos">
            <motion.a
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="tools__item"
            >
              <Edit3 size={32} />
              <span className="tools__item-title">ToDo List</span>
            </motion.a>
          </Link>
          <Link href="/timeboxing">
            <motion.a
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="tools__item"
            >
              <Box size={32} />
              <span className="tools__item-title">Timeboxing</span>
            </motion.a>
          </Link>
          <Link href="/notes" className="tools__card">
            <motion.a
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="tools__item"
            >
              <Edit size={32} />
              <span className="tools__item-title">Notes</span>
            </motion.a>
          </Link>
          <Link href="/lofi" className="tools__card">
            <motion.a
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="tools__item"
            >
              <Radio size={32} />
              <span className="tools__item-title">Lo-fi Radio</span>
            </motion.a>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Tools;

export const getServerSideProps = withPageAuthRequired();
