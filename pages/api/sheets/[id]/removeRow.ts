import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        console.time("remove row to table");
        const [row] = await pool.execute(
            `SELECT MAX(id) as maxId FROM ${req.query.id}`
        );

        const { maxId } = row[0];

        if (maxId > 2) {
            await pool.execute(
                `DELETE FROM ${req.query.id} WHERE ID = ${maxId};`
            );
        }
        console.timeEnd("remove row to table");

        return res.status(200).json({ success: true });
    }
};
