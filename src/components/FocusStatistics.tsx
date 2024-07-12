import styles from "../styles/FocusStatistics.module.css";
import { user } from "../pages/Main";
import { week } from "../types";
import dayjs from "dayjs";

type props = {
  user: user;
  currentWeek: week;
};

export default function FocusStatistics({ user, currentWeek }: props) {
  const today = dayjs().format("ddd").toLocaleLowerCase();
  const todayTimeInMinutes = Number(currentWeek[today as keyof week]);

  const prevLogDate = dayjs(user.prev_log);
  const streak = prevLogDate.diff(user.streak_start, "day") + 1;

  const toHoursAndMinutes = (timeInMinutes: number) => {
    const hours = Math.trunc(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours} h ${minutes} min`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.statistic}>
        <div className={styles.stat_title}>Focus time today</div>
        <div className={styles.stat_value}>
          {toHoursAndMinutes(todayTimeInMinutes)}
        </div>
      </div>
      <div className={styles.statistic}>
        <div className={styles.stat_title}>Total focus time</div>
        <div className={styles.stat_value}>{toHoursAndMinutes(user.total_time)}</div>
      </div>
      <div className={styles.statistic}>
        <div className={styles.stat_title}>Focus streak</div>
        <div className={styles.stat_value}>
          {streak} {streak === 1 ? "day" : "days"}
        </div>
      </div>
    </div>
  );
}
