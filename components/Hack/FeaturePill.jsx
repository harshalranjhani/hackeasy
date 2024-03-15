import React from "react";
import styles from "./HackCard.module.css";
import { FaRupeeSign } from "react-icons/fa";
import { MdGroups3 } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";

const icons = {
  "rupee": <FaRupeeSign />,
  "team": <MdGroups3 />,
  "time": <CiClock2 />
}

const FeaturePill = ({pill}) => {
  return (
    <div className={styles["feature-pill-parent"]}>
      <div className={styles["feature-pill-icon"]}>
        {icons[pill?.icon] || icons["rupee"]}
      </div>
      <div className={styles["feature-pill-span"]}>{pill?.heading || "Prize pool"}</div>
      <div className={styles["prize-pool-value"]}>{pill?.value || '1 Lakh'}</div>
    </div>
  );
};

export default FeaturePill;
