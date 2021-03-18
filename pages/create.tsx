import { pool } from "@src/utils/db";
import { GetStaticProps } from "next";

export default function Create() {
  return <div>Error creating new sheet</div>;
}

export const getStaticProps: GetStaticProps = async () => {
  const [rows] = await pool.execute(
    "select id from notes order by rand() LIMIT 1"
  );

  if (rows[0].id) {
    return {
      redirect: {
        destination: `/s/${rows[0].id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
