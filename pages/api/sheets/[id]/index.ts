import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

type Note = {
    id: string;
};

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

        return res.status(200).json(rows);
    }

    if (req.method === "DELETE") {
        console.time("delete item from db");
        await pool.execute("delete from notes where id = ?", [req.query.id]);
        console.timeEnd("delete item from db");

        return res.status(200);
    }

    if (req.method === "PUT") {
        console.time("update item from db");
        const data = JSON.parse(req.body);

        const query = `UPDATE ${req.query.id} SET ${data.name} = '${data.value}' WHERE id = ${data.id};`;
        await pool.execute(query);
        console.timeEnd("update item from db");

        return res.status(200).json({ success: true });
    }

    return res.send("Method not allowed.");
};
