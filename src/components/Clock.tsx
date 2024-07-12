import styles from "../styles/Clock.module.css";

type props = {
  timeLeft: number;
};

export default function Clock({ timeLeft }: props) {
  const min = String(Math.trunc(timeLeft / 60));
  const sec = String(timeLeft % 60);
  const minutes = min.length < 2 ? "0" + min : min;
  const seconds = sec.length < 2 ? "0" + sec : sec;
  return (
    <>
      <div className={styles.clock}>
        {minutes}
        <span>:</span>
        {seconds}
      </div>
    </>
  );
}
