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

    return (
        <div>
            <h1>Title</h1>
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
