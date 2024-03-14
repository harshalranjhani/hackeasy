import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { uiActions } from "@/utils/store/ui-slice";
import { useDispatch } from "react-redux";
import styles from "./Auth.module.css";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Toggle from "react-toggle";
import constants from "@/lib/constants";
const googleLogo = "/assets/google.svg";

const Signup = ({ queryData }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const [signingAsOC, setSigningAsOC] = useState(false);
  const [signingAsAdmin, setSigningAsAdmin] = useState(false);

  useEffect(() => {
    if (queryData !== null) {
      setEmail(queryData?.email);
    }
  }, [queryData]);

  async function submitHandler(e) {
    e.preventDefault();
    // toggle loader
    dispatch(uiActions.toggleLoading());

    const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,7}$/;

    // validate
    if (!emailFormat.test(email)) {
      toast.error("Enter valid email!");
      dispatch(uiActions.toggleLoading());
      return;
    }

    // check if email contains capital letters
    if (/[A-Z]/.test(email)) {
      // convert to lowercase
      setEmail(email.toLowerCase());
    }

    if (!email || !email.includes("@") || password.length < 6 || !name) {
      toast.error("Invalid details!");
      dispatch(uiActions.toggleLoading());
      return;
    }

    const data = {
      name,
      email: email.toLowerCase(),
      password,
      role: signingAsOC
        ? constants.roles.OC
        : signingAsAdmin
        ? constants.roles.COMMUNITY_ADMIN
        : constants.roles.USER,
    };

    const url = "/api/auth/signup";

    // POST form values
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    // toggle loader
    dispatch(uiActions.toggleLoading());

    if (response.message === "AlreadyUser") {
      setEmailError("Log In to Continue, user already exists");
    } else {
      // alert(response.message);
      toast.info(response.message);
    }

    if (res.status === 201) {
      if (queryData !== null) {
        window.location.href = "/login";
        return;
      }
      dispatch(uiActions.setSignUp());
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
    <section className={styles["signup-section"]}>
      <div className={styles["login-container"]}>
        <div className={styles["form-container"]}>
          <div className={styles["form-heading"]}>Create an Account</div>
          <form className={styles["login-form"]} onSubmit={submitHandler}>
            <div style={{ width: "100%" }}>
              <div className={styles["form-label"]}>Name</div>
              <input
                required
                type="text"
                className={styles["form-input"]}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className={styles["form-label"]}>Email</div>
              <input
                disabled={queryData !== null}
                required
                type="email"
                autoComplete="off"
                maxLength={48}
                className={`${styles["form-input"]} ${
                  emailError && styles["form-input-error"]
                }`}
                placeholder="you@example.com"
                value={email || queryData?.email}
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
                  autoComplete="off"
                  type={passwordType}
                  maxLength={72}
                  className={styles["form-input"]}
                  placeholder="Enter at least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pattern="^.{6,}$"
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
            </div>
            <button
              type="submit"
              className={`${styles["form-buttons"]} ${styles.signup}`}
            >
              {queryData !== null ? "Activate" : "Sign up"}
            </button>
            {queryData === null && (
              <>
                {" "}
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
                  <img src={googleLogo} />
                  Sign up
                </button>
              </>
            )}
          </form>
          <Toggle
            id="signing-in-as-oc"
            defaultChecked={setSigningAsOC}
            value={signingAsOC}
            onChange={() => {
              if (signingAsAdmin && signingAsOC) {
                toast.error("You can't sign in as OC and Community admin");
                return;
              }
              setSigningAsOC(!signingAsOC);
            }}
          />
          <label htmlFor="signing-in-as-oc">Signing In as OC</label>
          <Toggle
            id="signing-in-as-admin"
            defaultChecked={setSigningAsAdmin}
            value={signingAsAdmin}
            onChange={() => {
              if (signingAsAdmin && signingAsOC) {
                toast.error("You can't sign in as OC and Community admin");
                return;
              }
              setSigningAsAdmin(!signingAsAdmin);
            }}
          />
          <label htmlFor="signing-in-as-admin">
            Signing In as Community admin
          </label>

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
          {queryData === null && (
            <p className={styles["already-label"]}>
              Already have an account?{" "}
              <a
                onClick={() => {
                  dispatch(uiActions.setSignUp());
                }}
              >
                Log in
              </a>
            </p>
          )}
          {queryData !== null && (
            <p className={styles["already-label"]}>
              Already activated?{" "}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/login">Log in</a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Signup;
