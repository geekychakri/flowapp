import { motion } from "framer-motion";
import { Trash } from "react-feather";

const Note = ({ note, getId }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit="exit"
      className="notes__item"
      key={note.id}
    >
      <div className="notes__item-header">
        <h2 className="notes__item-title">{note.title}</h2>
        <span className="notes__item-delete" onClick={() => getId(note.id)}>
          <Trash />
        </span>
      </div>
      <p className="notes__item-body">{note.body}</p>
    </motion.div>
  );
};

export default Note;
