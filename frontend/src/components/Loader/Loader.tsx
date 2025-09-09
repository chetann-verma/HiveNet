import classes from "./Loader.module.scss";

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

        <img src="/Logo.png" alt="Loading..." />
      </div>
    </div>
  );
}
