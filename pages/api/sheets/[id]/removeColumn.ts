import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        console.time("remove column to table");
        const [
            row,
        ] = await pool.execute(
            `SELECT column_count FROM sheet_schema WHERE table_id = ?;`,
            [req.query.id]
        );

        const colCount = row[0].column_count;
        const colName = `col${colCount}`;

        if (colCount > 1) {
            await pool.execute(
                `ALTER TABLE ${req.query.id} DROP COLUMN ${colName};`
            );

            await pool.execute(
                `UPDATE sheet_schema SET column_count = ${
                    colCount - 1
                } WHERE table_id = '${req.query.id}';`
            );
        }
        console.timeEnd("remove column to table");

        return res.status(200).json({ success: true });
    }
};
