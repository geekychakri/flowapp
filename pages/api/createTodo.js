import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import { harperFetch } from "./utils/harperFetch";

export default withApiAuthRequired(async (req, res) => {
  const { user } = await getSession(req, res);
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).send({ message: "Task required" });
    }

    const newTodo = await harperFetch({
      operation: "insert",
      schema: "flowdb",
      table: "todos",
      records: [
        {
          task,
          completed: false,
          userId: user.sub,
        },
      ],
    });

    const createdTodo = {
      id: newTodo.inserted_hashes[0],
    };
    res.status(200).json(createdTodo);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
