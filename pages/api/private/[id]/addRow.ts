import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        console.time("add row to table");
        await pool.execute(`INSERT INTO ${req.query.id} () VALUES()`);
        console.timeEnd("add row to table");

        return res.status(200).json({ success: true });
    }
};
