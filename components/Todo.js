import { motion } from "framer-motion";
import { Trash } from "react-feather";

const Todo = ({ todo, updateTodo, deleteTodo, i }) => {
  const handleToggleCompleted = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updatedTodo);
  };

  return (
    <motion.li
      className="todo__item"
      variants={{
        hidden: () => ({
          opacity: 0,
        }),
        show: (i) => ({
          opacity: 1,

          transition: {
            delay: i * 0.05,
          },
        }),
        exit: {
          opacity: 0,
        },
      }}
      initial="hidden"
      custom={i}
      animate="show"
      exit="exit"
    >
      <input
        type="checkbox"
        id={todo.id}
        checked={todo.completed || false}
        onChange={handleToggleCompleted}
        className="todo__item-checkbox"
      />
      <label
        htmlFor={todo.id}
        className={`todo__item-label ${todo.completed ? "completed" : ""}`}
      >
        {todo.task}
      </label>

      <span
        className="todo__item-delete"
        onClick={() => deleteTodo(todo.id)}
        title="Delete"
      >
        <Trash />
      </span>
    </motion.li>
  );
};

export default Todo;
