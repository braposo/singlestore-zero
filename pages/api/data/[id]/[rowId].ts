import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        console.time("get item from db");
        const [headers] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} WHERE id = 1 LIMIT 1;`
        );

        const [rows] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} WHERE id = ${req.query.rowId} LIMIT 1;`
        );
        console.timeEnd("get item from db");

        if (rows.length === 0) {
            return res.status(404).json({});
        }

        const { id, ...cols } = headers[0];

        const parsedRow = Object.entries(cols).reduce((res, [key, value]) => {
            return {
                ...res,
                [String(value).toLowerCase()]: rows[0][key],
            };
        }, {});

        return res.status(200).json(parsedRow);
    }

    if (req.method === "PUT") {
        console.time("update item from db");
        const now = new Date();
        const updatedId = Number(req.query.id);
        console.log(req.body);
        // await pool.execute(
        //     "UPDATE ${req.query.id} SET title = ?, body = ?, updated_at = ? where id = ?",
        //     [req.body.title, req.body.body, now, updatedId]
        // );
        console.timeEnd("update item from db");

        return res.status(200).json({ success: true });
    }
};
