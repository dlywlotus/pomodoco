import styles from "../styles/Dashboard.module.css";
import { user } from "../pages/Main";
import { forwardRef } from "react";
import { week } from "../types";
import Chart from "./Chart";
import FocusStatistics from "./FocusStatistics";
import { Link } from "react-router-dom";

type props = {
  user: user;
  currentWeek: week;
  setIsShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  prevWeek: week;
};

export default forwardRef(function Dashboard(
  { user, currentWeek, setIsShowDashboard, prevWeek }: props,
  ref
) {
  return (
    <div
      className={styles.dashboard}
      ref={ref as React.LegacyRef<HTMLDivElement> | undefined}
    >
      <div className={styles.header}>
        <div>Dashboard</div>
        <button
          className={styles.btn_exit}
          onClick={() => setIsShowDashboard(false)}
        >
          <i className='fa-solid fa-xmark'></i>
        </button>
      </div>

      <div className={styles.even_columns}>
        {user.id === "" && (
          <div className={styles.overlay}>
            <div className={styles.popup}>
              <Link to='/login'>Log in </Link>to track your progress
            </div>
          </div>
        )}

        <FocusStatistics user={user} currentWeek={currentWeek} />
        <Chart currentWeek={currentWeek} prevWeek={prevWeek} />
      </div>
    </div>
  );
});
