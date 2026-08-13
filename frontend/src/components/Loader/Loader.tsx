import classes from "./Loader.module.scss";
import logoSrc from "../../assets/Logo.png";

export function Loader() {
  return (
    <div className={classes.root}>
      <div className={classes.hexWrapper}>
        <span className={classes.hex}></span>
        <span className={`${classes.hex} ${classes.reverse}`}></span>
        
        {/* Orbiting dots */}
        <div className={classes.orbit}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <img src={logoSrc} alt="Loading..." />
      </div>
    </div>
  );
}
