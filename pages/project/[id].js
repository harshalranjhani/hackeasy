import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import constants from "@/lib/constants";
import HackPage from "@/components/Hack/HackPage";

const Event = (props) => {
  const reject = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/events/admin/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: props.id,
          projectId: props.project._id,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      window.location.href = `/event/admin/${props.project.eventId}`;
    } else {
      toast.error("An error occurred while processing your request.");
    }
  };

  console.log(props);
  return (
    <div>
      <h1>{props?.project?.title}</h1>
      <p>{props?.project?.description}</p>

      <Link href={props?.project?.githubLink || ""}>Github</Link>
      <Link href={props?.project?.figmaLink}>Figma Link</Link>
      <p>Extra Links: {props?.project?.extraLinks}</p>
      <p>Project TechStack: {props?.project?.techStack}</p>

      {props?.project?.panelId && <p>Panel Initiated</p>}
      {!props?.project?.panelId && <button>Initiate Panels</button>}
      <button onClick={reject}>Reject</button>
    </div>
  );
};

export default Event;

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
  const projectId = context.params.id;

  const project = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/events/admin/getProject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id, projectId: projectId }),
    }
  );
  const projectData = await project.json();

  if (!projectData.success) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  console.log(projectData);

  return {
    props: {
      session,
      email: session.user.email,
      project: projectData.data || null,
      id: session.user.id,
    },
  };
}
