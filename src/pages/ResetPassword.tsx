import styles from "../styles/ResetPassword.module.css";
import { useState } from "react";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState({ password1: "", password2: "" });
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const showError = (errorMessage: string) => {
    setIsShowMessage(true);
    setMessage(errorMessage);
    setTimeout(() => setIsShowMessage(false), 2000);
  };

  const resetPassword = async () => {
    if (newPassword.password1 !== newPassword.password2) {
      return showError("Passwords do not match");
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword.password1,
    });
    if (error) showError(error.message);
    else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.logo}>
          Pomo<span>doco</span>
        </div>
        <div className={styles.title}>Password reset</div>
        <label>
          <input
            type='password'
            value={newPassword.password1}
            placeholder='New password'
            onChange={e =>
              setNewPassword({ ...newPassword, password1: e.target.value })
            }
          />
        </label>
        <label>
          <input
            type='password'
            value={newPassword.password2}
            placeholder='New password'
            onChange={e =>
              setNewPassword({ ...newPassword, password2: e.target.value })
            }
          />
        </label>
        <button className={styles.btn_reset} onClick={resetPassword}>
          Reset password
        </button>
        <div className={styles.message} data-hidden={!isShowMessage}>
          {message}
        </div>
      </div>
    </div>
  );
}
