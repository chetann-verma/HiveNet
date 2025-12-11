
import type { Dispatch, SetStateAction } from 'react';
import classes from './Profile.module.scss';
import { useAuthentication } from '../../../features/authentication/contexts/AuthenticationContextProvider';
import { Button } from '../../Button/Button';
import { Link, useNavigate } from 'react-router-dom';
interface ProfileProps{
   setShowNavigationMenu: Dispatch<SetStateAction<boolean>>;
   showProfileMenu: boolean;
   setShowProfileMenu: Dispatch<SetStateAction<boolean>>;
}
//grab our props
export function Profile({setShowNavigationMenu, showProfileMenu, setShowProfileMenu}: ProfileProps)
{
     //grab our logout function
    const {logout, user} = useAuthentication();
    const navigate = useNavigate();
    return (
        <div className={classes.root}>
            {/* button use class of toggle */}
            <button className={classes.toggle} onClick={() => {
                // when click on we change the state of profile menu & also close navigation menu only if we are on small screen
                setShowProfileMenu((prev) => !prev);
                if(window.innerWidth <= 1080)
                {
                    setShowNavigationMenu(false);
                }
            }}
            >
                {/*rendering an image either if user has a profile picture or default avatar image*/}
                <img className={`${classes.top} ${classes.avatar}`}
                src={user?.profilePicture || "/me.jpeg"} alt=''
                />
                {/* below profile pic we have user name and the last name first char and a dot */}
                <div className={classes.name}>
                    <div>{user?.firstName + " " + user?.lastName?.charAt(0) + "."}</div>
                </div>
              </button>
{/* pop up function whe show profile */}
                {showProfileMenu ? (
        <div className={classes.menu}>
          <div className={classes.content}>
            <img
              className={`${classes.left} ${classes.avatar}`}
              src={
                user?.profilePicture || "/me.jpeg"
              }
              alt=""
            />
            <div className={classes.right}>
              <div className={classes.name}>{user?.firstName + " " + user?.lastName}</div>
              <div className={classes.title}>{user?.position + " at " + user?.company}</div>
            </div>
          </div>
          <div className={classes.links}>
            {/* view profile page */}
            <Button
              size="small"
              outline
              onClick={() => {
                setShowProfileMenu(false);
                navigate("/profile/" + user?.id);
              }}
            >
              View Profile
            </Button>

            <Link className={classes.link} to="/settings" onClick={() => setShowProfileMenu(false)}>
            Settings & Privacy
            </Link>

            <Link className={classes.link} to="/logout"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Sign Out
            </Link>
          </div>
          </div>
      ) : null}
        </div>        
    );
}