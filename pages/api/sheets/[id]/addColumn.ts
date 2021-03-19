import { pool } from "@src/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function printToLetter(number, result = "") {
    var charIndex = number % alphabet.length;
    var quotient = number / alphabet.length;
    if (charIndex - 1 == -1) {
        charIndex = alphabet.length;
        quotient--;
    }
    result = alphabet.charAt(charIndex - 1) + result;
    if (quotient >= 1) {
        printToLetter(quotient, result);
    } else {
        return result;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        console.time("add column to table");
        const [
            row,
        ] = await pool.execute(
            `SELECT column_count FROM sheet_schema WHERE table_id = ?;`,
            [req.query.id]
        );

        const colCount = row[0].column_count + 1;
        const colName = `col${colCount}`;

        await pool.execute(
            `ALTER TABLE ${req.query.id} ADD COLUMN ${colName} TEXT DEFAULT '';`
        );

        const letter = printToLetter(colCount);
        await pool.execute(
            `UPDATE ${req.query.id} SET ${colName} = '${letter}' WHERE id = 1;`
        );
        await pool.execute(
            `UPDATE sheet_schema SET column_count = ${colCount} WHERE table_id = '${req.query.id}';`
        );
        console.timeEnd("add column to table");

        return res.status(200).json({ success: true });
    }
};
