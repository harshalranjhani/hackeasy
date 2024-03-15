import React from "react";
import HackCard from "./HackCard";
import styles from "./HackPage.module.css";

const HackPage = ({ hackDetails }) => {
  return (
    <div>
      <div className={styles["flex"]}>
        <HackCard hackDetails={hackDetails} />
        <div className={styles["branding"]}></div>
      </div>
      <div className={styles["ctas"]}>
        <button className={styles["cta"]}>JOIN A TEAM</button>
        <button className={styles["cta"]}>HOST A TEAM</button>
      </div>

      <div className={styles["event-description-card"]}>
          <div className={styles["event-description-title"]}>
            Event Description
          </div>
      </div>
    </div>
  );
};

export default HackPage;
