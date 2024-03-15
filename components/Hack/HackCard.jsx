import React from "react";

import styles from "./HackCard.module.css";
import FeaturePill from "./FeaturePill";
import { CiHome } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";


const HackCard = ({ hackDetails }) => {
  console.log(hackDetails);
  return (
    <div className={styles["hack-card-parent"]}>
      <div className={styles["flex"]}>
      <div className={styles["hack-image"]}>
        <img src={hackDetails?.img} alt="hack image"></img>
      </div>
      <div className={styles["pill-container"]}>
        <FeaturePill />
        <FeaturePill />
        <FeaturePill />
      </div>
      </div>
      <div className={styles["hack-card-title"]}>{hackDetails?.name}</div>
      <div className={styles["hack-details"]}>
        <span>
          <CiHome />
          Vellore Institute of Technology (VIT)
        </span>
        <span>
          <CiLocationOn />
          {hackDetails.eventType}
        </span>
        <span>
          <CiClock2 />
            {/* difference between the start and the expiry date in readable format */}
            {hackDetails.eventDate} - {hackDetails.eventExpireDate}
        </span>
      </div>
    </div>
  );
};

export default HackCard;
