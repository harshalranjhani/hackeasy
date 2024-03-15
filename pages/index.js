import Head from "next/head";

import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";

export default function Home({ articles }) {
  useEffect(() => {
    Aos.init({ duration: 800, mirror: true });
  }, []);

  return (
    <>
      <Head>
        {/* <!-- Primary Meta Tags --> */}
        <title>HackEasy</title>
        <meta name="title" content="HackEasy" />
        <meta name="description" content="HackEasy" />
      </Head>

      <Navbar />
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/home",
      permanent: true,
    },
  };
}
