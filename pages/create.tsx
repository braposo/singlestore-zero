import fetch from "@src/utils/fetch";
import { GetStaticProps } from "next";

export default function Create() {
  return <div>Error creating new sheet</div>;
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("/api/create");
  const data = await res.json();

  if (data.id) {
    return {
      redirect: {
        destination: `/s/${data.id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
