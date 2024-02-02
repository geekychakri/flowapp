import Head from "next/head";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { fadeIn } from "./../animation/motion";
import Todo from "../components/Todo";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

const Todos = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const addTodo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existingTodos = [...todos];
      const latestTodos = [
        ...existingTodos,
        { task: task, completed: false, id: window.crypto.randomUUID() },
      ];
      setTodos(latestTodos);
      window.localStorage.setItem("todos", JSON.stringify(latestTodos));
      setTask("");
      setLoading(false);
      if (typeof window !== "undefined") {
        window.scrollTo(0, document.body.scrollHeight);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        id: "add",
        style: toastStyles,
      });
    }
  };

  const updateTodo = async (updatedTask) => {
    try {
      const existingTodos = [...todos];
      const existingTodo = existingTodos.find(
        (todo) => todo.id === updatedTask.id
      );
      existingTodo.completed = updatedTask.completed;
      console.log(existingTodos);
      window.localStorage.setItem("todos", JSON.stringify(existingTodos));
      setTodos(existingTodos);
    } catch (err) {
      setDisable(false);
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  const deleteTodo = async (id) => {
    try {
      const existingTodos = [...todos];
      const newTodos = existingTodos.filter((todo) => todo.id !== id);
      window.localStorage.setItem("todos", JSON.stringify(newTodos));
      setTodos(newTodos);
      setDisable(false);
    } catch (err) {
      setDisable(false);
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  useEffect(() => {
    // Retrieve todos from local storage on component mount
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Flow | Todos</title>
      </Head>
      <motion.div
        className="todo"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={fadeIn}
      >
        <h1 className="todo__heading">ToDo List</h1>
        <form onSubmit={addTodo} className="todo__form">
          <div className="todo__input-wrapper">
            <input
              type="text"
              name="task"
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Start a blog"
              className="todo__input"
              autoComplete="off"
              required
            />
            <button type="submit" className="todo__addBtn">
              {loading ? <div className="spinner todo__spinner"></div> : "Add"}
            </button>
          </div>
        </form>
        {todos.length ? (
          <ul className={`todo__list ${disable ? "disable" : ""}`}>
            <AnimatePresence>
              {todos.map((todo, index) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  i={index}
                  updateTodo={updateTodo}
                  deleteTodo={deleteTodo}
                />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="todo__prompt">You don't have any todos !</div>
        )}
        <Toaster position="bottom-right" />
      </motion.div>
    </>
  );
};

export default Todos;

export const getServerSideProps = withPageAuthRequired();
