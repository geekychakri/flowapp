import OwnsTodo from "./middleware/OwnsTodo";
import { harperFetch } from "./utils/harperFetch";

export default OwnsTodo(async (req, res) => {
  const { id } = req.body;
  try {
    const deletedTodo = await harperFetch({
      operation: "delete",
      schema: "flowdb",
      table: "todos",
      hash_values: [id],
    });

    res.status(200).json(deletedTodo);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
