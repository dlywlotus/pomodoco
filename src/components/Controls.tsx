import styles from "../styles/Controls.module.css";
import { useRef, useState } from "react";
import { TimerOptions } from "./Pomodoro";
import { user } from "../pages/Main";
import timerSounds from "../timerSounds";
import supabase from "../supabase";
import dayjs from "dayjs";
import { week } from "../types";

type props = {
  timeLeft: number;
  isPlaying: boolean;
  intervalRef: React.MutableRefObject<any>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  currentTimerOption: TimerOptions;
  user: user;
  setUser: React.Dispatch<React.SetStateAction<user>>;
  currentWeek: week;
  setCurrentWeek: React.Dispatch<React.SetStateAction<week>>;
};

export default function Controls({
  user,
  setUser,
  timeLeft,
  setTimeLeft,
  isPlaying,
  setIsPlaying,
  currentWeek,
  setCurrentWeek,
  intervalRef,
  currentTimerOption,
  setIsSettingsOpen,
}: props) {
  const startTimeRef = useRef<number>(0);
  const timeLeftRef = useRef<number>(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setTimeLeft(Number(user?.durations[currentTimerOption]) * 60);
  };

  const updateDatabase = async () => {
    try {
      if (user.id === "") return;

      const date = dayjs();
      const currentDate = dayjs().format("YYYY-MM-DD");
      const formattedStartOfWeek = date.startOf("isoWeek").format("YYYY-MM-DD");
      const day = date.format("ddd").toLocaleLowerCase();
      const completedDuration = Number(user?.durations[currentTimerOption]);
      const newTotalTime = user.total_time + completedDuration;

      //set start of streak
      if (user.streak_start === null) {
        const { error: error1 } = await supabase
          .from("users")
          .update({ streak_start: currentDate })
          .eq("id", user.id);
        if (error1) throw new Error(`${error1.message}`);
        setUser(user => {
          return { ...user, streak_start: currentDate };
        });
      }

      //update prev logged day
      if (user.prev_log !== currentDate) {
        const { error: error2 } = await supabase
          .from("users")
          .update({ prev_log: currentDate })
          .eq("id", user.id);
        if (error2) throw new Error(`${error2.message}`);
        setUser(user => {
          return { ...user, prev_log: currentDate };
        });
      }

      //increment total duration
      const { error: error3 } = await supabase
        .from("users")
        .update({ total_time: newTotalTime })
        .eq("id", user.id);
      if (error3) throw new Error(`${error3.message}`);
      setUser(user => {
        return { ...user, total_time: newTotalTime };
      });

      //update weekly data
      const todayTotaTime = Number(currentWeek[day as keyof week]);
      const { error: error4 } = await supabase
        .from("weekly_log")
        .update({ [day]: todayTotaTime + completedDuration })
        .eq("user_id", user.id)
        .eq("first_day_date", formattedStartOfWeek);
      if (error4) throw new Error(`${error4.message}`);
      setCurrentWeek({
        ...(currentWeek as week),
        [day]: todayTotaTime + completedDuration,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTimerComplete = () => {
    resetTimer();
    let audio = new Audio(timerSounds[user.sound]);
    audio.volume = user.volume / 100;
    audio.play();
    currentTimerOption === "pomodoro" && updateDatabase();
  };

  const handleStartNPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const timeElapsedInSeconds = Math.trunc(
          (Date.now() - startTimeRef.current) / 1000
        );
        setTimeLeft(timeLeft - timeElapsedInSeconds);
        timeLeftRef.current = timeLeft - timeElapsedInSeconds;
        if (timeLeftRef.current <= 0) handleTimerComplete();
      }, 10);
    }
  };

  return (
    <div className={styles.controls}>
      <button
        className={styles.btn_start}
        onClick={handleStartNPause}
        data-active={isPlaying}
      >
        {isPlaying ? "Pause" : "Start"}
      </button>
      <button
        className={styles.btn_icon}
        onClick={() => {
          resetTimer();
          setIsSpinning(true);

          setTimeout(() => setIsSpinning(false), 1000);
        }}
        data-rotate={isSpinning}
      >
        <i className='fa-solid fa-arrow-rotate-right'></i>
      </button>
      <button className={styles.btn_icon} onClick={() => setIsSettingsOpen(true)}>
        <i className='fa-solid fa-gear'></i>
      </button>
    </div>
  );
}
