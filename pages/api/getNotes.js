import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { harperFetch } from "./utils/harperFetch";

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);

  try {
    const notes = await harperFetch({
      operation: "search_by_value",
      schema: "flowdb",
      table: "notes",
      search_attribute: "userId",
      search_value: user.sub,
      get_attributes: ["title", "body", "id"],
    });

    res.status(200).json(notes);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
