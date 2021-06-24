import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { harperFetch } from "./utils/harperFetch";

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);

  try {
    const notes = await harperFetch({
      operation: "sql",
      sql: `delete from flowdb.notes where userId = '${user.sub}'`,
    });

    const todos = await harperFetch({
      operation: "sql",
      sql: `delete from flowdb.todos where userId = '${user.sub}'`,
    });

    const response = await Promise.all([notes, todos]);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
