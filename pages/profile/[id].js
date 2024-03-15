import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";

const profile = (props) => {
  return (
    <div>
      {props?.user?.user?.proofOfWork ? (
        <div>
          <h2>Profile</h2>
          <h4>Name: {props?.user?.user?.name}</h4>
          <h4>Email: {props?.user?.user?.email}</h4>
          <p>Role: {props?.user?.user?.role}</p>
          <p>GitHub: {props?.user?.user?.gitHubLink}</p>
          <p>LinkedIn: {props?.user?.user?.linkedInLink}</p>
          <p>Specialization: {props?.user?.user?.specialization}</p>
          <p>Proof of Work: {props?.user?.user?.proofOfWork}</p>
        </div>
      ) : (
        <Link href={`/profile/create/${props.id}`}>Create Profile</Link>
      )}
    </div>
  );
};

export default profile;

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

  const userProfile = await fetch("http://localhost:3000/api/user/getProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: session.user.id }),
  });

  const user = await userProfile.json();

  return {
    props: {
      session,
      email: session.user.email,
      user: user || null,
      id: session.user.id,
    },
  };
}
