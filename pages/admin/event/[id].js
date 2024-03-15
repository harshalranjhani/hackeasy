import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";

const eventpage = (props) => {
  return (
    <div>
      <ul>
        <li>Project Count: {props.dashboard.projectCount}</li>
        <li>Team Count: {props.dashboard.teamCount}</li>
        <li>Projects to be reviewed: {props.dashboard.teamsToBeReviewed}</li>
      </ul>
    </div>
  );
};

export default eventpage;

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

  const dashboardData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/events/admin/dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: session.user.id, eventId: context.params.id }),
  });

  const dashboardDataJSON = await dashboardData.json();

  console.log(dashboardDataJSON);

  return {
    props: {
      session,
      email: session.user.email,
      dashboard: dashboardDataJSON?.data || null,
      id: session.user.id,
    },
  };
}
