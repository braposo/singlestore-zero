import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { pool } from "@src/utils/db";
import { Grid } from "@src/components/Grid";
import ReactDataSheet from "react-datasheet";
import { fetcher } from "@src/utils/fetch";
import useSWR, { mutate } from "swr";

type Props = {
    rows: any;
    tableID: string;
};

export default function Sheet({ rows, tableID }: Props) {
    const router = useRouter();
    const { data } = useSWR(`/api/sheets/${tableID}`, fetcher, {
        initialData: JSON.parse(rows),
    });

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const handleChange: ReactDataSheet.CellsChangedHandler<any, string> = (
        changes
    ) => {
        changes.forEach(async (change) => {
            await fetcher(`/api/sheets/${tableID}`, {
                body: JSON.stringify({
                    name: change.cell.name,
                    value: change.value,
                    id: change.cell.id,
                }),
                method: "PUT",
            });

            mutate(`/api/sheets/${tableID}`);
        });
    };

    const handleAddRow = async () => {
        await fetcher(`/api/sheets/${tableID}/addRow`, {
            method: "POST",
        });

        mutate(`/api/sheets/${tableID}`);
    };

    const handleAddColumn = async () => {
        await fetcher(`/api/sheets/${tableID}/addColumn`, {
            method: "POST",
        });

        mutate(`/api/sheets/${tableID}`);
    };

    const handleRemoveRow = async () => {
        await fetcher(`/api/sheets/${tableID}/removeRow`, {
            method: "POST",
        });

        mutate(`/api/sheets/${tableID}`);
    };

    const handleRemoveColumn = async () => {
        await fetcher(`/api/sheets/${tableID}/removeColumn`, {
            method: "POST",
        });

        mutate(`/api/sheets/${tableID}`);
    };

    return (
        <div>
            <Head>
                <title>SingleStore Zero - {tableID.split("_").join(" ")}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Start editing!</h1>
            <p>
                <button onClick={handleAddRow}>Add row</button>
                <button onClick={handleAddColumn}>Add column</button>
                <button onClick={handleRemoveRow}>Remove row</button>
                <button onClick={handleRemoveColumn}>Remove column</button>
            </p>
            <Grid data={data} onChange={handleChange} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const tableID = Array.isArray(params.id) ? params.id[0] : params.id;
    let rows: any;

    try {
        [rows] = await pool.execute(
            `SELECT * FROM ${tableID} ORDER BY id ASC LIMIT 100;`
        );

        return {
            props: {
                rows: JSON.stringify(rows),
                tableID,
            },
        };
    } catch (e) {
        console.error(e);
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
};
