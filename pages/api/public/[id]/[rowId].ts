import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getKeyByValue } from "@src/utils/data";

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

        const parsedRow = Object.entries(cols).reduce(
            (acc, [key, value]) => {
                return {
                    ...acc,
                    [String(value).toLowerCase()]: rows[0][key],
                };
            },
            { id: rows[0].id }
        );

        return res.status(200).json(parsedRow);
    }

    if (req.method === "PUT") {
        console.time("update item from db");
        const parsedBody = JSON.parse(req.body);

        const [headers] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} WHERE id = 1 LIMIT 1;`
        );

        Object.entries(parsedBody).forEach(async ([key, value]) => {
            await pool.execute(
                `UPDATE ${req.query.id} SET ${getKeyByValue(
                    headers[0],
                    key
                )} = '${value}' WHERE id = ${req.query.rowId}`
            );
        });

        console.timeEnd("update item from db");

        return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
        console.time("delete item from db");

        await pool.execute(
            `DELETE FROM ${req.query.id} WHERE id = ${req.query.rowId}`
        );

        console.timeEnd("delete item from db");

        return res.status(200).json({ success: true });
    }
};
