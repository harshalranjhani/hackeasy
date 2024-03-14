import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@/utils/store/ui-slice";
import styles from "./ForgotPassword.module.css";
import { toast } from "react-toastify";
import { useState } from "react";
const crossIcon = "/assets/crossIcon.svg";

const ModalComponent = () => {
  const isFPModalOpen = useSelector((state) => state.ui.isFPModalOpen);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const closeModal = () => {
    dispatch(uiActions.setFPModalState({ value: false }));
  };

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(uiActions.toggleLoading());

    // validate
    if (!email || !email.includes("@")) {
      // alert('Invalid details')
      toast.error("Invalid details!");
      dispatch(uiActions.toggleLoading());
      return;
    }

    const data = {
      email,
    };

    // POST form values
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await res.json();

    if (response.message === "NoUser") {
      setEmailError("User does not exist");
    } else {
      // alert(response.message);
      toast.info(response.message);
    }

    if (res.status === 201) {
      setEmail("");
      closeModal();
    }
    dispatch(uiActions.toggleLoading());
  }

  return (
    <Modal
      isOpen={isFPModalOpen}
      onRequestClose={closeModal}
      className="modal-custom"
      overlayClassName="overlay"
    >
      <div className={styles.overlay}>
        <div className={styles["modal-parent"]}>
          <div className={styles.modal}>
            <div className={styles["modal-header"]}>
              <div className={styles["modal-header-text"]}>Password Reset</div>
              <div
                className={styles["modal-header-close"]}
                onClick={closeModal}
              >
                <img src={crossIcon} width={16} height={16} />
              </div>
            </div>
            <div className={styles["modal-description"]}>
              Enter the email address you used to sign up to HackEasy. We will
              send you a new password which you can change later.
            </div>
            <form
              className={styles["modal-input-parent"]}
              onSubmit={submitHandler}
            >
              <div className={styles["modal-input-label"]}>
                Username or Email
              </div>
              <input
                type="email"
                className={`${styles["modal-input"]} ${emailError && styles["form-input-error"]
                  }`}
                placeholder="Username or Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              <div className={styles["form-error"]}>{emailError}</div>
              <button className={styles["modal-input-button"]} type="submit">
                Send password reset email
              </button>
            </form>
            <div className={styles["modal-footer"]}>
              <div className={styles["modal-footer-text"]}>
                Signed up with Google ?
              </div>
              <div className={styles["modal-footer-subtext"]}>
                Then we can’t reset your password here. You should log in using
                the same 3rd party application you signed up with.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
