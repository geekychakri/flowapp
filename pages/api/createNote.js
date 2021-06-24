import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import { harperFetch } from "./utils/harperFetch";

export default withApiAuthRequired(async (req, res) => {
  const { user } = await getSession(req);
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ msg: "Missing title or body" });
    }

    const newNote = await harperFetch({
      operation: "insert",
      schema: "flowdb",
      table: "notes",
      records: [
        {
          title,
          body,
          userId: user.sub,
        },
      ],
    });

    const createdNote = {
      id: newNote.inserted_hashes[0],
    };
    res.status(200).json(createdNote);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
