import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gymmy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h2>Welcome to Gymmy.</h2>
        <p>Need to deploy this properly. Will figure it out tomorrow. Have an assignment due tonight lol - Ahsan</p>
      </div>
    </div>
  );
}
