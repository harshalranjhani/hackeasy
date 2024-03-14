import React from "react";
import styles from "./AuthNav.module.css";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "@/utils/store/ui-slice";
const navLogo = "/assets/navLogo.svg";
const phoneLogo = "/assets/phoneLogo.svg";
import Link from "next/link";
const AuthNav = ({ queryData }) => {
  const isSignUp = useSelector((state) => state.ui.isSignUp);
  const dispatch = useDispatch();

  return (
    <nav className={"navbar-parent"}>
      {/* <div
        style={{ marginLeft: isPhone ? "0.35rem" : "0" }}
        className={"nav-logo"}
      >
        <Link href="/">
          <img
            src={isPhone ? phoneLogo : navLogo}
            alt="navLogo"
            height={isPhone ? 40 : 60}
          />
        </Link>
      </div> */}
      
      <div className={styles["nav-items"]}>
        <Link href={"/#features"}>Product</Link>
        {/* <a>Blog</a> */}
        {queryData === null && (
          <a
            onClick={() => {
              dispatch(uiActions.setSignUp());
            }}
          >
            {!isSignUp ? "Sign Up" : "Log In"}
          </a>
        )}
      </div>
      {queryData === null && (
        <div className={styles["nav-buttons"]}>
          <button className={styles["signup-button"]}>
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default AuthNav;
