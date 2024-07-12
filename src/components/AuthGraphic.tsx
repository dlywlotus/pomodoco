import styles from "../styles/AuthGraphic.module.css";
import image from "../images/studying.svg";

export default function AuthGraphic() {
  return (
    <div className={styles.graphic}>
      <img src={image} alt='graphic' draggable='false' />
      <div className={styles.text}>
        <div className={styles.title}>Pomodoco</div>
        <div className={styles.flex_row}>
          <span>Learn</span>
          <span style={{ color: " var(--clr-accent-400)" }}>.</span>
          <span>Analyze</span>
          <span style={{ color: " var(--clr-accent-400)" }}>.</span>
          <span>Improve</span>
        </div>
      </div>
    </div>
  );
}
