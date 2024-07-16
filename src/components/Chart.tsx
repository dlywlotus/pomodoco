import { useState, useEffect } from "react";
import styles from "../styles/Chart.module.css";
import { week } from "../types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import dayjs from "dayjs";

type props = {
  currentWeek: week;
  prevWeek: week;
};

export default function Chart({ currentWeek, prevWeek }: props) {
  const [unitOfTime, setUnitOfTime] = useState<"hours" | "minutes">("minutes");
  const [isShowChart, setIsShowChart] = useState(false);
  const [activeWeek, setActiveWeek] = useState("currentWeek");

  const week = activeWeek === "currentWeek" ? currentWeek : prevWeek;

  const toHours = (seconds: number) => {
    return Math.round((seconds / 60) * 10) / 10;
  };

  const capitalize = (day: string) => {
    return day[0].toUpperCase() + day.slice(1);
  };

  const data = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => {
    const timeInMinutes = Number(week[day as keyof week]);
    return {
      name: capitalize(day),
      time: isShowChart
        ? unitOfTime === "hours"
          ? toHours(timeInMinutes)
          : timeInMinutes
        : 0,
    };
  });

  const dailyAverage =
    (Math.round(data.reduce((acc, cur) => acc + cur.time, 0) * 10) / 10) * 7;

  const yAxisLabel = `Time (${unitOfTime === "hours" ? "hours" : "minutes"})`;

  const startOfWeek = dayjs(week.first_day_date).format("D MMMM");
  const endOfWeek = dayjs(week.first_day_date).add(6, "day").format("D MMMM");

  useEffect(() => {
    setTimeout(() => setIsShowChart(true), 350);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>Weekly report</div>
        <div className={styles.time_span}>
          <button
            className={styles.btn_prev}
            data-hidden={activeWeek !== "currentWeek"}
            onClick={() => setActiveWeek("prevWeek")}
          >
            <i className='fa-solid fa-chevron-left'></i>
          </button>
          <div>
            {startOfWeek} - {endOfWeek}
          </div>
          <button
            className={styles.btn_next}
            data-hidden={activeWeek !== "prevWeek"}
            onClick={() => setActiveWeek("currentWeek")}
          >
            <i className='fa-solid fa-chevron-right'></i>
          </button>
        </div>
        <div className={styles.time_unit_btns}>
          <button
            className={styles.btn_toggle_unit}
            data-active={unitOfTime === "hours"}
            onClick={() => setUnitOfTime("hours")}
          >
            Hours
          </button>
          <button
            className={styles.btn_toggle_unit}
            data-active={unitOfTime === "minutes"}
            onClick={() => setUnitOfTime("minutes")}
          >
            Minutes
          </button>
        </div>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart data={data} margin={{ top: 24, bottom: 24 }}>
            <XAxis
              dataKey='name'
              label={{
                value: "Day of the week",
                position: "insideBottom",
                dy: 26,
                fontSize: 16,
                fill: "#fcd34d",
              }}
            />
            <YAxis
              dataKey='time'
              label={{
                value: yAxisLabel,
                position: "insideLeft",
                fontSize: 16,
                dy: 42,
                dx: 4,
                fill: "#fcd34d",
                angle: -90,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
                border: "none",
                color: "#fcd34d",
              }}
              cursor={{ fill: "#fcd34d", fillOpacity: ".8" }}
            />
            <Bar dataKey='time' fill='#7c3aed' radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className={styles.daily_average}>
          Daily average:{" "}
          <span>
            {dailyAverage} {unitOfTime}
          </span>
        </div>
      </div>
    </div>
  );
}
