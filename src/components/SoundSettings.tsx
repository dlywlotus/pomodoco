import styles from "../styles/SoundSettings.module.css";
import SelectMenu from "./SelectMenu";
import CustomVolumeSlider from "./CustomVolumeSlider";

type props = {
  sound: string;
  setSound: React.Dispatch<React.SetStateAction<string>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
};

export default function SoundSettings({
  sound,
  setSound,
  volume,
  setVolume,
}: props) {
  return (
    <div className={styles.sound_settings}>
      <div className={styles.header}>
        <i className='fa-solid fa-volume-high'></i>
        <span>Audio</span>
      </div>
      <div className={styles.two_columns}>
        <div className={styles.label}>Sound</div>
        <SelectMenu sound={sound} setSound={setSound} volume={volume} />
      </div>
      <div className={styles.two_columns}>
        <div className={styles.label}>Volume</div>
        <CustomVolumeSlider volume={volume} setVolume={setVolume} sound={sound} />
      </div>
    </div>
  );
}
