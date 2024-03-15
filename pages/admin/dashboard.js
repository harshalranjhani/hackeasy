import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";

const dashboard = (props) => {
  return (
    <div>
      dashboard
      <div style={{ margin: "1rem" }}>
        <h2>Events</h2>
        {props.events.map((event) => {
          return (
            <>
              <Link href={`/admin/event/${event._id}`}>
                <div key={event._id}>
                  <h3>{event.name}</h3>
                  <p>{event.eventDescription}</p>
                  <p>{event.eventDate}</p>
                  <p>{event.eventExpireDate}</p>
                  <p>{event.noOfParticipants}</p>
                  <p>{event.eventType}</p>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default dashboard;

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

  const events = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/events/getAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: session.user.id }),
  });

  const eventData = await events.json();

  console.log(eventData);

  return {
    props: {
      session,
      email: session.user.email,
      events: eventData?.events || null,
      id: session.user.id,
    },
  };
}
