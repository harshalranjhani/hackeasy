import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import constants from "@/lib/constants";
import HackPage from "@/components/Hack/HackPage";

const Team = (props) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  const createTeam = async (e) => {
    e.preventDefault();
    const teamData = {
      name: teamName,
      teamDescription: teamDescription,
      teamLead: props.id,
      eventId: props.eventId,
    };

    const response = await fetch("/api/team/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamData),
    });
    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Team created successfully");
      window.location.href = `/event/${props.eventId}`;
    }
  };

  return (
    <div>
      <h1>Create a New Team</h1>
      <form onSubmit={createTeam}>
        <label>
          Team Name:
          <input
            type="text"
            name="teamName"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </label>
        <label>
          Team Description:
          <input
            type="text"
            name="teamDescription"
            onChange={(e) => setTeamDescription(e.target.value)}
          />
        </label>
        <button type="submit">Create!</button>
      </form>
    </div>
  );
};

export default Team;

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

  // get the eventId from query params
  const eventId = context.query.eventId;

  if (!eventId) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  const teamStatus = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/team/teamStatus`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id, eventId: eventId }),
    }
  );
  const teamData = await teamStatus.json();

  //   if(teamData.team.eventId === eventId) {
  //     return {
  //       redirect: {
  //         destination: `${process.env.NEXT_PUBLIC_URL}/event/${eventId}`,
  //         permanent: true,
  //       },
  //     };
  //   }

  return {
    props: {
      session,
      email: session.user.email,
      id: session.user.id,
      eventId: eventId,
    },
  };
}
