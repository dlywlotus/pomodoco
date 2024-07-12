import { CSSTransition } from "react-transition-group";
import Settings from "../components/Settings";
import styles from "../styles/Settings.module.css";
import { useRef } from "react";
import { user } from "../pages/Main";
import { TimerOptions } from "../components/Pomodoro";

type props = {
  user: user;
  currentTimerOption: TimerOptions;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SettingsSlideIn({
  user,
  currentTimerOption,
  setTimeLeft,
  isSettingsOpen,
  setIsSettingsOpen,
}: props) {
  const modalRef = useRef(null);

  return (
    <>
      <div
        className={styles.overlay}
        data-show={isSettingsOpen}
        onClick={e => {
          if ((e.target as HTMLElement).closest("#settings-modal")) return;
          setIsSettingsOpen(false);
        }}
      ></div>
      <CSSTransition
        in={isSettingsOpen}
        timeout={300}
        classNames='slideIn'
        unmountOnExit
        nodeRef={modalRef}
      >
        <Settings
          user={user}
          currentTimerOption={currentTimerOption}
          setTimeLeft={setTimeLeft}
          setIsSettingsOpen={setIsSettingsOpen}
          ref={modalRef}
        />
      </CSSTransition>
    </>
  );
}
