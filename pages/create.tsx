import { pool } from "@src/utils/db";
import { GetServerSideProps } from "next";
import {
    uniqueNamesGenerator,
    Config,
    adjectives,
    colors,
    animals,
} from "unique-names-generator";

const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: "_",
    length: 3,
};

export default function Create() {
    return <div>Error creating new sheet</div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const tableID: string = uniqueNamesGenerator(customConfig);
    const conn = await pool.getConnection();

    await conn.beginTransaction();

    try {
        // Create table
        await conn.execute(`
            CREATE TABLE ${tableID} (
                id SERIAL PRIMARY KEY,
                col1 TEXT DEFAULT '',
                col2 TEXT DEFAULT '',
                col3 TEXT DEFAULT ''
            );
        `);

        // Add base values
        await conn.execute(
            `INSERT INTO ${tableID} (col1, col2, col3) VALUES('A', 'B', 'C')`
        );
        await conn.execute(`INSERT INTO ${tableID} () VALUES()`);
        await conn.execute(`INSERT INTO ${tableID} () VALUES()`);
        await conn.execute(`INSERT INTO ${tableID} () VALUES()`);

        // Update table schema
        await conn.execute(`
            INSERT INTO sheet_schema(table_id, created_at, updated_at, column_count) VALUES ("${tableID}", now(), now(), 3);
        `);
    } catch (e) {
        console.error(e);
        await conn.rollback();
        return {
            props: {},
        };
    }

    await conn.commit();
    conn.release();

    return {
        redirect: {
            destination: `/s/${tableID}`,
            permanent: false,
        },
    };
};
