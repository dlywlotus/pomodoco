import styles from "../styles/DurationSettings.module.css";

type props = {
  durations: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  setDurations: React.Dispatch<
    React.SetStateAction<{
      pomodoro: number;
      shortBreak: number;
      longBreak: number;
    }>
  >;
};

export default function DurationSettings({ durations, setDurations }: props) {
  return (
    <div>
      <div className={styles.header}>
        <i className='fa-solid fa-clock'></i>
        <span>Timer</span>
      </div>
      <div className={styles.durations}>
        <div>
          <div className={styles.label}>Pomodoro:</div>
          <CustomNumberPicker
            type='pomodoro'
            durations={durations}
            setDurations={setDurations}
          />
        </div>
        <div>
          <div className={styles.label}> Short break:</div>
          <CustomNumberPicker
            type='shortBreak'
            durations={durations}
            setDurations={setDurations}
          />
        </div>
        <div>
          <div className={styles.label}>Long break:</div>
          <CustomNumberPicker
            type='longBreak'
            durations={durations}
            setDurations={setDurations}
          />
        </div>
      </div>
    </div>
  );
}

type CustomNumberPickerProps = {
  type: "pomodoro" | "shortBreak" | "longBreak";
  durations: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  setDurations: React.Dispatch<
    React.SetStateAction<{
      pomodoro: number;
      shortBreak: number;
      longBreak: number;
    }>
  >;
};

const CustomNumberPicker = ({
  type,
  durations,
  setDurations,
}: CustomNumberPickerProps) => {
  const updateDurations = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDurations({ ...durations, [type]: e.target.value });
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (durations[type] <= 1) return;
    const change = (e.target as HTMLElement).closest("button")?.dataset.id;
    if (change === "increase")
      setDurations({ ...durations, [type]: durations[type] + 1 });
    else setDurations({ ...durations, [type]: durations[type] - 1 });
  };

  return (
    <div className={styles.custom_input}>
      <input type='number' value={durations[type]} onChange={updateDurations} />
      <div className={styles.input_btns} onClick={onClick}>
        <button className={styles.btn_up} data-id='increase'>
          <i className='fa-solid fa-chevron-up'></i>
        </button>
        <button className={styles.btn_down} data-id='decrease'>
          <i className='fa-solid fa-chevron-down'></i>
        </button>
      </div>
      <div className={styles.unit_label}>min</div>
    </div>
  );
};
