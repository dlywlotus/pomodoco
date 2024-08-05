import { useState, useRef, useEffect } from "react";
import styles from "../styles/Pomodoro.module.css";
import TimerNav from "../components/TimerNav";
import Clock from "../components/Clock";
import Controls from "../components/Controls";
import SettingsSlideIn from "../animatedComponents/SettingsSlideIn";
import { user } from "../pages/Main";
import supabase from "../supabase";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { week } from "../types";

dayjs.extend(isoWeek);

export type TimerOptions = "pomodoro" | "shortBreak" | "longBreak";

type props = {
  user: user;
  setUser: React.Dispatch<React.SetStateAction<user>>;
  currentWeek: week;
  setCurrentWeek: React.Dispatch<React.SetStateAction<week>>;
  setPrevWeek: React.Dispatch<React.SetStateAction<week>>;
};

export default function Pomodoro({
  user,
  setUser,
  currentWeek,
  setCurrentWeek,
  setPrevWeek,
}: props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [currentTimerOption, setCurrentTimerOption] =
    useState<TimerOptions>("pomodoro");
  const intervalRef = useRef<any>();

  useEffect(() => {
    let ignore = false;

    const getUserData = async () => {
      try {
        const JWT = localStorage.getItem("supabaseAuthToken") ?? "";

        //get user
        const { data, error: error1 } = await supabase.auth.getUser(JWT);
        if (error1) throw new Error(`${error1.message}`);

        const userId = data.user?.id;
        if (!userId) return;

        //get user data
        const { data: userData, error: error2 } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId);
        if (error2) throw new Error(`${error2.message}`);

        if (ignore) return;

        const [pomodoro, shortBreak, longBreak] = userData?.[0].durations
          .split("#")
          .map((d: string) => Number(d));

        setTimeLeft(pomodoro * 60);
        setUser({
          ...userData?.[0],
          durations: { pomodoro, shortBreak, longBreak },
        });

        const date = dayjs();
        const prevLogDate = dayjs(userData?.[0].prev_log);
        const currentDate = dayjs().format("YYYY-MM-DD");
        const daysSincePrevLog = date.diff(prevLogDate ?? currentDate, "day");

        //Reset streak if needed
        if (daysSincePrevLog > 1) {
          const { error: error1 } = await supabase
            .from("users")
            .update({ streak_start: null, prev_log: null })
            .eq("id", userData?.[0].id);
          if (error1) throw new Error(`${error1.message}`);
          setUser(user => {
            return { ...user, streak_start: null, prev_log: null };
          });
        }

        console.log(userData?.[0]);

        //get weekly log data for this week
        const startOfWeek = date.startOf("isoWeek");
        const formattedStartOfWeek = startOfWeek.format("YYYY-MM-DD");
        const formattedStartOfLastWeek = startOfWeek
          .subtract(1, "week")
          .format("YYYY-MM-DD");

        const { data: weeklyLogData, error: error3 } = await supabase
          .from("weekly_log")
          .select("*")
          .eq("user_id", userId)
          .in("first_day_date", [formattedStartOfWeek, formattedStartOfLastWeek]);
        if (error3) throw new Error(`${error3.message}`);

        const thisWeek = weeklyLogData.find(
          week => week.first_day_date === formattedStartOfWeek
        );
        if (!thisWeek) {
          const { data: currentWeekData, error: error4 } = await supabase
            .from("weekly_log")
            .insert([{ user_id: userId, first_day_date: formattedStartOfWeek }])
            .select();
          if (error4) throw new Error(`${error4.message}`);
          setCurrentWeek(currentWeekData[0]);
        } else {
          setCurrentWeek(thisWeek);
        }

        const prevWeek = weeklyLogData.find(
          week => week.first_day_date === formattedStartOfLastWeek
        );

        if (prevWeek) setPrevWeek(prevWeek);
        else
          setPrevWeek({
            first_day_date: formattedStartOfLastWeek,
            mon: 0,
            tue: 0,
            wed: 0,
            thu: 0,
            fri: 0,
            sat: 0,
            sun: 0,
          });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();

    return () => {
      ignore = true;
    };
  }, [setCurrentWeek, setPrevWeek, setUser]);

  return (
    <>
      <SettingsSlideIn
        user={user}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        currentTimerOption={currentTimerOption}
        setTimeLeft={setTimeLeft}
      />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <TimerNav
            user={user}
            intervalRef={intervalRef}
            setTimeLeft={setTimeLeft}
            currentTimerOption={currentTimerOption}
            setIsPlaying={setIsPlaying}
            setCurrentTimerOption={setCurrentTimerOption}
          />
          <Clock timeLeft={timeLeft} />
          <Controls
            user={user}
            setUser={setUser}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            intervalRef={intervalRef}
            currentTimerOption={currentTimerOption}
            setIsSettingsOpen={setIsSettingsOpen}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
        </div>
      </div>
    </>
  );
}
