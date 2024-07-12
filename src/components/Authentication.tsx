import supabase from "../supabase";
import styles from "../styles/Authentication.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isShowError, setIsShowError] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const flashErrorMessage = () => {
    setIsShowError(true);
    setTimeout(() => setIsShowError(false), 2000);
  };

  const handleLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      console.log(`Login Error: ${error}`);
      flashErrorMessage();
    } else {
      data.session &&
        localStorage.setItem("supabaseAuthToken", data.session.access_token);
      navigate("/");
    }
  };

  const handleSignUp = async () => {
    let { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });
    if (signUpError) {
      console.log(`Sign up Error: ${signUpError}`);
      flashErrorMessage();
    } else {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ id: signUpData.user?.id });
      signUpData.session &&
        localStorage.setItem("supabaseAuthToken", signUpData.session.access_token);
      navigate("/");
      if (insertError) console.log(`Error creating user:${insertError}`);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.secondary_header}>Welcome to</div>
        <div className={styles.primary_header}>Pomodoco</div>
        <div className={styles.label}>Email</div>
        <input
          type='email'
          onChange={e => {
            setInput({ ...input, email: e.target.value });
          }}
          value={input.email}
        />
        <div className={styles.label}>Password</div>
        <input
          type='password'
          onChange={e => {
            setInput({ ...input, password: e.target.value });
          }}
          value={input.password}
        />
        <div
          className={styles.forgot_pw}
          onClick={() => navigate("/forgot_password")}
        >
          forgot password ?
        </div>

        <button
          className={styles.btn_authenticate}
          onClick={isLogin ? handleLogin : handleSignUp}
        >
          {isLogin ? "Log in" : "Sign up"}
        </button>
        <div className={styles.error} data-shown={isShowError}>
          Invalid email or password
        </div>
        {isLogin ? (
          <div className={styles.small_text}>
            Don't have an account ?{" "}
            <span className={styles.link} onClick={() => setIsLogin(false)}>
              Sign up
            </span>
          </div>
        ) : (
          <div className={styles.small_text}>
            Already have an account ?{" "}
            <span className={styles.link} onClick={() => setIsLogin(true)}>
              Log in
            </span>
          </div>
        )}
      </div>
    </>
  );
}
