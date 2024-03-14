import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import OCList from "@/components/OC/OCList";
import constants from "@/lib/constants";
import Link from "next/link";

const registerHack = (props) => {
  return (
    <div>
      If you're not automatically redirected, click{" "}
      <Link href="https://23hwluavhxm.typeform.com/to/soFquyrF">here</Link>
    </div>
  );
};

export default registerHack;

export async function getServerSideProps(context) {
  let session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  session = JSON.parse(JSON.stringify(session));

  const currentRole = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/currentRole`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id }),
    }
  );

  const roleData = await currentRole.json();
  console.log("roleData");
  console.log(roleData);

  if (roleData?.role !== constants.roles.COMMUNITY_ADMIN) {
    return {
      redirect: {
        destination: "/home",
        permanent: true,
      },
    };
  }

  return {
    redirect: {
      destination: "https://23hwluavhxm.typeform.com/to/soFquyrF",
      permanent: true,
    },
  };
}
