import Authentication from "../components/Authentication";
import AuthGraphic from "../components/AuthGraphic";
import styles from "../styles/Login.module.css";

export default function Login() {
  return (
    <div className={styles.backdrop}>
      <div className={styles.auth_modal}>
        <AuthGraphic />
        <Authentication />
      </div>
    </div>
  );
}
