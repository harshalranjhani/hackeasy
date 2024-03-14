import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import OCList from "@/components/OC/OCList";
import constants from "@/lib/constants";

const ocs = (props) => {
  return (
    <>
      <div>
        <OCList ocList={props.ocs} />
      </div>
      <div>
        <button onClick={async (e) => (window.location.href = "/registerHack")}>
          Register your hack!
        </button>
      </div>
    </>
  );
};

export default ocs;

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

  const ocs = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ocs/getAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: session.user.id }),
  });

  const ocsData = await ocs.json();
  //   console.log(ocsData);

  return {
    props: {
      session,
      id: session.user.id,
      ocs: ocsData,
    },
  };
}
