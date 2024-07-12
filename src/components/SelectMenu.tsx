import styles from "../styles/SelectMenu.module.css";
import { useState, useEffect, useRef } from "react";
import playAudio from "../utililty/playAudio";
import { CSSTransition } from "react-transition-group";

type props = {
  sound: string;
  volume: number;
  setSound: React.Dispatch<React.SetStateAction<string>>;
};

export default function SelectMenu({ sound, setSound, volume }: props) {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | undefined>();

  const onSelectOption = (optionValue: string) => {
    setSound(optionValue);
    playAudio(volume, optionValue, audioRef);
  };

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("#select-input")) return;
      setIsShowDropdown(false);
    };
    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div id='select-input' className={styles.select_menu}>
      <div
        className={styles.select_input}
        onClick={() => {
          setIsShowDropdown(!isShowDropdown);
        }}
        data-active={isShowDropdown}
      >
        <div className={styles.selected_value}>{sound}</div>
        <i
          className='fa-solid fa-chevron-down'
          data-dropdown-open={isShowDropdown}
        ></i>
      </div>

      <CSSTransition
        in={isShowDropdown}
        timeout={300}
        classNames='selectMenu'
        unmountOnExit
      >
        <div className={styles.select_dropdown} data-show={isShowDropdown}>
          <Option value={"success"} sound={sound} onSelectOption={onSelectOption} />
          <Option value={"bell"} sound={sound} onSelectOption={onSelectOption} />
          <Option value={"arcade"} sound={sound} onSelectOption={onSelectOption} />
          <Option value={"bird"} sound={sound} onSelectOption={onSelectOption} />
        </div>
      </CSSTransition>
    </div>
  );
}

type optionProps = {
  value: string;
  sound: string;
  onSelectOption: (optionValue: string) => void;
};

function Option({ value, sound, onSelectOption }: optionProps) {
  return (
    <div
      className={styles.option}
      id={value}
      data-active={sound === value}
      onClick={() => onSelectOption(value)}
    >
      {value}
    </div>
  );
}
