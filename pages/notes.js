import Head from "next/head";
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import "react-responsive-modal/styles.css";
import Modal from "react-responsive-modal";
import toast, { Toaster } from "react-hot-toast";

import { fadeIn } from "./../animation/motion";
import Note from "../components/Note";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [todoId, setTodoId] = useState(0);
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const addNote = async (e) => {
    e.preventDefault();

    try {
      const existingNotes = [
        ...notes,
        { title, body, id: window.crypto.randomUUID() },
      ];
      setNotes(existingNotes);
      window.localStorage.setItem("notes", JSON.stringify(existingNotes));
      setTitle("");
      setBody("");

      if (typeof window !== "undefined") {
        window.scrollTo(0, document.body.scrollHeight);
      }
    } catch (err) {
      toast.error(err.message, {
        id: "add",
        style: toastStyles,
      });
    }
  };

  const getId = async (id) => {
    setTodoId(id);
    onOpenModal();
  };

  const deleteNote = async (id) => {
    try {
      const existingNotes = [...notes];
      const filteredNotes = existingNotes.filter((note) => note.id !== id);
      setNotes(filteredNotes);
      window.localStorage.setItem("notes", JSON.stringify(filteredNotes));
      onCloseModal();
    } catch (err) {
      toast.remove("delete");
      toast.error(err.message, {
        id: "delete",
        style: {
          fontSize: "2rem",
          fontWeight: "600",
          backgroundColor: "#212529",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    // Retrieve  notes from local storage on component mount
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      <Head>
        <title>Flow | Notes</title>
      </Head>
      <motion.div
        className="notes"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={fadeIn}
      >
        <h1 className="notes__heading">Notes</h1>
        <form className="notes__form" onSubmit={addNote} autoComplete="off">
          <div className="notes__input-wrapper">
            <input
              type="text"
              placeholder="Title"
              className="notes__input"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
            <textarea
              cols="10"
              rows="3"
              className="notes__textarea"
              placeholder="Take a note..."
              onChange={(e) => setBody(e.target.value)}
              value={body}
              required
            ></textarea>
            <button className="notes__btn">Add</button>
          </div>
        </form>

        {notes.length ? (
          <div className="notes__list">
            <Masonry
              breakpointCols={breakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {notes.map((note) => (
                <Note key={note.id} note={note} getId={getId} />
              ))}
            </Masonry>
          </div>
        ) : (
          <div className="notes__prompt">You don't have any notes !</div>
        )}
      </motion.div>
      <Toaster position="bottom-right" />
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          overlay: {
            background: "rgba(0,0,0,0.7)",
          },
          modal: {
            backgroundColor: "#212529",
            color: "#fff",
            maxWidth: "500px",
            borderRadius: "5px",
            padding: "4rem",
          },
          closeIcon: {
            display: "none",
          },
        }}
      >
        <div className="confirm__modal">
          <h1 className="confirm__modal-heading">Are you sure ?</h1>
          <p className="confirm__modal-text">You want to delete this note ?</p>
          <button className="confirm__modal-btn" onClick={onCloseModal}>
            No, Keep it.
          </button>
          <button
            className="confirm__modal-btn"
            onClick={() => deleteNote(todoId)}
          >
            Yes, Delete it.
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Notes;

export const getServerSideProps = withPageAuthRequired();
