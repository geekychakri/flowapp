import Head from "next/head";
import { useState } from "react";

import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";
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

const Notes = ({ initialNotes }) => {
  console.log(initialNotes);
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [todoId, setTodoId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const addNote = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/createNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        if (res.status === 400) {
          throw new Error("Input fields required");
        } else {
          throw new Error("Oops! Something went wrong");
        }
      }
      const newTodo = await res.json();
      setNotes([...notes, { title, body, id: newTodo.id }]);
      setTitle("");
      setBody("");
      setLoading(false);
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
    toast.loading("Deleting...", { id: "delete", style: toastStyles });
    try {
      const res = await fetch("/api/deleteNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        toast.remove("delete");
        onCloseModal();
        throw new Error("Something went wrong");
      }
      toast.remove("delete");
      const existingNotes = [...notes];
      const filteredNotes = existingNotes.filter((note) => note.id !== id);
      setNotes(filteredNotes);
      toast.success("Deleted Successfully !", { style: toastStyles });
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
            <button className="notes__btn">
              {loading ? <div className="spinner notes__spinner"></div> : "Add"}
            </button>
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

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { req, res } = context;
    const session = await getSession(req, res);

    let notes = [];

    try {
      if (session?.user) {
        const data = await fetch(process.env.DB, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${process.env.DB_KEY}`,
          },
          body: JSON.stringify({
            operation: "search_by_value",
            schema: "flowdb",
            table: "notes",
            search_attribute: "userId",
            search_value: session.user.sub,
            get_attributes: ["title", "body", "id"],
          }),
        });
        notes = await data.json();
      }

      return {
        props: {
          initialNotes: notes,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        props: {
          err: "Something went wrong",
          initialNotes: notes,
        },
      };
    }
  },
});
