import OwnsTodo from "./middleware/OwnsTodo";
import { harperFetch } from "./utils/harperFetch";

export default OwnsTodo(async (req, res) => {
  const { id, completed } = req.body;

  try {
    const updatedTodo = await harperFetch({
      operation: "update",
      schema: "flowdb",
      table: "todos",
      records: [
        {
          id: id,
          completed,
        },
      ],
    });

    res.status(200).json(updatedTodo);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
