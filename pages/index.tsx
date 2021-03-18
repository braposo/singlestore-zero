import Head from "next/head";
import styles from "@src/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SingleStore Zero</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to SingleStore Zero</h1>
        <Link href="/create">Create new sheet</Link>
      </main>
    </div>
  );
}
