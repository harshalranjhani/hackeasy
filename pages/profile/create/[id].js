import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";

const Profile = (props) => {
  const [name, setName] = useState("");
  const [gitHubLink, setGitHubLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [proofOfWork, setProofOfWork] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/user/create-profile", {
      method: "POST",
      body: JSON.stringify({
        name,
        gitHubLink,
        linkedInLink,
        specialization,
        proofOfWork,
        userId: props.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    if(data.success) {
        window.location.href = `/profile/${props.id}`;
    } else {
        toast.error(data.message)
    }
  };

  return (
    <div>
      {/* user profile creation page */}
    <form onSubmit={handleSubmit} style={{ margin: "1rem", display: "flex", flexDirection: "column" }}>
    <label style={{ margin: "1rem" }}>
        Name:
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label style={{ margin: "1rem" }}>
        Github:
        <input
          type="text"
          name="gitHubLink"
          onChange={(e) => {
            setGitHubLink(e.target.value);
          }}
        />
      </label>
      <label style={{ margin: "1rem" }}>
        LinkedIn:
        <input
          type="text"
          name="linkedInLink"
          onChange={(e) => {
            setLinkedInLink(e.target.value);
          }}
        />
      </label>
      {/* drop down for specialization */}
      <label style={{ margin: "1rem" }}>
        Specialization:
        <select
          name="specialization"
          onChange={(e) => {
            setSpecialization(e.target.value);
          }}
        >
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Fullstack</option>
          <option value="devops">Devops</option>
          <option value="testing">Testing</option>
          <option value="mobile">Mobile</option>
          <option value="uiux">UI/UX</option>
          <option value="ai">AI</option>
          <option value="ml">ML</option>
          <option value="cloud">Cloud</option>
          <option value="blockchain">Blockchain</option>
          <option value="security">Security</option>
          <option value="game">Game</option>
          <option value="data">Data</option>
          <option value="iot">IOT</option>
          <option value="arvr">AR/VR</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label style={{ margin: "1rem" }}>
        Proof of Work:
        <input
          type="text"
          name="proofOfWork"
          onChange={(e) => {
            setProofOfWork(e.target.value);
          }}
        />
      </label>

      <button type="submit">Submit</button>
    </form>

    <p>Signed in as {props.email}</p>
    </div>
  );
};

export default Profile;

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

  if (session?.user?.id !== context.params.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      email: session.user.email,
      //   user: user || null,
      id: session.user.id,
    },
  };
}
