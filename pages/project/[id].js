import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import constants from "@/lib/constants";
import HackPage from "@/components/Hack/HackPage";
import axios from "axios";

const Event = (props) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

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

  const handleDownloadReport = async () => {
    try {
      setLoading(true);
      // Make a POST request to your API endpoint
      const response = await axios.post(
        "/api/round3/generateReport",
        {
          query: props?.project?.title,
          idea: props?.project?.description,
        },
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${props?.project?.title}.pdf`);
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(link.href);
      link.parentNode.removeChild(link);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error downloading the report:", error);
    }
  };

  console.log(props);
  return (
    <div style={{ margin: "2rem" }}>
      <h1>{props?.project?.title}</h1>
      <p>{props?.project?.description}</p>

      <Link href={props?.project?.githubLink || ""}>Github</Link>
      <br />
      <Link href={props?.project?.figmaLink}>Figma Link</Link>
      <br />
      <p>Extra Links: {props?.project?.extraLinks}</p>
      <br />
      <p>Project TechStack: {props?.project?.techStack}</p>
      <br />
      {props?.project?.panelId && <p>Panel Initiated</p>}
      <br />
      <button onClick={handleDownloadReport}>Download Report</button>
      {loading && <p style={{ margin: "1rem" }}>Loading...</p>}
      <br />
      <br />
      <br />
      <h4>Comments</h4>
      <div>
        {props.comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.comment}: {comment.userId.name}</p>
          </div>
        ))}
      </div>
      <br />
      <br />
      <h5>Add a new comment</h5>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const comment = e.target.comment.value;
          if (!comment) {
            return;
          }
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/comments/add`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: props.id,
                projectId: props.project._id,
                comment,
              }),
            }
          );
          const data = await response.json();
          if (data.success) {
            window.location.reload();
          } else {
            toast.error("An error occurred while processing your request.");
          }
        }}
      >
        <input
          type="text"
          name="comment"
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <br />
        <button type="submit">Add Comment</button>
      </form>
      <br />
      <br />
      <button onClick={() => signOut()}>Sign Out</button>
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

  const comments = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/comments/get`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: projectId }),
    }
  );

  const commentData = await comments.json();

  console.log(commentData)

  return {
    props: {
      session,
      email: session.user.email,
      project: projectData.data || null,
      id: session.user.id,
      comments: commentData.data || [],
    },
  };
}
