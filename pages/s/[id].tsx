import fetch from "@src/utils/fetch";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

type Props = {
  id: string;
};

export default function Sheet({ id }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <div>Show sheet {id}</div>;
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch("/api/sheets/");
  const sheets = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = sheets.map((sheet) => ({
    params: { id: String(sheet.id) },
  }));

  // We'll pre-render only these paths at build time.
  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`/api/sheets/${params.id}`);

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
  const data = await res.json();

  console.log(data);

  return {
    props: {
      id: params.id,
    },
  };
};
