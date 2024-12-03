import styles from "../styles/Dashboard.module.css";
import { user } from "../pages/Main";
import { forwardRef, useEffect } from "react";
import { week } from "../types";
import Chart from "./Chart";
import FocusStatistics from "./FocusStatistics";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import supabase from "../supabase";

type props = {
  user: user;
  currentWeek: week;
  setIsShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  prevWeek: week;
  setCurrentWeek: React.Dispatch<React.SetStateAction<week>>;
  setPrevWeek: React.Dispatch<React.SetStateAction<week>>;
  setUser: React.Dispatch<React.SetStateAction<user>>;
};

export default forwardRef(function Dashboard(
  {
    user,
    setUser,
    currentWeek,
    setIsShowDashboard,
    prevWeek,
    setCurrentWeek,
    setPrevWeek,
  }: props,
  ref
) {
  useEffect(() => {
    const onOpen = async () => {
      if (user.id === "") return;

      const date = dayjs();
      const prevLogDate = dayjs(user.prev_log);
      const currentDate = dayjs().format("YYYY-MM-DD");
      const daysSincePrevLog = date.diff(prevLogDate ?? currentDate, "day");
      const startOfWeek = date.startOf("isoWeek");
      const formattedStartOfWeek = startOfWeek.format("YYYY-MM-DD");

      //Reset streak if needed
      if (daysSincePrevLog > 1) {
        const { error: error1 } = await supabase
          .from("users")
          .update({ streak_start: null, prev_log: null })
          .eq("id", user.id);
        if (error1) throw new Error(`${error1.message}`);
        setUser(user => {
          return { ...user, streak_start: null, prev_log: null };
        });
      }

      //sync week if needed
      if (currentWeek.first_day_date !== formattedStartOfWeek) {
        const { data: currentWeekData, error: error4 } = await supabase
          .from("weekly_log")
          .insert([{ user_id: user.id, first_day_date: formattedStartOfWeek }])
          .select();
        if (error4) throw new Error(`${error4.message}`);
        setPrevWeek(currentWeek);
        setCurrentWeek(currentWeekData[0]);
      }
    };

    onOpen();
  }, [currentWeek, setCurrentWeek, setPrevWeek, user, setUser]);

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
