import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    console.time("get item from db");
    const [rows] = await pool.execute(
      "select id from notes order by updated_at DESC"
    );
    console.timeEnd("get item from db");

    return res.status(200).json(rows);
  }

  return res.send("Method not allowed.");
};
