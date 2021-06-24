import OwnsNote from "./middleware/OwnsNote";
import { harperFetch } from "./utils/harperFetch";

export default OwnsNote(async (req, res) => {
  const { id } = req.body;

  try {
    const deletedNote = await harperFetch({
      operation: "delete",
      schema: "flowdb",
      table: "notes",
      hash_values: [id],
    });

    res.status(200).json(deletedNote);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
