import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Note = {
  id: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    console.time("get item from db");
    const [rows] = await pool.execute<any[]>(
      "select * from notes where id = ?",
      [req.query.id]
    );
    console.timeEnd("get item from db");

    if (rows.length === 0) {
      return res.status(404).json({});
    }

    return res.status(200).json(rows[0]);
  }

  if (req.method === "DELETE") {
    console.time("delete item from db");
    await pool.execute("delete from notes where id = ?", [req.query.id]);
    console.timeEnd("delete item from db");

    return res.status(200);
  }

  if (req.method === "PUT") {
    console.time("update item from db");
    const now = new Date();
    const updatedId = Number(req.query.id);
    await pool.execute(
      "update notes set title = ?, body = ?, updated_at = ? where id = ?",
      [req.body.title, req.body.body, now, updatedId]
    );
    console.timeEnd("update item from db");

    return res.status(200);
  }

  return res.send("Method not allowed.");
};
