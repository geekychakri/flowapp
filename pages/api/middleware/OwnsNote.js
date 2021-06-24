import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import { harperFetch } from "./../utils/harperFetch";

const ownsNote = (handler) =>
  withApiAuthRequired(async (req, res) => {
    const { user } = await getSession(req, res);

    if (!user) {
      return res.status(401).json({ msg: "Not logged in" });
    }

    const { id } = req.body;

    try {
      const existingRecord = await harperFetch({
        operation: "search_by_hash",
        schema: "flowdb",
        table: "notes",
        hash_values: [id],
        get_attributes: ["userId"],
      });

      if (!existingRecord.length || user.sub !== existingRecord[0].userId) {
        return res.status(404).json({ msg: "Record not found" });
      }

      req.record = existingRecord[0];
      return handler(req, res);
    } catch (e) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong." });
    }
  });

export default ownsNote;
