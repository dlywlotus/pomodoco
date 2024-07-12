import { forwardRef, useState } from "react";
import styles from "../styles/Settings.module.css";
import DurationSettings from "./DurationSettings";
import SoundSettings from "./SoundSettings";
import supabase from "../supabase";
import { useContext } from "react";
import { SetUserContext } from "../pages/Main";
import { user } from "../pages/Main";
import { TimerOptions } from "./Pomodoro";
import { Link } from "react-router-dom";

type props = {
  user: user;
  currentTimerOption: TimerOptions;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default forwardRef(function Settings(
  { user, setIsSettingsOpen, setTimeLeft, currentTimerOption }: props,
  ref
) {
  const [durations, setDurations] = useState(user.durations);
  const [sound, setSound] = useState(user.sound);
  const [volume, setVolume] = useState(user.volume);

  const setUserContext = useContext(SetUserContext);
  if (!setUserContext) return null;
  const { setUser } = setUserContext;

  const saveChanges = async () => {
    try {
      setIsSettingsOpen(false);
      const newDurations = Object.values(durations).join("#");
      const { data, error } = await supabase
        .from("users")
        .update({ sound, volume, durations: newDurations })
        .eq("id", user.id)
        .select();
      if (error) throw new Error(`${error.message}`);

      setUser({
        ...data?.[0],
        durations,
      });
      setTimeLeft(durations[currentTimerOption] * 60);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      id='settings-modal'
      className={styles.modal}
      ref={ref as React.LegacyRef<HTMLDivElement> | undefined}
    >
      <header>
        <div>Settings</div>
        <button
          className={styles.btn_exit}
          onClick={() => {
            setIsSettingsOpen(false);
          }}
        >
          <i className='fa-solid fa-xmark'></i>
        </button>
      </header>

      <div className={styles.container}>
        {user.id === "" && (
          <div className={styles.message_overlay}>
            <div className={styles.message}>
              <Link to='/login'>Log in</Link> to edit your settings
            </div>
          </div>
        )}
        <DurationSettings durations={durations} setDurations={setDurations} />
        <SoundSettings
          sound={sound}
          setSound={setSound}
          volume={volume}
          setVolume={setVolume}
        />
        <button className={styles.btn_save} onClick={saveChanges}>
          Save changes
        </button>
      </div>
    </div>
  );
});
