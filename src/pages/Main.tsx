import { createContext, useState } from "react";
import Header from "../components/Header";
import Pomodoro from "../components/Pomodoro";
import DashboardSlideDown from "../animatedComponents/DasboardSlideDown";
import { week } from "../types";

export type user = {
  id: string;
  durations: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  volume: number;
  sound: string;
  prev_log: string;
  streak_start: string;
  total_time: number;
};

type SetUserContextType = {
  setUser: React.Dispatch<React.SetStateAction<user>>;
};

export const SetUserContext = createContext<SetUserContextType | null>(null);

export default function Main() {
  const [user, setUser] = useState<user>({
    id: "",
    durations: { pomodoro: 25, shortBreak: 1, longBreak: 15 },
    volume: 65,
    sound: "success",
    prev_log: "2024-07-08",
    streak_start: "2024-07-01",
    total_time: 4200,
  });
  const [currentWeek, setCurrentWeek] = useState<week>({
    first_day_date: "2024-07-01",
    mon: 320,
    tue: 360,
    wed: 480,
    thu: 240,
    fri: 120,
    sat: 450,
    sun: 140,
  });
  const [prevWeek, setPrevWeek] = useState<week>({
    first_day_date: "2024-07-08",
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  });
  const [isShowDashboard, setIsShowDashboard] = useState(false);
  return (
    <>
      <SetUserContext.Provider value={{ setUser }}>
        <Header user={user} setIsShowDashboard={setIsShowDashboard} />
        <Pomodoro
          user={user}
          setUser={setUser}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          setPrevWeek={setPrevWeek}
        />
        <DashboardSlideDown
          user={user}
          isShowDashboard={isShowDashboard}
          setIsShowDashboard={setIsShowDashboard}
          currentWeek={currentWeek}
          prevWeek={prevWeek}
        />
      </SetUserContext.Provider>
    </>
  );
}
