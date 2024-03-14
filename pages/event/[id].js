import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import constants from "@/lib/constants";

const event = (props) => {
  return (
    <div>
      <h1>Event Name: {props?.event?.name}</h1>

      {props.team ? (
        <div>
          <h2>Team Name: {props?.team?.teamId?.name}</h2>
          <h2>Team Status: {props?.team?.teamId?.status}</h2>
          <h2>Team Code: {props?.team?.teamId?.teamCode}</h2>
        </div>
      ) : (
        <div>
          <h2>Team Name: Not yet registered</h2>
          <h2>Team Status: Not yet registered</h2>
        </div>
      )}

      {props?.team?.teamId?.teamLead === props.id && (
        <div>You are the team Leader</div>
      )}
      {/* check the team members array for userId, if present, display team member status */}
      {props?.team?.teamId?.teamMembers.map((member) => {
        if (member._id === props.id) {
          return <div key={member._id}>You are a member</div>;
        }
      })}

      {props?.team?.teamId?.teamMembers?.length === 0 && (
        <div>No team members</div>
      )}

      {/* List out the team leader and the team member names */}
      {props?.team?.teamId?.teamMembers.map((member) => {
        return (
          <div key={member._id}>
            {member.name} - {member.email}
          </div>
        );
      })}
      {!props?.team && <button>Create Team Now</button>}
    </div>
  );
};

export default event;

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

  // if (session?.user?.role !== constants.roles.USER) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: true,
  //     },
  //   };
  // }
  // get the event id from the context
  const eventId = context.params.id;

  const event = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/events/getEvent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId: eventId, userId: session.user.id }),
    }
  );
  const eventData = await event.json();
  console.log(eventData, "eventData");

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
  console.log(teamData, "teamData");

  return {
    props: {
      session,
      email: session.user.email,
      event: eventData.event || null,
      team: teamData.team || null,
      id: session.user.id,
    },
  };
}
