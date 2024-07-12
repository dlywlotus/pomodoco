import { useEffect, useState } from "react";
import { user } from "../pages/Main";
import styles from "../styles/Header.module.css";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

type props = {
  user: user;
  setIsShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ user, setIsShowDashboard }: props) {
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const goToAuth = async () => {
    if (user) {
      let { error } = await supabase.auth.signOut();
      if (error) return console.log(error);
    }
    navigate("/login");
  };

  useEffect(() => {
    const onResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [setScreenWidth]);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        Pomo<span>doco</span>
      </div>
      <div className={styles.nav}>
        <button onClick={() => setIsShowDashboard(true)}>
          {screenWidth < 600 ? (
            <i className='fa-solid fa-table-columns'></i>
          ) : (
            "Dashboard"
          )}
        </button>
        <button onClick={goToAuth} className={styles.btn_logout}>
          {screenWidth < 600 ? (
            user.id === "" ? (
              <i className='fa-solid fa-right-to-bracket'></i>
            ) : (
              <i className='fa-solid fa-right-from-bracket'></i>
            )
          ) : user.id === "" ? (
            "Log in"
          ) : (
            "Log out"
          )}
        </button>
      </div>
    </div>
  );
}
