import styles from "./Navbar.module.css";
import { useState, useLayoutEffect } from "react";
import Link from "next/link";
const navLogo = "/assets/navLogo.svg";
const phoneLogo = "/assets/phoneLogo.svg";

import { useSession } from "next-auth/react";
import { uiActions } from "@/utils/store/ui-slice";
import { useDispatch } from "react-redux";
import NavbarOptions from "./NavbarOptions/NavbarOptions";
const productOptionsData = []
const companyOptionsData  = []
const resourcesOptionsData  = []

const Navbar = ({ isOnExplore }) => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isSmallPhone, setIsSmallPhone] = useState(false);
  const dispatch = useDispatch();

  function toggleMobileNavHandler(e) {
    setIsOpen((prevState) => !prevState);
  }

  const handleResize = useLayoutEffect(() => {
    const updateWindowSize = () => {
      setIsPhone(window.innerWidth < 1000);
      setIsSmallPhone(window.innerWidth < 500);
    };

    updateWindowSize();

    window.addEventListener("resize", updateWindowSize);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  return (
    <>
      <nav className={`navbar-parent ${styles.nav}`} data-aos="fade-down">
        <div
          style={{ marginLeft: isPhone ? "0.35rem" : "13px" }}
          className={"nav-logo"}
          onClick={() => {
            if (isOnExplore) {
              dispatch(uiActions.toggleSidebar());
            } else {
              // redirect to /
              window.location.href = "/";
            }
          }}
        >
          {/* <Link href="/"> */}
          <img
            src={isPhone ? phoneLogo : navLogo}
            alt="navLogo"
            height={isPhone ? 40 : 60}
          />
          {/* </Link> */}
        </div>
        <div
          className={`${styles["nav-links-container"]} ${
            isOpen && styles.open
          }`}
        >
          <div className={styles.linksContainer}>
            <span className={isOpen ? styles.fade : " "}>
              <NavbarOptions title={"Product"} data={productOptionsData} />
            </span>
            <span className={isOpen ? styles.fade : " "}>
              <Link href={"/pricing"}>Pricing</Link>
            </span>
            <span className={isOpen ? styles.fade : " "}>
              <NavbarOptions title={"Company"} data={companyOptionsData} />
            </span>
            <span
              className={isOpen ? styles.fade : " "}
              onClick={() => {
                // start loader
                // dispatch(uiActions.toggleLoading())
              }}
            >
              <Link href={"/explore"} target="_blank">
                Explore
              </Link>
            </span>
            <span className={isOpen ? styles.fade : " "}>
              <NavbarOptions title={"Resources"} data={resourcesOptionsData} />
            </span>
            {/* <span className={isOpen ? styles.fade : " "}>Blog</span> */}
          </div>
          <div className={styles.buttonsContainer}>
            {!session && (
              <span className={isOpen ? styles.fade : " "}>
                <Link href="/login">
                  <button className={styles["login-button"]} href="#">
                    Log In
                  </button>
                </Link>
              </span>
            )}
            <span className={isOpen ? styles.fade : " "}>
              <Link href="/login">
                <button className={styles["signup-button"]} href="#">
                  <span>
                    {session === null ? `Sign Up - It’s Free` : `Studio`}
                  </span>
                </button>
              </Link>
            </span>
          </div>
        </div>

        <div
          className={`${styles.hamburger} ${isOpen && styles.toggle}`}
          onClick={toggleMobileNavHandler}
        >
          <div className={styles.line1}></div>
          <div className={styles.line2}></div>
          <div className={styles.line3}></div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
