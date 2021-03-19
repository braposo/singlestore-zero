import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        console.time("remove row to table");
        await pool.execute(
            `DELETE FROM ${req.query.id} WHERE ID=(SELECT MAX(id) FROM ${req.query.id});`
        );
        console.timeEnd("remove row to table");

        return res.status(200).json({ success: true });
    }
};
