import "../styles/CustomVolumeSlider.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRef } from "react";
import playAudio from "../utililty/playAudio";

type props = {
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  sound: string;
};

export default function CustomVolumeSlider({ volume, setVolume, sound }: props) {
  const audioRef = useRef<HTMLAudioElement | undefined>();

  const onChange = (num: number | number[]) => {
    setVolume(num as number);
  };

  const onChangeComplete = (num: number | number[]) => {
    playAudio(num as number, sound, audioRef);
    console.log(num, volume);
  };

  return (
    <div className='custom_slider'>
      <Slider
        value={volume}
        min={0}
        max={100}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
        dotStyle={{}}
        activeDotStyle={{ color: "black" }}
      />
    </div>
  );
}
