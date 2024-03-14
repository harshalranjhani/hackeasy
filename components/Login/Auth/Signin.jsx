import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { uiActions } from "@/utils/store/ui-slice";
import { useDispatch } from "react-redux";

import { signIn } from "next-auth/react";
import styles from "./Auth.module.css";
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import ModalComponent from "./ForgotPassword/ForgotPassword";
const googleLogo = "/assets/google.svg";
const facebookLogo = "/assets/facebook.svg";
const spotifyLogo = "/assets/spotify.svg";
const instagramLogo = "/assets/instagram.svg";
const navLogo = "/assets/navLogo.svg";

const Signin = ({ requestedUrl }) => {
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch(uiActions.setFPModalState({ value: true }));
  };

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function submitHandler(e) {
    e.preventDefault();
    // toggle loader
    dispatch(uiActions.toggleLoading());

    // check if email contains capital letters
    if (/[A-Z]/.test(email)) {
      // convert to lowercase
      setEmail(email.toLowerCase());
    }

    const res = await signIn("credentials", {
      redirect: false,
      email: email.toLowerCase(),
      password,
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/home`,
    });

    // toggle loader
    dispatch(uiActions.toggleLoading());

    if (res.status === 200) {
      router.push(res.url);
    } else {
      if (res.error === "AccessDenied") {
        setEmailError("Email not Verified");
      } else if (res.error === "NoUser") {
        setEmailError("Sign Up to Continue, user doesn't exist");
      } else if (res.error === "WrongPassword") {
        setPasswordError("Invalid Credentials");
      } else {
        toast.error(res.error);
        // alert(res.error);
      }
    }
  }

  function togglePasswordType() {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  }

  return (
    <>
      <ModalComponent />
      <section className={styles["signin-section"]}>
        <div className={styles["login-container"]}>
          <div className={styles["form-container"]}>
            {/* <div className={styles["form-heading"]}>
              <img src={navLogo} alt="nav logo" />
            </div> */}
            <form className={styles["login-form"]} onSubmit={submitHandler}>
              <div style={{ width: "100%" }}>
                <div className={styles["form-label"]}>Username or Email</div>
                <input
                  required
                  type="email"
                  autoComplete="username"
                  maxLength={48}
                  className={`${styles["form-input"]} ${emailError && styles["form-input-error"]
                    }`}
                  placeholder="Username or Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                <div className={styles["form-error"]}>{emailError}</div>
                <div className={styles["form-label"]}>Password</div>
                <div className={styles["password-container"]}>
                  <input
                    required
                    autoComplete="current-password"
                    type={passwordType}
                    maxLength={72}
                    className={`${styles["form-input"]} ${passwordError && styles["form-input-error"]
                      }`}
                    placeholder="Enter at least 6 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />

                  {passwordType === "password" ? (
                    <AiOutlineEye
                      className={styles["eye-icon"]}
                      onClick={togglePasswordType}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className={styles["eye-icon"]}
                      onClick={togglePasswordType}
                    />
                  )}
                </div>
                <div className={styles["form-error"]}>{passwordError}</div>
              </div>
              <div className={styles["forgot-pass"]} onClick={openModal}>
                <a>Forgot your password?</a>
              </div>
              <button
                type="submit"
                className={`${styles["form-buttons"]} ${styles.login}`}
              >
                Log In
              </button>
              <div className={styles["social-progress"]}>
                <hr />
                <p>or continue with</p>
                <hr />
              </div>
              <button
                type="button"
                className={`${styles["form-buttons"]} ${styles["social-form-button"]}`}
                onClick={() => {
                  signIn("google", {
                    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/home`,
                  });
                }}
              >
                <img src={googleLogo} alt="google" />
                Log in
              </button>
            </form>
            <p className={styles["no-acc-label"]}>
              Don&apos;t have an account?{" "}
              <a
                onClick={() => {
                  dispatch(uiActions.setSignUp());
                }}
              >
                Sign up
              </a>
            </p>
            <p className={styles.terms}>
              By continuing, you agree to our{" "}
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href="/terms-of-service"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href="/acceptable-use-policy"
              >
                Acceptable Use Policy
              </Link>{" "}
              and{" "}
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
