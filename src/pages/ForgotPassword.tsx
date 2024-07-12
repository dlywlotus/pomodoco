import styles from "../styles/ForgotPassword.module.css";
import supabase from "../supabase";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const sendResetLink = async () => {
    setIsShowMessage(true);
    setMessage("Sending recovery link...");
    let { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset_password",
    });
    if (error) {
      setMessage("The email is invalid.");
    } else {
      setMessage("The revovery link has been sent.");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.logo}>
          Pomo<span>doco</span>
        </div>
        <div className={styles.title}>Account recovery</div>
        <input
          type='email'
          className={styles.email_input}
          placeholder='your_email@email.com'
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className={styles.btn_send} onClick={sendResetLink}>
          Send reset link
        </button>
        <div className={styles.message} data-hidden={!isShowMessage}>
          {message}
        </div>
      </div>
    </div>
  );
}
