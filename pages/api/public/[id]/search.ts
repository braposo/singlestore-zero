import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getKeyByValue } from "@src/utils/data";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        console.time("get item from db");
        const [headers] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} WHERE id = 1 LIMIT 1;`
        );

        const field = getKeyByValue(headers[0], req.query.field);

        const [rows] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} where ${field} like '%${req.query.query}%' order by id desc;`
        );
        console.timeEnd("get item from db");

        if (rows.length === 0) {
            return res.status(404).json({});
        }

        const { id, ...cols } = headers[0];

        const parsedRows = rows.reduce((result, row) => {
            const parsedRow = Object.entries(cols).reduce(
                (res, [key, value]) => {
                    return {
                        ...res,
                        [String(value).toLowerCase()]: row[key],
                    };
                },
                {}
            );

            return [
                ...result,
                {
                    id: row.id,
                    ...parsedRow,
                },
            ];
        }, []);

        return res.status(200).json(parsedRows);
    }
};
