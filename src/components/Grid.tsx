import ReactDataSheet from "react-datasheet";
import styles from "./Grid.module.css";
import "react-datasheet/lib/react-datasheet.css";

const buildGrid = (rows) => {
    return rows.map((row, index) => {
        const { id, ...cols } = row;
        const isFirstRow = index === 0;

        const entries = Object.entries(cols);

        const values = entries.map(([name, value]) => {
            return { value, name, id, isHeader: isFirstRow ? true : false };
        });

        return [{ value: isFirstRow ? "" : index, readOnly: true }, ...values];
    });
};

type Props = {
    data: any;
    onChange: ReactDataSheet.CellsChangedHandler<any, string>;
};

export function Grid({ data, onChange }: Props) {
    const grid = buildGrid(data);

    return (
        <div className={styles.wrapper}>
            <ReactDataSheet
                data={grid}
                valueRenderer={(cell: any) => {
                    return cell.value;
                }}
                onCellsChanged={onChange}
                className={styles.table}
            />
        </div>
    );
}
