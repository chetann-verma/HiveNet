import { Outlet } from "react-router-dom";
import classes from "./ApplicationLayout.module.scss";
import { Header } from "../Header/Header";
export function ApplicationLayout()
{
    return (
      <div className={classes.root}>
        {/* render the header thru header component */}
        <Header/>
        {/* render the pages from react router */}
        <main>
            <Outlet/>
        </main>
      </div>  
    );
}