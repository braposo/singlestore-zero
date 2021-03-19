import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getKeyByValue } from "@src/utils/data";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        console.time("get item from db");
        const [rows] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} ORDER BY id ASC LIMIT 100;`
        );
        console.timeEnd("get item from db");

        if (rows.length === 0) {
            return res.status(404).json({});
        }

        const { id, ...cols } = rows.shift();

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

    if (req.method === "POST") {
        console.time("create item from db");
        const parsedBody = JSON.parse(req.body);

        const [result] = await pool.execute(
            `INSERT INTO ${req.query.id} () VALUES()`
        );

        const [headers] = await pool.execute<any[]>(
            `SELECT * FROM ${req.query.id} WHERE id = 1 LIMIT 1;`
        );

        const insertedId = result.insertId;

        Object.entries(parsedBody).forEach(async ([key, value]) => {
            await pool.execute(
                `UPDATE ${req.query.id} SET ${getKeyByValue(
                    headers[0],
                    key
                )} = '${value}' WHERE id = ${insertedId}`
            );
        });

        console.timeEnd("create item from db");

        return res.status(200).json({ insertedId });
    }
};
