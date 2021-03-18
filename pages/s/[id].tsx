import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { pool } from "@src/utils/db";

type Props = {
  id: string;
  title: string;
};

export default function Sheet({ id, title }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Show sheet {id}: {title}
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  const [sheets] = await pool.execute<any[]>(
    "select id from notes order by updated_at DESC"
  );

  // Get the paths we want to pre-render based on posts
  const paths = sheets.map((sheet) => ({
    params: { id: String(sheet.id) },
  }));

  // We'll pre-render only these paths at build time.
  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [res] = await pool.execute(
    "select * from notes where id = ? LIMIT 1;",
    [params.id]
  );

  if (Array.isArray(res) && res.length === 0) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: res[0].id,
      title: res[0].title,
    },
  };
};
