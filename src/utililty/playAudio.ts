import timerSounds from "../timerSounds";

const playAudio = (
  volume: number,
  sound: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | undefined>
) => {
  if (audioRef.current && audioRef.current.currentTime > 0)
    audioRef.current?.pause();
  audioRef.current = new Audio(timerSounds[sound]);
  audioRef.current.volume = volume / 100;
  audioRef.current.play();
};

export default playAudio;
