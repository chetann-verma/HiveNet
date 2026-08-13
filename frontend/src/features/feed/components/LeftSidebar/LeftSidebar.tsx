import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import classes from "./LeftSidebar.module.scss";
import wallpaperSrc from "../../../../assets/wallpaper.jpg";
import defaultAvatarSrc from "../../../../assets/me.jpeg";
export function LeftSidebar()
{
    const {user} = useAuthentication();
    return (
        <div className={classes.root}>
            <div className={classes.cover}>
                <img src={wallpaperSrc} alt="Cover"/>
            </div>
            <div className={classes.avatar}>
                <img src={user?.profilePicture || defaultAvatarSrc} alt=""/>
            </div>
            <div className={classes.name}>{user?.firstName + " " + user?.lastName}</div>
            <div className={classes.title}>{user?.position + " at " + user?.company}</div>
            <div className={classes.info}>
                <div className={classes.item}>
                    <div className={classes.label}>Profile viewers</div>
                    <div className={classes.value}>1,234</div>
                </div>
                <div className={classes.item}>
                    <div className={classes.label}>Connections</div>
                    <div className={classes.value}>4,567</div>
                </div>
            </div>
        </div>
    );
}