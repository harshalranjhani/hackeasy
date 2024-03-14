import Link from "next/link";
import React from "react";

const OCList = ({ ocList }) => {
  return (
    <div style={{ margin: "1rem" }}>
      <h1>
        <i>List of all OCs</i>
      </h1>
      {ocList?.ocs?.map((oc) => {
        return (
          <div key={oc.id}>
            <h2>{oc.name}</h2>
            <p>{oc.email}</p>
          </div>
        );
      })}
      <Link href="/home">Home</Link>
    </div>
  );
};

export default OCList;
