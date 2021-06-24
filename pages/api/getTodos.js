import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { harperFetch } from "./utils/harperFetch";

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);

  try {
    const todos = await harperFetch({
      operation: "search_by_value",
      schema: "flowdb",
      table: "todos",
      search_attribute: "userId",
      search_value: user.sub,
      get_attributes: ["task", "completed", "id"],
    });

    res.status(200).json(todos);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
