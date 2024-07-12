import styles from "../styles/TimerNav.module.css";
import { TimerOptions } from "./Pomodoro";
import toCamelCase from "../utililty/toCameCase";
import { user } from "../pages/Main";

type props = {
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  intervalRef: React.MutableRefObject<undefined>;
  currentTimerOption: string;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setCurrentTimerOption: React.Dispatch<React.SetStateAction<TimerOptions>>;
  user: user;
};

type navButtonProps = {
  option: string;
  currentTimerOption: string;
  onClick: (option: string) => void;
};

export default function TimerNav({
  user,
  setIsPlaying,
  setTimeLeft,
  intervalRef,
  currentTimerOption,
  setCurrentTimerOption,
}: props) {
  const onClick = (option: string) => {
    const camelCased = toCamelCase(option);
    setCurrentTimerOption(camelCased);
    setTimeLeft(Number(user?.durations[camelCased]) * 60);
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  return (
    <div className={styles.btn_row}>
      <TimerNavButton
        onClick={onClick}
        option={"Pomodoro"}
        currentTimerOption={currentTimerOption}
      />
      <TimerNavButton
        onClick={onClick}
        option={"Short break"}
        currentTimerOption={currentTimerOption}
      />
      <TimerNavButton
        onClick={onClick}
        option={"Long break"}
        currentTimerOption={currentTimerOption}
      />
    </div>
  );
}

function TimerNavButton({ option, onClick, currentTimerOption }: navButtonProps) {
  const camelCased = toCamelCase(option);

  return (
    <>
      <button
        className={styles.btn}
        onClick={() => {
          onClick(option);
        }}
        data-active={currentTimerOption === camelCased}
      >
        {option}
      </button>
    </>
  );
}
