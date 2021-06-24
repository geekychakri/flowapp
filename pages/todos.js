import Head from "next/head";
import { useEffect, useState } from "react";

import { getSession } from "@auth0/nextjs-auth0";
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

const Todos = ({ initialTodos }) => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const addTodo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/createTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      // console.log(res);

      if (!res.ok) {
        setLoading(false);
        if (res.status === 400) {
          throw new Error("Todo field required");
        } else {
          throw new Error("Oops! Something went wrong");
        }
      }

      const newTodo = await res.json();

      const existingTodos = [...todos];
      const latestTodos = [
        ...existingTodos,
        { task: task, completed: false, id: newTodo.id },
      ];
      setTodos(latestTodos);
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
    // console.log(updatedTask);
    setDisable(true);
    toast.loading("Updating...", { id: "update", style: toastStyles });
    try {
      const res = await fetch("/api/updateTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) {
        setDisable(false);
        toast.remove("update");
        toast.error("Something went wrong", {
          style: toastStyles,
        });
        return;
      }

      setDisable(false);
      toast.remove("update");
      toast.success("Successfully updated !", {
        style: toastStyles,
      });

      const existingTodos = [...todos];
      const existingTodo = existingTodos.find(
        (todo) => todo.id === updatedTask.id
      );
      existingTodo.completed = updatedTask.completed;
      setTodos(existingTodos);
    } catch (err) {
      setDisable(false);
      toast.remove("update");
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  const deleteTodo = async (id) => {
    setDisable(true);
    toast.loading("Deleting...", {
      id: "delete",
      style: toastStyles,
    });
    try {
      const res = await fetch("/api/deleteTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      console.log(res);

      if (!res.ok) {
        setDisable(false);
        toast.remove("delete");
        toast.error("Something went wrong", {
          id: "delete",
          style: toastStyles,
        });
        return;
      }
      const existingTodos = [...todos];
      const newTodos = existingTodos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
      setDisable(false);
      toast.remove("delete");
      toast.success("Successfully deleted !", {
        style: toastStyles,
      });
    } catch (err) {
      setDisable(false);
      toast.remove("delete");
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  // console.log(todos);

  useEffect(() => {
    setTodos(initialTodos);
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
              {loading ? <div className="donutSpinner"></div> : "Add"}
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

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { req, res } = context;
    const session = await getSession(req, res);

    let todos = [];

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
            table: "todos",
            search_attribute: "userId",
            search_value: session.user.sub,
            get_attributes: ["task", "completed", "id"],
          }),
        });

        todos = await data.json();
        console.log(todos);
      }
      return {
        props: {
          initialTodos: todos,
        },
      };
    } catch (err) {
      return {
        props: {
          err: "Something went wrong",
          initialTodos: todos,
        },
      };
    }
  },
});
