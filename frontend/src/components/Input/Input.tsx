import type { InputHTMLAttributes } from 'react';
import classes from './Input.module.scss'
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    //size property for differnet sizes
    size?: "small" | "medium" | "large"
};
export function Input({label, size, width, ...others}: InputProps) {
  return (
    // render root class and class size if not mention large 
    <div className={`${classes.root} ${classes [size || "large"]}`}><label>{label}</label>
    <input {...others} 
    style={
      // if width comes from props then redner it to it and if not render to 100%
      {width: width? `${width}px` : "100%"}
    }/>      
    </div>
  );
}
