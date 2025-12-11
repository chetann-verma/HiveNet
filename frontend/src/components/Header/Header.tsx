import { NavLink } from 'react-router-dom';
import classes from './Header.module.scss';
import { Input } from '../Input/Input';
import { useAuthentication } from '../../features/authentication/contexts/AuthenticationContextProvider';
import { useEffect, useState } from 'react';
import { Profile } from './components/Profile';
export function Header() {
    //we have a user from authentication
    const { user } = useAuthentication();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    //change according to screen the screen bigger than number to display this screen
    const [showNavigationMenu, setShowNavigationMenu] = useState(window.innerWidth > 1080 ? true : false);

    //define handel resize function
    useEffect(() => {
        const handleResize = () => {
            //give the navigation window width
            setShowNavigationMenu(window.innerWidth > 1080)
        }
        //event happens and to not make it again again
        window.addEventListener("resize", handleResize);
//we need to remove this event when compnent removed from screen
        return ()=> window.removeEventListener("resize", handleResize);
    }, [])

    return (
        <header className={classes.root}>
            {/* because the page is inside a container  */}
            <div className={classes.container}>
                {/* for logo and search bar */}
                <div className={classes.left}>
                    {/* nav link to return to home page when click logo */}
                    <NavLink to="/">
                        <img src="/Logo.png" alt="" />

                    </NavLink>
                    <Input placeholder="Search" size={"medium"} />
                </div>
                <div className={classes.right}>

                    <button className={classes.toggle} onClick={() => {
                        // state to show anvigation menu
                        setShowNavigationMenu((prev) => !prev);
                        // to show the profile pop up
                        setShowProfileMenu(false);
                    }}>
                        {/* menu image */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
                        </svg> */}
                        <span>Menu</span>
                    </button>
{/* show navigation menu */}
{showNavigationMenu ? (
            <ul>
              <li>
                {/* if it clicks any of the links the profile should be close */}
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                  onClick={() => {
                    setShowProfileMenu(false);
                    //but for navigation close only if on mobile phone
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                    focusable="false"
                  >
                    <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                  </svg> */}
                  <span>Explore</span>
                </NavLink>
              </li>
              <li>                
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);                    
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/network"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                  </svg> */}
                    <span>MyHive</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/job" className={({ isActive}) => (isActive ? classes.active : "")}
                onClick={() => {
                    setShowProfileMenu(false);
                    if(window.innerWidth <= 1080)
                    {
                        setShowNavigationMenu(false);
                    }
                }}
                >
                    {/* <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 954.175 954.175"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M854,747.388c-15.7-15.701-36.6-23-57.2-21.801l-55.2-55.199c22.4-28.6,40.9-60,55.2-93.801 c21.601-51.199,32.601-105.5,32.601-161.4c0-55.9-11-110.3-32.601-161.4c-20.899-49.4-50.8-93.7-88.899-131.8 c-38.101-38.1-82.4-68-131.801-88.9c-51.199-21.6-105.5-32.6-161.399-32.6c-55.9,0-110.3,11-161.4,32.6 c-49.4,20.8-93.7,50.7-131.8,88.8s-68,82.4-88.9,131.8C11,304.888,0,359.188,0,415.088c0,55.899,11,110.3,32.6,161.4 c20.9,49.4,50.8,93.699,88.9,131.801c38.1,38.1,82.4,68,131.8,88.898c51.2,21.602,105.5,32.602,161.4,32.602 c55.899,0,110.3-11,161.399-32.602c34.2-14.5,66-33.199,94.9-56.1l55.1,55.1c-1.1,20.602,6.101,41.5,21.801,57.201l78.3,78.299 c14.6,14.602,33.8,22,53,22s38.399-7.299,53-22c29.3-29.299,29.3-76.799,0-106.1L854,747.388z M670.2,598.888 c-9.9,13.6-20.9,26.6-33,38.699c-11.8,11.801-24.4,22.5-37.601,32.1c-53.399,39-117.6,60-185,60 c-84.1,0-163.1-32.699-222.5-92.199c-59.4-59.4-92.2-138.5-92.2-222.5c0-84,32.7-163.1,92.2-222.5 c59.4-59.4,138.5-92.2,222.5-92.2s163.101,32.7,222.5,92.2c59.4,59.4,92.2,138.5,92.2,222.5 C729.4,481.988,708.7,545.687,670.2,598.888z"></path> <g> <path d="M386,193.688h57.5c18,0,32.9,14.2,35.7,32.6h50.3c-3.2-46.1-40.5-82.6-86-82.6H386c-45.5,0-82.8,36.5-86,82.6h50.3 C353,207.788,368,193.688,386,193.688z"></path> <path d="M529.7,251.288h-50h-130h-50h-81.5c-15.2,0-32.3,14.5-41.6,23.6c-5.8,7-6.9,11.8-6.4,17.2c3.7,35.9,27.6,69.7,68.1,96.3 c35.9,23.5,81,39,130.2,44.9c15,1.8,30.5,2.8,46.1,2.8c28.9,0,57.101-3.2,83.5-9.3c34.7-8,66.301-21,92.9-38.4 c40.5-26.6,64.3-60.5,68.1-96.3c0.601-5.5-2.399-13.4-6.399-17.2c-9.3-9.1-26.4-23.6-41.601-23.6H529.7L529.7,251.288z"></path> <path d="M613.1,421.888c-24.199,15.9-52,28.6-82.199,37.6c-36.101,10.9-75.5,16.601-116.2,16.601c-2.9,0-5.9,0-8.8-0.101 c-71.4-1.399-138.4-20.5-189.601-54.1c-21.6-14.2-39.5-30.4-53.5-48.3c-3.4-4.4-5.9-3.6-5.9,1.899v139.401 c0,35.299,27.4,64,61.2,64h290.5h102.5c11.101,0,21.5-3.1,30.4-8.5c18.4-11,30.8-31.701,30.8-55.5v-139.3 c0-5.5-2.5-6.3-5.899-1.9C652.6,391.487,634.7,407.688,613.1,421.888z"></path> </g> </g> </g> </g></svg> */}
                    <span>Work Cell</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/messaging"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                  </svg> */}
                   <span>Talks</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavigationMenu(false);
                    }
                  }}
                  to="/notifications"
                  className={({ isActive }) => (isActive ? classes.active : "")}
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    focusable="false"
                  >
                    <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                  </svg> */}
                    <span>Alerts</span>
                </NavLink>
              </li>
            </ul>
          ) : null}
                    {
                        // if a user wnat to render this profile component that will be defining
                        user ? (
                            <Profile
                                //we are passing this becoz if we have opened navigation menu and then profile we can cross it so we need define it as a prop
                                setShowNavigationMenu={setShowNavigationMenu} showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} />
                        ) : null}
                </div>
            </div>
        </header>
    );
}