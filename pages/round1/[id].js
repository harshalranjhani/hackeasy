import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import constants from "@/lib/constants";
import HackPage from "@/components/Hack/HackPage";

const Team = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [extraLinks, setExtraLinks] = useState("");
  const [techStack, setTechStack] = useState("");
  const [futureProspects, setFutureProspects] = useState("");

  const submitIdea = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !githubLink ||
      !figmaLink ||
      !techStack ||
      !futureProspects
    ) {
      toast.error("please fill out all the fields!");
      return;
    }

    console.log("sdfnoiudifioub")

    const response = await fetch("/api/round2/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title, 
        description,
        githubLink,
        figmaLink,
        extraLinks,
        techStack,
        futureProspects,
        projectId: props.projectId,
        eventId: props.eventId,
      }),
    });

    const data = await response.json();
    console.log(data)
    if(data.success) {
        toast.success("Submitted!")
    } else {
        toast.error(data.message)
    }

  };

  return (
    <div style={{ margin: "1rem" }}>
      <h1>Submit your idea</h1>
      <form
        onSubmit={submitIdea}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label style={{ margin: "1rem" }}>
          Project title:
          <input
            type="text"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label style={{ margin: "1rem" }}>
          Project Description:
          <input
            type="text"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label style={{ margin: "1rem" }}>
          Github Link:
          <input
            type="text"
            name="ghLink"
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </label>
        <label style={{ margin: "1rem" }}>
          Figma Link:
          <input
            type="text"
            name="figmaLink"
            onChange={(e) => setFigmaLink(e.target.value)}
          />
        </label>
        <label style={{ margin: "1rem" }}>
          Any Extra Links:
          <input
            type="text"
            name="extraLinks"
            onChange={(e) => setExtraLinks(e.target.value)}
          />
        </label>
        <label style={{ margin: "1rem" }}>
          Tech Stack:
          <input
            type="text"
            name="techStack"
            onChange={(e) => setTechStack(e.target.value)}
          />
        </label>
        <label style={{ margin: "1rem" }}>
          Future Prospects:
          <input
            type="text"
            name="fp"
            onChange={(e) => setFutureProspects(e.target.value)}
          />
        </label>
        <button type="submit">Submit!</button>
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

  // get the projectId from the /:id field
  const projectId = context.params.id;
  const eventId = context.query.eventId;

  if (!projectId || !eventId) {
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

  // check if teamMembers contains the user
  console.log(teamData.team.teamId.teamMembers.includes(session.user.id));
  // if (!teamData.team.teamMembers.includes(session.user.id)) {
  //   return {
  //     redirect: {
  //       destination: `${process.env.NEXT_PUBLIC_URL}/event/${eventId}`,
  //       permanent: true,
  //     },
  //   };
  // }

  return {
    props: {
      session,
      email: session.user.email,
      id: session.user.id,
      projectId: projectId,
      eventId: eventId,
    },
  };
}
